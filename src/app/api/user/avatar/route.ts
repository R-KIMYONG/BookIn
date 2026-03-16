import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (req: NextRequest) => {
  const supabase = createClient();
  const maxFileSize = 5 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user)
    return NextResponse.json({ message: '세션이 만료되었습니다. 다시 로그인 해주세요.' }, { status: 401 });

  const formData = await req.formData();
  const imgFile = formData.get('imgFile');

  if (!(imgFile instanceof File)) return NextResponse.json({ message: '이미지 파일이 없습니다.' }, { status: 400 });

  if (!allowedTypes.includes(imgFile.type))
    return NextResponse.json({ message: '이미지 파일만 업로드 가능합니다.' }, { status: 400 });

  if (imgFile.size > maxFileSize)
    return NextResponse.json(
      { message: '파일 용량이 초과되었습니다. 5MB 이하의 파일만 업로드 가능합니다.' },
      { status: 400 }
    );

  const extension = imgFile.name.split('.').pop()?.toLowerCase() ?? 'jpg'; // 확장자 추출

  const possibleFiles = [
    `${user.id}/avatar.jpg`,
    `${user.id}/avatar.jpeg`,
    `${user.id}/avatar.png`,
    `${user.id}/avatar.gif`,
  ];
  const { error: removeError } = await supabase.storage.from('avatars').remove(possibleFiles);

  if (removeError) console.error('기존 아바타 이미지 삭제 오류:', removeError);

  const filePath = `${user.id}/avatar.${extension}`;
  const { data: upload, error: uploadError } = await supabase.storage.from('avatars').upload(filePath, imgFile, {
    cacheControl: '3600',
    upsert: true,
  });
  if (uploadError) return NextResponse.json({ message: uploadError.message }, { status: 500 });

  const avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${upload.path}?t=${Date.now()}`;

  const { error: updateError } = await supabase.from('users').update({ avatar: avatarUrl }).eq('id', user.id);

  if (updateError) {
    await supabase.storage.from('avatars').remove([upload.path]);
    return NextResponse.json({ message: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ message: '아바타 이미지 업데이트 완료', avatarUrl }, { status: 200 });
};
