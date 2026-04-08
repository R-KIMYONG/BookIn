import 'server-only';
import { transporter } from './mailer';
import { getPasswordResetTemplate } from './templates/passwordResetTemplate';

export const sendPasswordResetMail = async ({
  email,
  confirmUrl,
}: {
  email: string;
  confirmUrl: string;
}): Promise<void> => {
  const { html, text } = getPasswordResetTemplate(confirmUrl);
  await transporter.sendMail({
    from: `"BookIn Support" <${process.env.NAVER_EMAIL}>`,
    to: email,
    subject: '[BookIn] 비밀번호 찾기 인증 요청',
    html,
    text,
  });
};
