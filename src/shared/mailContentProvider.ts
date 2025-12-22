import { config } from "./config";
import { MAIL_CONTENT_PURPOSE } from "./constants/constants";

export function mailContentProvider(purpose: string, data?: any): string {
  const {
    LOGIN,
    OTP,
    GUIDE_LOGIN,
    REQUEST_REJECTED,
    RESET_PASSWORD,
    EMAIL_CHANGE,
  } = MAIL_CONTENT_PURPOSE;

  switch (purpose) {
    case LOGIN:
      return `
      <div style="max-width: 550px; margin: auto; font-family: 'Segoe UI', Tahoma, sans-serif; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);">
        <div style="background: linear-gradient(to right, #4f46e5, #06b6d4); padding: 24px; color: white; text-align: center;">
          <h2 style="margin: 0; font-size: 24px;">🔐 OTP Verification</h2>
          <p style="margin: 8px 0 0; font-size: 14px;">Verify your email to activate your account</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Hi there 👋,</p>
          <p style="font-size: 15px; color: #555;">Thank you for signing up with <strong>Travel Mate</strong>!</p>
          <p style="font-size: 15px; color: #555;">Your one-time password (OTP) is:</p>
          
          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; font-size: 28px; background-color: #4f46e5; color: #fff; padding: 14px 30px; border-radius: 10px; font-weight: bold; letter-spacing: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);">
              ${data}
            </span>
          </div>

          <p style="font-size: 14px; color: #888;">⏰ This OTP is valid for <strong>1 minute</strong>. Do not share it with anyone.</p>
          <p style="font-size: 13px; color: #aaa; margin-top: 40px; text-align: center;">
            Cheers,<br/>The Travel Mate Team 🌍
          </p>
        </div>
      </div>
      `;
    default:
      return "";
  }
}
