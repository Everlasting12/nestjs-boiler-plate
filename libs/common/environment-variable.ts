export interface EnvironmentVariables {
  PORT: number;
  ENV: string;
  APP_NAME: string;
  SALT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  LOG_PATH: string;
  DATABASE_URL: string;
}
