import { Request, Response, NextFunction } from "express";

export interface IAuthController {
  // AUTH
  register(req: Request, res: Response): Promise<void>;

  //Login
  login(req: Request, res: Response): Promise<void>;

  //Agency register
  registerAgency(req: Request, res: Response): Promise<void>;

  //Agencylogin
  loginAgency(req: Request, res: Response): Promise<void>;

  //adminlogin
  AdminLogin(req: Request, res: Response): Promise<void>;

  //sendotp
  sendOtp(req: Request, res: Response): Promise<void>;

  //resendotp
  resendOtp(req: Request, res: Response): Promise<void>;

  //verifyOtp
  verifyOtp(req: Request, res: Response): Promise<void>;

  //verifyotp and creating user
  verifyOtpAndCreateUser(req: Request, res: Response): Promise<void>;

  //verify otp and create agency
  verifyOtpAndCreateAgency(req: Request, res: Response): Promise<void>;

  //Checking details and sendotp
  signupSendOtp(req: Request, res: Response): Promise<void>;

  //Logout
  logout(req: Request, res: Response): Promise<void>;

  //Refresh Token
  refreshToken(req: Request, res: Response): Promise<void>;

  //Verify Caretaker Invite
  verifyCaretakerInvite(req: Request, res: Response): Promise<void>;

  //Caretaker Signup
  caretakerSignup(req: Request, res: Response): Promise<void>;

  //Caretaker Login
  caretakerLogin(req: Request, res: Response): Promise<void>;

  //Forgot Password
  forgotPassword(req: Request, res: Response): Promise<void>;

  //Reset Password
  resetPassword(req: Request, res: Response): Promise<void>;

  //Verify Reset Token
  verifyResetToken(req: Request, res: Response): Promise<void>;

  //Google Authentication
  googleAuth(req: Request, res: Response): Promise<void>;
}
