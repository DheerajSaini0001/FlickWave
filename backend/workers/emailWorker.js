const { parentPort, workerData } = require('worker_threads');
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const { smtpConfig } = options;

    console.log('Worker: SMTP Config:', {
        host: smtpConfig.host,
        port: smtpConfig.port,
        user: smtpConfig.user,
        pass: smtpConfig.pass ? '****' : 'MISSING'
    });

    const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.port == 465,
        auth: {
            user: smtpConfig.user,
            pass: smtpConfig.pass,
        },
        family: 4,
    });

    const message = {
        from: `${smtpConfig.fromName} <${smtpConfig.user}>`,
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
