import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;

    if (connectionString) {
      // Azure Communication Services SMTP
      transporter = nodemailer.createTransport({
        host: 'smtp.azurecomm.net',
        port: 587,
        secure: false,
        auth: {
          user: connectionString,
          pass: connectionString,
        },
      });
    } else {
      // Fallback for development: console output
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }
  return transporter;
};

export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> => {
  const transport = getTransporter();
  const from = process.env.EMAIL_FROM || 'noreply@sparkcoding.app';

  const result = await transport.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('Email sent (dev):', result);
  }
};

export const sendWeeklyReport = async (
  parentEmail: string,
  childName: string,
  reportHtml: string
): Promise<void> => {
  await sendEmail({
    to: parentEmail,
    subject: `${childName}'s Weekly SPARK Report`,
    html: `
      <div style="font-family: 'Nunito', sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #1E293B; padding: 32px; border-radius: 16px; border: 1px solid #E2E8F0;">
        <h1 style="color: #0891B2; font-size: 24px;">SPARK Weekly Report</h1>
        <h2 style="color: #7C3AED; font-size: 18px;">${childName}'s Progress</h2>
        <div style="line-height: 1.8; font-size: 16px; color: #475569;">
          ${reportHtml}
        </div>
        <hr style="border: 1px solid #E2E8F0; margin: 24px 0;" />
        <p style="color: #94A3B8; font-size: 14px;">
          View the full dashboard at <a href="${process.env.CLIENT_URL}/parent" style="color: #0891B2;">SPARK Parent Dashboard</a>
        </p>
      </div>
    `,
  });
};
