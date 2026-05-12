import 'server-only';
import { getEmailChangeTemplate } from './templates/emailChangeTemplate';
import { sendMail } from './sendMail';


export const sendEmailChangeMail = async ({
  email,
  confirmUrl,
}: {
  email: string;
  confirmUrl: string;
}): Promise<void> => {
  const { html, text } = getEmailChangeTemplate(confirmUrl);
  await sendMail({
    to: email,
    subject: '[BookIn] 이메일 변경 인증 요청',
    html,
    text,
  });
};
