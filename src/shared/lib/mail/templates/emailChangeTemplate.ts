export const getEmailChangeTemplate = (confirmUrl: string) => {
  return {
    html: `
  <div style="background:#f6f8fa;padding:40px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;padding:40px;border:1px solid #e5e7eb;">
      <tr>
        <td style="text-align:center;padding-bottom:20px;">
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
            <path
              d="M32 16C35.1826 16 38.2348 17.2643 40.4853 19.5147C42.7357 21.7652 44 24.8174 44 28V42H36V28C36 26.9391 35.5786 25.9217 34.8284 25.1716C34.0783 24.4214 33.0609 24 32 24C30.9391 24 29.9217 24.4214 29.1716 25.1716C28.4214 25.9217 28 26.9391 28 28V42H20V28C20 24.8174 21.2643 21.7652 23.5147 19.5147C25.7652 17.2643 28.8174 16 32 16Z"
              stroke="#1E1E1E"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
           <path
              d="M12 18H4V42H12V18Z"
             stroke="#1E1E1E"
             stroke-width="4"
             stroke-linecap="round"
             stroke-linejoin="round"
            />
           <path
             d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z"
              stroke="#1E1E1E"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
             />
           </svg>
        </td>
      </tr>
      <tr>
        <td style="text-align:center;padding-bottom:20px;">
          <h1 style="margin:0;font-size:22px;color:#111827;">
            BookIn 이메일 변경
          </h1>
        </td>
      </tr>

      <tr>
        <td style="color:#374151;font-size:14px;line-height:1.6;padding-bottom:20px;text-align:center;">
          안녕하세요.<br/>
          이메일 변경 요청이 접수되었습니다.<br/>
          아래 버튼을 눌러 이메일 변경을 완료해주세요.
        </td>
      </tr>

      <tr>
        <td style="text-align:center;padding:30px 0;">
          <a 
            href="${confirmUrl}" 
            style="
              background:#af5858;
              color:#ffffff;
              text-decoration:none;
              padding:12px 24px;
              border-radius:6px;
              font-size:14px;
              font-weight:600;
              display:inline-block;
            ">
            이메일 변경 인증
          </a>
        </td>
      </tr>

      <tr>
        <td style="color:#6b7280;font-size:13px;padding-top:10px;">
          버튼이 작동하지 않는 경우 아래 링크를 복사해서 브라우저에 붙여넣어 주세요.
        </td>
      </tr>

      <tr>
        <td style="padding-top:8px;word-break:break-all;">
          <a href="${confirmUrl}" style="color:#2563eb;font-size:13px;">
            ${confirmUrl}
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding-top:30px;font-size:12px;color:#9ca3af;">
          본인이 요청하지 않았다면 이 이메일은 무시하셔도 됩니다.
        </td>
      </tr>

    </table>
  </div>
`,
    text: `이메일 변경 링크: ${confirmUrl}\n(1시간 유효)`,
  };
};
