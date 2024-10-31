export interface EnvironmentVariables {
  ENV: string;
  PORT: number;
  APP_NAME: string;
  SALT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  LOG_PATH: string;
  DATABASE_URL: string;
  EMAIL_SERVICE_NAME: string;
  EMAIL_SERVICE_HOST: string;
  EMAIL_SERVICE_PORT: number;
  EMAIL_API_KEY: string;
  APP_EMAIL_ID: string;
  EMAIL_SECRETE_KEY: string;
}
