import { registerAs } from '@nestjs/config';

export default registerAs('notification', () => ({
    email: {
        provider: process.env.EMAIL_PROVIDER || 'smtp',
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10) || 587,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM,
    },
    sms: {
        provider: process.env.SMS_PROVIDER || 'twilio',
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        fromNumber: process.env.TWILIO_FROM_NUMBER,
    },
}));
