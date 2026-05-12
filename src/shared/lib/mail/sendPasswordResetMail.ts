import 'server-only';
import { getPasswordResetTemplate } from './templates/passwordResetTemplate';
import { sendMail } from './sendMail';

export const sendPasswordResetMail = async ({
  email,
  confirmUrl,
}: {
  email: string;
  confirmUrl: string;
}): Promise<void> => {
  const { html, text } = getPasswordResetTemplate(confirmUrl);

  await sendMail({
    to: email,
    subject: '[BookIn] 비밀번호 찾기 인증 요청',
    html,
    text,
  });
};
