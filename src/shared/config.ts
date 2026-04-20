import dotenv from "dotenv"
dotenv.config()

export const DEFAULT_SERVER_PORT = 3000

function resolveServerPort(): number {
  const raw = process.env.PORT
  if (raw === undefined || raw === "") return DEFAULT_SERVER_PORT
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_SERVER_PORT
}

export const config = {
  server: {
    PORT: resolveServerPort(),
  },

  client : {
    URI : process.env.CLIENT_URI
  },

  database: {
    URI: process.env.DATABASEURI || "mongodb://127.0.0.1:27017/CareVoyage",
  },

  jwt: {
    ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY || "",
    ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN || "15m",

    REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY || "",
    REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || "7d",

    RESET_SECRET_KEY: process.env.RESET_SECRET_KEY || "",
    RESET_EXPIRES_IN: process.env.RESET_EXPIRES_IN || "15m",

    INVITE_SECRET_KEY: process.env.INVITE_SECRET_KEY || "",
    INVITE_EXPIRES_IN: process.env.INVITE_EXPIRES_IN || "48h",
  },
  email:{
    EMAIL:process.env.EMAIL as string,
    PASSWORD:process.env.EMAIL_PASSWORD as string,
  },
  google: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  },

  stripe: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  },

  wallet: {
    /** Owner ID for the platform/admin wallet (e.g. "platform" or an admin user id). Used for booking commission (10%). */
    ADMIN_WALLET_OWNER_ID: process.env.ADMIN_WALLET_OWNER_ID || "platform",
    BOOKING_AGENCY_SHARE: 0.9,
    BOOKING_ADMIN_SHARE: 0.1,
  },
};
