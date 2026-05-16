import toastMutationPromise from '@/shared/lib/toast/toastMutationPromise';
import { isImageExtension } from '@/shared/utils/validation/isImageExtension';
import Button from '@/components/common/ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useCallback, useRef } from 'react';
import { RiCameraLine } from 'react-icons/ri';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';

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
        showToast(RESULT_CODE.COMMON_FILE_UPLOAD_CANCELLED);
        return;
      }
      const file = files[0];
      if (!isImageExtension(file)) {
        showToast(RESULT_CODE.VALIDATION_INVALID_IMAGE_FILE);
        return;
      }
      if (file.size > maxFileSize) {
        showToast(RESULT_CODE.VALIDATION_IMAGE_FILE_TOO_LARGE);
        return;
      }
      try {
        await toastMutationPromise(updateAvatarImgMutation.mutateAsync(file), { pending: '아바타 업로드 중...' });
      } catch (error) {
        console.error(error);
      }
    },
    [updateAvatarImgMutation]
  );
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
        <Image src={userAvatar || '/images/noImg.png'} alt="avatarImg" className="object-cover" priority fill />
      </div>

      <Button
        type="button"
        label="프로필 변경"
        loadingText="업로드 중..."
        variant="outline"
        size="xs"
        className="!rounded-full  !px-4 !py-2  text-gray-700 transition hover:border-[#AF5858] hover:text-[#AF5858]"
        onClick={() => avatarImgRef.current?.click()}
        disabled={updateAvatarImgMutation.isPending}
        leftIcon={<RiCameraLine />}
      />

      <input
        ref={avatarImgRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        onChange={handleAvatarUpload}
      />
    </div>
  );
};

export default AvatarUploadSection;
