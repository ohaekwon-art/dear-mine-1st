import { NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set.");
      return NextResponse.json(
        { error: "이메일 전송 API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const { name, email, inquiryType, subject, message } = await req.json();

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "문의 제목과 내용을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    // 발신자 이메일: 환경변수 혹은 기본 onboarding@resend.dev (도메인 미인증 시 테스트용)
    const rawFrom = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const fromEmail = rawFrom.includes("onbording")
      ? rawFrom.replace("onbording", "onboarding")
      : rawFrom;

    // 수신자 이메일: 환경변수 혹은 ohae.kwon@gmail.com
    const toEmail = process.env.RESEND_RECEIVER_EMAIL || "ohae.kwon@gmail.com";

    const cleanName = name?.trim() || "익명 방문자";
    const cleanEmail = email?.trim() || "";
    const cleanType = inquiryType?.trim() || "일반 문의";
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DearMine 웹사이트 문의</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #F4F7F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Apple SD Gothic Neo', sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #D8E5D5; overflow: hidden; box-shadow: 0 4px 16px rgba(40, 60, 37, 0.06);">
    <!-- 상단 헤더 -->
    <div style="background: linear-gradient(135deg, #283C25 0%, #3B5637 100%); padding: 28px 32px; color: #FFFFFF;">
      <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.18); color: #E8F2E6; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 8px;">
        ✉️ WEBSITE INQUIRY
      </span>
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #FFFFFF;">
        새로운 문의사항이 도착했습니다
      </h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #CDE1CB;">
        DearMine 공식 웹사이트를 통해 접수된 메시지입니다.
      </p>
    </div>

    <!-- 내용 본문 -->
    <div style="padding: 32px;">
      <!-- 정보 테이블 -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr style="border-bottom: 1px solid #EDF3EC;">
          <td style="padding: 12px 0; width: 100px; font-size: 13px; font-weight: bold; color: #556D52;">문의 유형</td>
          <td style="padding: 12px 0; font-size: 14px; font-weight: bold; color: #1B2B19;">
            <span style="background-color: #EBF3E8; color: #283C25; padding: 4px 10px; border-radius: 8px; border: 1px solid #D2E3CD; font-size: 12px;">
              ${escapeHtml(cleanType)}
            </span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #EDF3EC;">
          <td style="padding: 12px 0; font-size: 13px; font-weight: bold; color: #556D52;">보낸 분</td>
          <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #1B2B19;">${escapeHtml(cleanName)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #EDF3EC;">
          <td style="padding: 12px 0; font-size: 13px; font-weight: bold; color: #556D52;">회신 이메일</td>
          <td style="padding: 12px 0; font-size: 14px; color: #1B2B19;">
            ${cleanEmail ? `<a href="mailto:${escapeHtml(cleanEmail)}" style="color: #2E5C27; font-weight: bold; text-decoration: underline;">${escapeHtml(cleanEmail)}</a>` : "<span style='color: #8C9F89;'>미기재</span>"}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #EDF3EC;">
          <td style="padding: 12px 0; font-size: 13px; font-weight: bold; color: #556D52;">문의 제목</td>
          <td style="padding: 12px 0; font-size: 15px; font-weight: bold; color: #1B2B19;">${escapeHtml(cleanSubject)}</td>
        </tr>
      </table>

      <!-- 상세 메시지 박스 -->
      <div style="margin-top: 10px; background-color: #FAFBF9; border: 1px solid #DDE7DA; border-radius: 14px; padding: 20px;">
        <div style="font-size: 12px; font-weight: bold; color: #5C7758; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
          📝 문의 내용
        </div>
        <div style="font-size: 14px; line-height: 1.7; color: #233420; white-space: pre-wrap; word-break: break-word;">${escapeHtml(cleanMessage)}</div>
      </div>
    </div>

    <!-- 하단 푸터 -->
    <div style="background-color: #F8FAF7; padding: 18px 32px; border-top: 1px solid #E6EFE4; text-align: center; font-size: 12px; color: #7F977B;">
      DearMine Website • 자동 발송 알림
    </div>
  </div>
</body>
</html>
    `;

    const sendPayload: any = {
      from: `DearMine <${fromEmail}>`,
      to: [toEmail],
      subject: `[DearMine 문의 - ${cleanType}] ${cleanSubject}`,
      html: emailHtml,
    };

    // 회신 이메일이 유효한 형태일 때만 replyTo에 설정
    if (cleanEmail && cleanEmail.includes("@")) {
      sendPayload.replyTo = cleanEmail;
    }

    const { data, error } = await resend.emails.send(sendPayload);

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: error.message || "이메일 발송에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
      message: "문의사항이 성공적으로 전송되었습니다.",
    });
  } catch (err: any) {
    console.error("Unhandled API error:", err);
    return NextResponse.json(
      { error: err?.message || "서버에서 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
