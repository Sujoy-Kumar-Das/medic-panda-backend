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
};
