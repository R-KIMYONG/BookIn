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

  const updateAvatarImgMutation = useMutation({
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
    onSettled: () => {
      if (avatarImgRef.current) {
        avatarImgRef.current.value = '';
      }
    },
  });

  const handleAvatarUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
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
      try {
        await toastMutationPromise(updateAvatarImgMutation.mutateAsync(file), '아바타 업로드 중...');
      } catch (error) {
        console.error(error);
      }
    },
    [updateAvatarImgMutation]
  );
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white/80 bg-white shadow-md sm:h-24 sm:w-24">
        <Image src={userAvatar || '/images/noImg.png'} alt="avatarImg" className="object-cover" priority fill />
      </div>

      {/* <ButtonComponent
        type="button"
        label={updateAvatarImgMutation.isPending ? '업로드 중...' : '프로필 변경'}
        variant="outline"
        size="xs"
        className="!rounded-full !border-white/60 !bg-white/10 !px-4 !text-white hover:!bg-white hover:!text-[#7f3f3f]"
        onClick={() => avatarImgRef.current?.click()}
        disabled={updateAvatarImgMutation.isPending}
      /> */}

      <input
        ref={avatarImgRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.gif"
        onChange={handleAvatarUpload}
      />
    </div>
  );
};

export default AvatarUploadSection;
