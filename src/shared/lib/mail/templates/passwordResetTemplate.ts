export const getPasswordResetTemplate = (confirmUrl: string) => {
  return {
    html: `
      <div style="background:#f6f8fa;padding:40px 0;">
        <table style="max-width:600px;margin:0 auto;background:#fff;padding:40px;border-radius:8px;">
          
          <tr>
            <td style="text-align:center;">
              <h1 style="font-size:22px;">비밀번호 재설정</h1>
            </td>
          </tr>

          <tr>
            <td style="text-align:center;font-size:14px;">
              비밀번호 재설정 요청이 접수되었습니다.<br/>
              아래 버튼을 눌러 비밀번호를 변경해주세요.
            </td>
          </tr>

          <tr>
            <td style="text-align:center;padding:30px;">
              <a href="${confirmUrl}" style="background:#af5858;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">
                비밀번호 재설정
              </a>
            </td>
          </tr>

          <tr>
            <td style="font-size:12px;color:#6b7280;">
              이 링크는 약 1시간 동안 유효합니다.
            </td>
          </tr>

          <tr>
            <td style="font-size:12px;color:#9ca3af;padding-top:20px;">
              요청하지 않았다면 이 메일을 무시하세요.
            </td>
          </tr>

        </table>
      </div>
    `,
    text: `비밀번호 재설정 링크: ${confirmUrl}\n(1시간 유효)`,
  };
};
