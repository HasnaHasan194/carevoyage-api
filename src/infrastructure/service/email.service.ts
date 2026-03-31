import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

import { IEmailService } from "../../domain/service-interfaces/email-service.interface";
import { config } from "../../shared/config";
import { EVENT_EMMITER_TYPE } from "../../shared/constants/constants";
import { eventBus } from "../../shared/eventBus";

@injectable()
export class EmailService implements IEmailService {
  private transporter: Transporter;
  private readonly boundSendMail: (
    to: string,
    subject: string,
    html: string,
  ) => Promise<void>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.EMAIL,
        pass: config.email.PASSWORD,
      },
    });

    this.boundSendMail = this.sendMail.bind(this);
    this.registerEventListener();
  }

  private registerEventListener(): void {
    eventBus.removeAllListeners(EVENT_EMMITER_TYPE.SENDMAIL);
    eventBus.on(EVENT_EMMITER_TYPE.SENDMAIL, this.boundSendMail);
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: `"Care Voyage" <${config.email.EMAIL}>`,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  }
}
