// import { OAuth2Client } from "google-auth-library";
// import { injectable } from "tsyringe";
// import { IGoogleAuthService,GoogleUserInfo } from "../../domain/service-interfaces/google-auth-service.interface";
// import { config } from "../../shared/config";
// import { CustomError } from "../../domain/errors/customError";
// import { HTTP_STATUS } from "../../shared/constants/constants";

// @injectable()
// export class GoogleAuthService implements IGoogleAuthService {
//   private client: OAuth2Client;

//   constructor() {
//     if (!config.google.CLIENT_ID) {
//       throw new CustomError(
//         HTTP_STATUS.INTERNAL_SERVER_ERROR,
//         "Google OAuth Client ID is not configured. Please set GOOGLE_CLIENT_ID environment variable."
//       );
//     }

//     this.client = new OAuth2Client(config.google.CLIENT_ID);
//   }

//   async verifyToken(idToken: string): Promise<GoogleUserInfo> {
//     try {

//       this.client.setCredentials({
//         access_token : idToken
//       })

//       const oauth2 = this.client.oauth2("v2");
//     const { data } = await oauth2.userinfo.v2.me.get();

//       console.log(idToken,"-->token");
//       console.log(config.google.CLIENT_ID,"-->client id");

//       const ticket = await this.client.verifyIdToken({
//         idToken,
//         audience: config.google.CLIENT_ID,
//       });
      
//       console.log(ticket,"-->ticket");
//       const payload = ticket.getPayload();

//       console.log(payload,"-->payload")

//       if (!payload) {
//         throw new CustomError(
//           HTTP_STATUS.BAD_REQUEST,
//           "Invalid Google token payload"
//         );
//       }

//       if (!payload.email) {
//         throw new CustomError(
//           HTTP_STATUS.BAD_REQUEST,
//           "Google account email not found"
//         );
//       }

//       return {
//         email: payload.email,
//         name: payload.name || "",
//         picture: payload.picture,
//         sub: payload.sub,
//       };
//     } catch (error) {
//       if (error instanceof CustomError) {
//         throw error;
//       }
//       throw new CustomError(
//         HTTP_STATUS.BAD_REQUEST,
//         "Invalid or expired Google token"
//       );
//     }
//   }
// }

import { injectable } from "tsyringe";
import {
  IGoogleAuthService,
  GoogleUserInfo,
} from "../../domain/service-interfaces/google-auth-service.interface";
import { CustomError } from "../../domain/errors/customError";
import { HTTP_STATUS } from "../../shared/constants/constants";

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  async verifyToken(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new CustomError(
          HTTP_STATUS.BAD_REQUEST,
          "Invalid Google access token"
        );
      }

      const data = await response.json();

      if (!data.email) {
        throw new CustomError(
          HTTP_STATUS.BAD_REQUEST,
          "Google account email not found"
        );
      }

      return {
        email: data.email,
        name: data.name || "",
        picture: data.picture,
        sub: data.sub,
      };
    } catch {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid or expired Google access token"
      );
    }
  }
}
