import { BrevoClient } from "@getbrevo/brevo";
import { injectable } from "tsyringe";

import { IEmailService } from "../../domain/service-interfaces/email-service.interface";
import { config } from "../../shared/config";
import { EVENT_EMMITER_TYPE } from "../../shared/constants/constants";
import { eventBus } from "../../shared/eventBus";

@injectable()
export class EmailService implements IEmailService {
  private readonly client: BrevoClient;
  private readonly boundSendMail: (
    to: string,
    subject: string,
    html: string,
  ) => Promise<void>;

  constructor() {
    this.client = new BrevoClient({
      apiKey: config.email.BREVO_API_KEY,
    });

    this.boundSendMail = this.sendMail.bind(this);
    this.registerEventListener();
  }

  private registerEventListener(): void {
    eventBus.removeAllListeners(EVENT_EMMITER_TYPE.SENDMAIL);
    eventBus.on(EVENT_EMMITER_TYPE.SENDMAIL, this.boundSendMail);
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    await this.client.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Care Voyage",
        email: config.email.EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log("Email sent successfully via Brevo");
  }
}
