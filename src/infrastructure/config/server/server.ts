import express, { Application } from "express";
import cors from "cors";
import { config } from "../../../shared/config";
import cookieParser from "cookie-parser";
import {
  authRoutes,
  adminRoutes,
  agencyRoutes,
  errorMiddleware,
  userRoutes,
  caretakerRoutes,
  packageRoutes,
  bookingRoutes,
  walletRoutes,
  paymentController,
} from "../../dependencyinjection/resolve";
import { loggerMiddleware } from "../../dependencyinjection/resolve";
import { API_MOUNTS } from "../../../presentation/route/routes.constants";

export class App {
  private _app: Application;
  constructor() {
    this._app = express();
    this.configureMiddleware();

    this.configureRoutes();

    this.configureErrorMiddleware();
  }

  private configureMiddleware() {
   
    this._app.use((req, res, next) => { if (req.originalUrl.includes('send-otp')) { try { require('fs').appendFileSync(require('path').join(process.cwd(),'debug.log'), JSON.stringify({location:'server.ts:globalMiddleware',message:'Request reached Express',data:{method:req.method,url:req.originalUrl,contentType:req.headers['content-type'],origin:req.headers['origin']},timestamp:Date.now(),hypothesisId:'H6'})+'\n'); } catch(e){} } next(); });
   
    this._app.use(
      cors({
        origin: config.client.URI,
        credentials: true,
      }),
    );
    
    this._app.use((req, res, next) => { if (req.originalUrl.includes('send-otp')) { try { require('fs').appendFileSync(require('path').join(process.cwd(),'debug.log'), JSON.stringify({location:'server.ts:afterCORS',message:'Request passed CORS',data:{method:req.method,url:req.originalUrl},timestamp:Date.now(),hypothesisId:'H6'})+'\n'); } catch(e){} } next(); });
    
    this._app.use(
      API_MOUNTS.PAYMENT_WEBHOOK,
      express.raw({ type: "application/json" }),
      (req, res, next) => {
        paymentController.stripeWebhook(req, res).catch(next);
      }
    );
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(cookieParser());
    this._app.use(loggerMiddleware.handle.bind(loggerMiddleware));
  }

  private configureRoutes() {
    this._app.use(API_MOUNTS.AUTH, authRoutes.router);

    this._app.use(API_MOUNTS.ADMIN, adminRoutes.router);

    this._app.use(API_MOUNTS.AGENCY, agencyRoutes.router);

    this._app.use(API_MOUNTS.USER, userRoutes.router);
    this._app.use(API_MOUNTS.CARETAKER, caretakerRoutes.router);
    this._app.use(API_MOUNTS.PACKAGES, packageRoutes.router);
    this._app.use(API_MOUNTS.BOOKING, bookingRoutes.router);
    this._app.use(API_MOUNTS.WALLETS, walletRoutes.router);
  }

  private configureErrorMiddleware() {
    this._app.use(errorMiddleware.handleError.bind(errorMiddleware));
  }

  public getApp(): Application {
    return this._app;
  }
}
