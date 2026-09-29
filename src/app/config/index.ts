import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  // ---------- App ----------
  port: process.env.PORT,
  node_env: process.env.node_env,

  // ---------- Database ----------
  db_url: process.env.db_url,

  // ---------- Redis ----------
  redisUrl: process.env.REDIS_URL,

  // ---------- Auth / JWT ----------
  salt_round: process.env.saltRounds,
  access_key: process.env.jwt_access_key,
  refresh_key: process.env.jwt_refresh_key,
  access_token: process.env.jwt_access_token,
  refresh_token: process.env.jwt_refresh_token,
  accessTokenValidation: process.env.jwt_access_token_validation,
  refreshTokenValidation: process.env.jwt_refresh_token_validation,

  // ---------- Super admin (seeded on first run) ----------
  supperAdminEmail: process.env.supper_admin_email,
  supperAdminPassword: process.env.supper_admin_password,

  // ---------- OTP / email verification ----------
  otp_token: process.env.otp_url,
  otp_verification_url: process.env.otp_verification_url,
  authUserEmail: process.env.auth_user_email,
  authUserPassword: process.env.auth_user_password,
  emailVerifyFrontendLink: process.env.verify_email_frontend_link,
  emailVerificationRedirectLink: process.env.email_verification_redirect_link,
  forgotPasswordFrontendLink: process.env.forgot_password_frontend_link,

  // ---------- SSLCommerz payment gateway ----------
  ssl_url: process.env.SSL_URL,
  ssl_store: process.env.SSL_StoreID,
  ssl_password: process.env.SSL_PASSWORD,
  ssl_init_url: process.env.init_ssl_payment,
  ssl_success_url: process.env.ssl_success_url,
  ssl_failed_url: process.env.ssl_failed_url,
  ssl_cancel_url: process.env.ssl_cancel_url,
  success_frontend_link: process.env.success_frontend_link,
  failed_frontend_link: process.env.failed_frontend_link,

  // ---------- Frontend base URLs (per environment) ----------
  baseFrontendLinkProd: process.env.base_frontend_link_prod,
  baseFrontendLinkDev: process.env.base_frontend_link_dev,

  // ---------- Reset password informations ----------
  resetPasswordSecret: process.env.reset_password_secret
};
