const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    HOST: Joi.string().required(),
    PORT: Joi.number().default(3000),
    MYSQL_HOST: Joi.string().required().description('MySQL Host'),
    MYSQL_USER: Joi.string().required().description('MySQL USER'),
    MYSQL_PASSWORD: Joi.string().required().description('MySQL Pass'),
    MYSQL_DATABASE: Joi.string().required().description('MySQL DB'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    SMS_API_URL: Joi.string().description('sms api'),
    SMS_API_KEY: Joi.string().description('sms api'),
    SMS_API_SENDER: Joi.string().description('sms api'),
    REDIS_URL: Joi.string().description('redis'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  host: envVars.HOST,
  port: envVars.PORT,
  mysql: {
    host: envVars.MYSQL_HOST,
    user: envVars.MYSQL_USER,
    password: envVars.MYSQL_PASSWORD,
    database: envVars.MYSQL_DATABASE,
  },
  redis: {
    url: envVars.REDIS_URL
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
    accountActivationLinkExpirationMinutes: 518400,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: envVars.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
      },
    },
    from: envVars.EMAIL_FROM,
  },
  sms: {
    apiUrl: envVars.SMS_API_URL,
    apiKey: envVars.SMS_API_KEY,
    sender: envVars.SMS_API_SENDER,
  },
  s3: {
    id: envVars.S3_ID,
    secret: envVars.S3_SECRET,
    bucketName: envVars.S3_BUCKET_NAME,
  }
};
