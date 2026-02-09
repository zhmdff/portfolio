import { NextResponse } from "next/server";

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;

function generateStyledHtml(text: string, subject: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fafafa;
        }
        .container {
          background-color: #ffffff;
          padding: 40px;
          border: 1px solid #e5e5e5;
          border-radius: 0;
        }
        h1 {
          color: #000;
          margin-top: 0;
          font-size: 24px;
          font-weight: 300;
          letter-spacing: -0.02em;
          border-bottom: 1px solid #000;
          padding-bottom: 15px;
        }
        p {
          margin: 20px 0;
          font-size: 16px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 11px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      </style>
    </head>
    <body>
       <div class="container">
         <h1>zhmdff - New Message: ${subject}</h1>
         <div style="font-size:16px; line-height:1.8; color:#333; margin-bottom:30px; white-space: pre-wrap;">
           ${text}
         </div>
         <div class="footer">
           This is an automated message from your portfolio.<br>
           &copy; ${new Date().getFullYear()} zhmdff. All rights reserved.
         </div>
       </div>
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
  try {
    const { to, subject, text, html } = await request.json();

    if (!to || !subject) {
      return NextResponse.json({ error: "Missing required field: to or subject" }, { status: 400 });
    }

    if (!MAILGUN_DOMAIN || !MAILGUN_API_KEY) {
      return NextResponse.json({ error: "Mailgun credentials not configured" }, { status: 500 });
    }

    const params = new URLSearchParams();
    params.append("from", `Portfolio Contact <postmaster@${MAILGUN_DOMAIN}>`);
    params.append("to", to);
    params.append("subject", subject);
    if (text) params.append("text", text);
    params.append("html", html || generateStyledHtml(text || "", subject));

    const resp = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const payload = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      console.error("Mailgun Error:", payload);
      return NextResponse.json({ error: payload || "Mailgun error" }, { status: resp.status });
    }

    return NextResponse.json({ ok: true, id: payload.id || null });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
