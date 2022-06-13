import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  port: process.env.PORT,
  apiPrefix: process.env.API_PREFIX || 'api',
}));
