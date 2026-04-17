import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET!,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET!,
};
