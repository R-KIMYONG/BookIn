import toastMutationPromise from '@/app/lib/toast/toastMutationPromise';
import { isImageExtension } from '@/app/lib/validation/isImageExtension';
import ButtonComponent from '@/components/common/ButtonComponent';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

const AvatarUploadSection = ({ userAvatar, userId }: { userAvatar: string; userId: string }) => {
  const avatarImgRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const updateAvatarImg = useMutation({
    mutationFn: async (imgFile: File) => {
      const formData = new FormData();
      formData.append('imgFile', imgFile);
      const res = await fetch('/api/user/avatar', {
        method: 'PATCH',
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? '아바타 업데이트 실패');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', userId] });
    },
    onError: (error: Error) => {
      toast.error(error.message, { position: 'top-right' });
    },
    onSettled: () => {
      if (avatarImgRef.current) {
        avatarImgRef.current.value = '';
      }
    },
  });

  const handleAvatarUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files!;
      const maxFileSize = 5 * 1024 * 1024;

      if (!files || !files[0]) {
        toast.error('아바타 업로드를 취소하셨습니다.', {
          position: 'top-right',
        });
        return;
      }
      const file = files[0];
      if (!isImageExtension(file)) {
        console.error('지원하지 않는 파일 형식입니다. JPG, JPEG, PNG, GIF 파일만 업로드 가능합니다.');
        toast.error('지원하지 않는 파일 형식입니다. JPG, JPEG, PNG, GIF 파일만 업로드 가능합니다.', {
          position: 'top-right',
        });
        return;
      }
      if (file.size > maxFileSize) {
        console.error('파일 용량이 초과되었습니다. 5MB 이하의 파일만 업로드 가능합니다.');
        toast.error('파일 용량이 초과되었습니다. 5MB 이하의 파일만 업로드 가능합니다.', {
          position: 'top-right',
        });
        return;
      }
      toastMutationPromise(updateAvatarImg.mutateAsync(file), '아바타 업로드 중...');
    },
    [updateAvatarImg]
  );
  return (
    <>
      <div className="relative aspect-square w-14 sm:w-16 md:w-20 lg:w-24 overflow-hidden box-border">
        <Image src={userAvatar || '/images/noImg.png'} alt="avatarImg" className="object-cover" priority fill />
      </div>
      <div>
        <ButtonComponent
          type="button"
          label="업로드"
          variant="outline"
          size="xs"
          onClick={() => avatarImgRef.current?.click()}
          disabled={updateAvatarImg.isPending}
        />

        <input
          ref={avatarImgRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.gif"
          onChange={handleAvatarUpload}
        />
      </div>
    </>
  );
};

export default AvatarUploadSection;
