import 'server-only';
import { transporter } from './mailer';

type SendMailParams = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export const sendMail = async ({ to, subject, html, text }: SendMailParams) => {
  await transporter.sendMail({
    from: `"BookIn Support" <${process.env.NAVER_EMAIL}>`,
    to,
    subject,
    html,
    text,
  });
};
