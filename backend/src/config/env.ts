import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
  contactReceiverEmail: string;
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

const getEnvVar = (key: string, required = true): string => {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`Config validation error: Missing required environment variable ${key}`);
  }
  return value || "";
};

export const config: Config = {
  port: parseInt(getEnvVar("PORT", false) || "5000", 10),
  nodeEnv: getEnvVar("NODE_ENV", false) || "development",
  frontendUrl: getEnvVar("FRONTEND_URL"),
  databaseUrl: getEnvVar("DATABASE_URL"),
  jwtSecret: getEnvVar("JWT_SECRET"),
  jwtExpiresIn: getEnvVar("JWT_EXPIRES_IN", false) || "7d",
  jwtRefreshSecret: getEnvVar("JWT_REFRESH_SECRET"),
  jwtRefreshExpiresIn: getEnvVar("JWT_REFRESH_EXPIRES_IN", false) || "30d",
  smtp: {
    host: getEnvVar("SMTP_HOST"),
    port: parseInt(getEnvVar("SMTP_PORT", false) || "587", 10),
    user: getEnvVar("SMTP_USER"),
    pass: getEnvVar("SMTP_PASS"),
    from: getEnvVar("EMAIL_FROM"),
  },
  contactReceiverEmail: getEnvVar("CONTACT_RECEIVER_EMAIL"),
  cloudinary: {
    cloudName: getEnvVar("CLOUDINARY_CLOUD_NAME", false),
    apiKey: getEnvVar("CLOUDINARY_API_KEY", false),
    apiSecret: getEnvVar("CLOUDINARY_API_SECRET", false),
  },
};
