const axios = require('axios');

const sendEmail = async (options) => {
    const data = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
            to_email: options.email,
            subject: options.subject,
            message: options.message,
            html_message: options.html,
            otp: options.otp // Ensure this is passed from the caller if needed
        }
    };

    try {
        await axios.post('https://api.emailjs.com/api/v1.0/email/send', data);
        console.log('Email sent successfully via EmailJS');
    } catch (error) {
        console.error('Error sending email via EmailJS:', error.response?.data || error.message);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;
