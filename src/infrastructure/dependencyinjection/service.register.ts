import { container } from "tsyringe";
import { IEmailService } from "../../domain/service-interfaces/email-service.interface";
import { EmailService } from "../service/email.service";
import { IOtpService } from "../../domain/service-interfaces/otp-service.interface";
import { OtpService } from "../service/otp.service";
import { ITokenService } from "../../domain/service-interfaces/token-service-interfaces";
import { TokenService } from "../service/token.service";
import { IGoogleAuthService } from "../../domain/service-interfaces/google-auth-service.interface";
import { GoogleAuthService } from "../service/google-auth.service";
import { ILogger } from "../../domain/service-interfaces/logger.interface";
import { WinstonLoggerAdapter } from "../service/winston-logger.adapter";
import { IPaymentService } from "../../domain/service-interfaces/payment-service.interface";
import { StripePaymentService } from "../service/payment.service";
import { stripe } from "../config/stripe/stripe.config";
import { ISalesReportExportService } from "../../domain/service-interfaces/sales-report-export-service.interface";
import { PdfSalesReportExportService } from "../service/sales-report/pdf-sales-report-export.service";
import { ExcelSalesReportExportService } from "../service/sales-report/excel-sales-report-export.service";
import { SalesReportExportService } from "../service/sales-report/sales-report-export.service";
import {
  ChatConversationProvisioner,
  type IChatConversationProvisioner,
} from "../../application/services/chat/chat-conversation-provisioner";
import { ChatService, type IChatService } from "../../application/services/chat/chat.service";
import { RefundPolicyService } from "../../application/services/refund-policy.service";

export class ServiceRegistery {
  static registerService(): void {
    container.register("Stripe", { useValue: stripe });
    container.register<IPaymentService>("IPaymentService", {
      useClass: StripePaymentService,
    });

    container.register<IEmailService>("IEmailService", {
      useClass: EmailService,
    });

    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });

    container.register<ITokenService>("ITokenService", {
      useClass: TokenService,
    });

    container.register<IGoogleAuthService>("IGoogleAuthService", {
      useClass: GoogleAuthService,
    });

    container.register<ILogger>("ILogger",{
      useClass:WinstonLoggerAdapter,
    });

    container.register<ISalesReportExportService>("ISalesReportPdfExportService", {
      useClass: PdfSalesReportExportService,
    });
    container.register<ISalesReportExportService>("ISalesReportExcelExportService", {
      useClass: ExcelSalesReportExportService,
    });
    container.register<ISalesReportExportService>("ISalesReportExportService", {
      useClass: SalesReportExportService,
    });

    container.register<IChatConversationProvisioner>(
      "IChatConversationProvisioner",
      {
        useClass: ChatConversationProvisioner,
      }
    );

    container.register<IChatService>("IChatService", {
      useClass: ChatService,
    });

    // Refund policy service used in refund use case
    container.register(RefundPolicyService, {
      useClass: RefundPolicyService,
    });
  }
}
