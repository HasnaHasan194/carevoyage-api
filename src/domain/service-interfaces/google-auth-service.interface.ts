export interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
  sub: string; // Google user ID
}

export interface IGoogleAuthService {
  verifyToken(idToken: string): Promise<GoogleUserInfo>;
}

