const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function sendVerificationCode(phoneNumber) {
    return client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verifications
      .create({to: phoneNumber, channel: 'sms'});
}

async function verifyCode(phoneNumber,code) {
    return client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
    .verificationChecks
    .create({to: phoneNumber, code: code});
}

//      .then(verification_check => console.log(verification_check.status));

module.exports = {
    sendVerificationCode,
    verifyCode
};