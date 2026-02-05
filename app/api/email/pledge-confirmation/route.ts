import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullName } = body

    if (!email || !fullName) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      )
    }

    // Send email using Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Erase Horseracing <noreply@erasehorseracing.com>",
        to: email,
        subject: "Your Pledge Confirmation - Erase Horseracing India",
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #d41f1f; font-size: 24px; margin-bottom: 20px;">Thank You for Taking the Pledge</h1>
                
                <p style="margin-bottom: 15px;">
                  Dear <strong>${fullName}</strong>,
                </p>
                
                <p style="margin-bottom: 15px;">
                  We are thrilled to confirm that you have successfully signed the pledge to end horse racing in India. Your commitment to animal welfare is a crucial step in our collective movement for change.
                </p>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #d41f1f; margin-bottom: 20px;">
                  <h3 style="color: #d41f1f; margin-top: 0;">What's Next?</h3>
                  <ul style="margin: 0; padding-left: 20px;">
                    <li>Stay updated on our campaigns and progress</li>
                    <li>Share your pledge with friends and family</li>
                    <li>Advocate for stronger animal protection laws</li>
                    <li>Support organizations fighting for horse welfare</li>
                  </ul>
                </div>
                
                <p style="margin-bottom: 15px;">
                  Your voice is powerful. Together, we can make a difference and end the suffering of horses in racing.
                </p>
                
                <p style="margin-bottom: 30px;">
                  Warmly,<br>
                  <strong>Erase Horseracing India Team</strong>
                </p>
                
                <div style="border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666;">
                  <p>
                    You're receiving this email because you signed the pledge on our website. If you have any questions, please reply to this email.
                  </p>
                  <p>
                    You can unsubscribe from our mailing list at any time by clicking <a href="[UNSUBSCRIBE_LINK]" style="color: #d41f1f;">here</a>.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Resend API error:", errorData)
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
