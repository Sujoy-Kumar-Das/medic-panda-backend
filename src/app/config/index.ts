import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  db_url: process.env.db_url,
  salt_round: process.env.saltRounds,
  node_env: process.env.node_env,
  access_token: process.env.jwt_access_token,
  refresh_token: process.env.jwt_refresh_token,
  otp_token: process.env.otp_url,
  otp_verification_url: process.env.otp_verification_url,
  ssl_url: process.env.SSL_URL,
  ssl_store: process.env.SSL_StoreID,
  ssl_password: process.env.SSL_PASSWORD,
  ssl_success_url: process.env.ssl_success_url,
  ssl_failed_url: process.env.ssl_failed_url,
  ssl_cancel_url: process.env.ssl_cancel_url,
  ssl_init_url: process.env.init_ssl_payment,
  success_frontend_link: process.env.success_frontend_link,
  failed_frontend_link: process.env.failed_frontend_link,
  emailVerifyFrontendLink: process.env.verify_email_frontend_link,
  forgotPasswordFrontendLink: process.env.forgot_password_frontend_link,
  authUserEmail: process.env.auth_user_email,
  authUserPassword: process.env.auth_user_password,
  emailVerificationRedirectLink: process.env.email_verification_redirect_link,
  baseFrontendLink: process.env.base_frontend_link,
  accessTokenValidation: process.env.jwt_access_token_validation,
  refreshTokenValidation: process.env.jwt_refresh_token_validation,
  supperAdminPassword: process.env.supper_admin_password,
  supperAdminEmail: process.env.supper_admin_email,
};
