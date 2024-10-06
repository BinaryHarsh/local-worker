const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = { from: config.email.from, to, subject, text, html };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Password Reset Request';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.host}/app/reset-password/${String(token).replace(/\./g, '*')}`;
  const text = `Dear user,

  To reset your password, click on this link: ${resetPasswordUrl}

  Ignore the email if you did not request any password reset.`;

  try {
    await sendEmail(to, subject, text);
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Send email activation mail
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendActivationEmail = async (to, token, username, accType) => {
  const subject = 'Account Verification';
  const activationLink = `${config.host}/user/verify-account/${token}/${to}`;
  const text = `
  Dear ${username},

  Please verify your email address to activate your ${accType} account.

  Verification link: ${activationLink}
  
  Thanks & Regards,
  StepAhead Health Support Team
  For any queries, mail us at support@stepaheadhealth.com`;

  try {
    await sendEmail(to, subject, text);
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Send welcome email
 * @param {string} to
 * @returns {Promise}
 */
const sendWelcomeEmail = async (to) => {
  const subject = 'Welcome to ATMS';

  const text = ``;
  const html = `Welcome aboard!<br />
  <br />
  Your ATMS account has been activated.
  <br /><br />
  <a href="https://transharyana.com">Click here</a> to access your ATMS account and explore all the important aspects of the features provided. 
  <br /><br />
  Yours sincerely<br />
  ATMS`;

  try {
    await sendEmail(to, subject, text, html);
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Send accident alert
 * @param {string} to
 * @returns {Promise}
 */
const sendAccidentAlert = async (details) => {
  const subject = 'ATMS Accident Alert';

  const text = ``;
  const html = `
  <br />
  <br />
  <h3>ATMS has detected an accident.</h3>
  <br /><br />
  Details: ${details}
  <br /><br />
  <small>Note: Please do not reply to this email - we are unable to review or respond to messages at this address.</small>
  <br /><br />
  Yours sincerely<br />
  Advance Traffic Management System`;

  try {
    await sendEmail('alerts@sugoiindo.in', subject, text, html);
  } catch (e) {
    logger.error(e);
  }
};

const sendResolvedAlert = async (details) => {
  const subject = 'ATMS Accident Resolved';

  const text = ``;
  const html = `
  <br />
  <br />
  <h3>ATMS has resolved accident</h3>
  <br /><br />
  Details: ${details}
  <br /><br />
  <small>Note: Please do not reply to this email - we are unable to review or respond to messages at this address.</small>
  <br /><br />
  Yours sincerely<br />
  Advance Traffic Management System`;

  try {
    await sendEmail('alerts@sugoiindo.in', subject, text, html);
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendActivationEmail,
  sendWelcomeEmail,
  sendAccidentAlert,
  sendResolvedAlert,
};
