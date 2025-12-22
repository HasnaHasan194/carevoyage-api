import { container } from "tsyringe";
import { IEmailService } from "../../domain/service-interfaces/email-service.interface";
import { EmailService } from "../service/email.service";
import { IOtpService } from "../../domain/service-interfaces/otp-service.interface";
import { OtpService } from "../service/otp.service";
import { ITokenService } from "../../domain/service-interfaces/token-service-interfaces";
import { TokenService } from "../service/token.service";

export class ServiceRegistery {
  static registerService(): void {
    container.register<IEmailService>("IEmailService", {
      useClass: EmailService,
    });

    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });

    container.register<ITokenService>("ITokenService", {
      useClass: TokenService,
    });
  }
}
