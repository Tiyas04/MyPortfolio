import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import ResponseModel from "@/models/response";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required"
                },
                {
                    status: 400
                }
            );
        }

        // 1. Save to Database
        const newResponse = new ResponseModel({
            name,
            email,
            message
        });
        await newResponse.save();

        // 2. Send Email using Nodemailer
        const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
        const smtpPort = parseInt(process.env.SMTP_PORT || "465");
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const emailTo = process.env.EMAIL_TO || "mandaltiyas2410@gmail.com";

        let emailSent = false;
        let emailError = "";

        if (smtpUser && smtpPass) {
            try {
                const transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: smtpPort,
                    secure: smtpPort === 465, // true for 465, false for other ports
                    auth: {
                        user: smtpUser,
                        pass: smtpPass
                    }
                });

                // Cybersecurity themed premium HTML template
                const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body {
                      background-color: #030712;
                      color: #f3f4f6;
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      margin: 0;
                      padding: 0;
                    }
                    .container {
                      max-width: 600px;
                      margin: 40px auto;
                      background-color: #0b0f19;
                      border: 1px solid #14b8a6;
                      border-radius: 16px;
                      overflow: hidden;
                      box-shadow: 0 0 20px rgba(20, 184, 166, 0.15);
                    }
                    .header {
                      background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
                      padding: 35px 20px;
                      text-align: center;
                      border-bottom: 2px solid #14b8a6;
                    }
                    .header h1 {
                      margin: 0;
                      font-family: 'Courier New', Courier, monospace;
                      font-size: 24px;
                      font-weight: 800;
                      color: #ffffff;
                      text-shadow: 0 0 10px rgba(20, 184, 166, 0.8);
                      letter-spacing: 3px;
                    }
                    .content {
                      padding: 30px;
                      line-height: 1.6;
                    }
                    .field {
                      margin-bottom: 24px;
                    }
                    .label {
                      font-size: 11px;
                      text-transform: uppercase;
                      letter-spacing: 2px;
                      color: #14b8a6;
                      font-weight: bold;
                      margin-bottom: 8px;
                      font-family: 'Courier New', Courier, monospace;
                    }
                    .value {
                      background-color: #030712;
                      border: 1px solid #1f2937;
                      border-radius: 10px;
                      padding: 14px 18px;
                      color: #e5e7eb;
                      font-size: 15px;
                    }
                    .message-box {
                      white-space: pre-wrap;
                      border-left: 4px solid #f0abfc;
                      background-color: #0c1020;
                      font-size: 14px;
                      color: #f3f4f6;
                    }
                    .footer {
                      background-color: #030712;
                      padding: 20px;
                      text-align: center;
                      font-size: 11px;
                      color: #4b5563;
                      border-top: 1px solid #1f2937;
                      font-family: 'Courier New', Courier, monospace;
                    }
                    .footer a {
                      color: #14b8a6;
                      text-decoration: none;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>&lt;SYSTEM_NOTIFICATION: NEW_MESSAGE /&gt;</h1>
                    </div>
                    <div class="content">
                      <div class="field">
                        <div class="label">// SENDER_NAME</div>
                        <div class="value">${name}</div>
                      </div>
                      <div class="field">
                        <div class="label">// SENDER_EMAIL</div>
                        <div class="value">
                          <a href="mailto:${email}" style="color: #2dd4bf; text-decoration: none; font-weight: 600;">${email}</a>
                        </div>
                      </div>
                      <div class="field">
                        <div class="label">// TRANSMITTED_DATA</div>
                        <div class="value message-box">${message}</div>
                      </div>
                    </div>
                    <div class="footer">
                      Generated securely by <a href="https://github.com/Tiyas04" target="_blank">Tiyas Portfolio Terminal</a>
                    </div>
                  </div>
                </body>
                </html>
                `;

                await transporter.sendMail({
                    from: `"Portfolio Terminal" <${smtpUser}>`,
                    to: emailTo,
                    subject: `🚨 Portfolio: New Message from ${name}`,
                    text: `New Portfolio Message\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
                    html: htmlContent
                });

                emailSent = true;
            } catch (err: any) {
                console.error("Nodemailer failed:", err);
                emailError = err.message || "Failed to deliver email notification.";
            }
        } else {
            console.warn("SMTP_USER or SMTP_PASS is missing in environment variables. Skipping email notification.");
            emailError = "SMTP credentials missing. Please set SMTP_USER and SMTP_PASS in your .env file.";
        }

        return NextResponse.json(
            {
                success: true,
                message: emailSent 
                    ? "Response saved and email sent successfully!" 
                    : `Response saved, but email notification skipped/failed: ${emailError}`,
                data: newResponse
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.log("Error occurred" + error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to send response. Internal error occurred"
            },
            {
                status: 500
            }
        );
    }
}

export async function GET(){
    await dbConnect()

    try {
        const responses = await ResponseModel.find()
        return NextResponse.json(
            {
                success:true,
                message:"Responses fetched successfully",
                data:responses
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.log("Error occurred" + error)
        return NextResponse.json(
            {
                success:false,
                message:"Failed to get responses.Internal error occurred"
            },
            {
                status:500
            }
        )
    }
}