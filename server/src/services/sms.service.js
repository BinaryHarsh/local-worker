/* eslint-disable */
const axios = require('axios').default;
const querystring = require('querystring')
const config = require('../config/config');
const logger = require('../config/logger');

/**
 *
 * @param {*} incidentId - Max 10 Chars
 * @param {*} dateTime - Max 15 Chars
 * @param {*} chainage - Max 5 Chars
 * @param {*} type - Max 23 Chars
 * @param {*} rpvId - Max 2 Chars
 * @param {*} dateTime - Max 8 Chars
 * @returns
 */
const SendAccidentSMS = async ({ incidentId, dateTime, chainage, type, rpvId, mobileNumber }) => {
  try {
    const res = await axios.post(config.sms.apiUrl,
      querystring.stringify({
        apiKey: encodeURIComponent(config.sms.apiKey),
        numbers: encodeURIComponent(mobileNumber + ', 8806099932'),
        sender: encodeURIComponent(config.sms.sender),
        message: encodeURIComponent(`An Incident ${incidentId} has been occured at ${dateTime} location CH ${chainage}Incident type: ${type}. This incident was reported to ${rpvId}at ${dateTime}.`)
      }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    return true;
  } catch (e) {
    logger.error(e)
  }
};

const sendResolvedSMS = async ({ incidentId, dateTime, chainage, type, rpvId, mobileNumber }) => {
  const res = await axios.post(config.sms.apiUrl,
    querystring.stringify({
      apiKey: encodeURIComponent(config.sms.apiKey),
      numbers: encodeURIComponent(mobileNumber + ', 8806099932'),
      sender: encodeURIComponent(config.sms.sender),
      message: encodeURIComponent(`An Incident ${incidentId} has been Resolved at ${dateTime} location CH ${chainage}Incident type: ${type}. This incident was reported to ${rpvId}at ${dateTime}.`)
    }), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  return true;
};

// await SendAccidentSMS({
//     incidentId: '123456',
//     dateTime: new Date().toLocaleTimeString(),
//     chainage: '10',
//     type: 'Accident',
//     rpvId: '01'
// })
module.exports = {
  SendAccidentSMS,
  sendResolvedSMS
};
