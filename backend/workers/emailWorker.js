const { parentPort, workerData } = require('worker_threads');
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    console.log('Worker: SMTP Config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS ? '****' : 'MISSING'
    });

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        family: 4,
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    const info = await transporter.sendMail(message);
    return info;
};

// Execute the email sending task
(async () => {
    try {
        const info = await sendEmail(workerData);
        parentPort.postMessage({ status: 'success', messageId: info.messageId });
    } catch (error) {
        parentPort.postMessage({ status: 'error', error: error.message });
    }
})();
