import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false, // TLS via STARTTLS
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  created_at: string;
}

const from = `"${process.env.MAIL_FROM_NAME || "Quilonix"}" <${process.env.MAIL_FROM_ADDRESS}>`;

/** Email sent to both admins */
export async function sendAdminNotification(lead: LeadData) {
  const admins = [
    process.env.MAIL_ADMIN_1,
    process.env.MAIL_ADMIN_2,
  ].filter(Boolean) as string[];

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0F1115;color:#F1F3F5;padding:32px;border:1px solid #FFD000;">
      <h2 style="color:#FFD000;margin-top:0;">🚀 New Contact Lead Received</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#98A2B3;width:140px;">Name</td><td style="padding:8px 0;font-weight:bold;">${lead.name}</td></tr>
        <tr><td style="padding:8px 0;color:#98A2B3;">Email</td><td style="padding:8px 0;"><a href="mailto:${lead.email}" style="color:#FFD000;">${lead.email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#98A2B3;">Phone</td><td style="padding:8px 0;">${lead.phone || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#98A2B3;">Company</td><td style="padding:8px 0;">${lead.company || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#98A2B3;">Subject</td><td style="padding:8px 0;">${lead.subject || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#98A2B3;">Submitted</td><td style="padding:8px 0;">${lead.created_at}</td></tr>
      </table>
      <div style="margin-top:24px;padding:16px;background:#1A1D24;border-left:3px solid #FFD000;">
        <p style="color:#98A2B3;margin:0 0 8px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Message</p>
        <p style="margin:0;white-space:pre-wrap;">${lead.message}</p>
      </div>
      <p style="margin-top:24px;font-size:12px;color:#98A2B3;">Quilonix — AI Automation Agency</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: admins.join(", "),
    subject: `New Contact Lead Received — ${lead.name}`,
    html,
  });
}

/** Confirmation email sent to the customer */
export async function sendCustomerConfirmation(lead: LeadData) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0F1115;color:#F1F3F5;padding:32px;border:1px solid #FFD000;">
      <h2 style="color:#FFD000;margin-top:0;">Thanks for reaching out, ${lead.name}!</h2>
      <p style="color:#98A2B3;line-height:1.7;">
        We've received your message and our team will get back to you within <strong style="color:#F1F3F5;">24 hours</strong>.
      </p>
      <div style="margin-top:24px;padding:16px;background:#1A1D24;border-left:3px solid #FFD000;">
        <p style="color:#98A2B3;margin:0 0 8px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Your Message</p>
        <p style="margin:0;white-space:pre-wrap;">${lead.message}</p>
      </div>
      <p style="margin-top:32px;color:#98A2B3;line-height:1.7;">
        In the meantime, feel free to explore what we do at <a href="https://quilonix.com" style="color:#FFD000;">quilonix.com</a>.
      </p>
      <p style="margin-top:24px;font-size:12px;color:#98A2B3;">
        — The Quilonix Team<br/>
        AI Automation · Web Development · Mobile Apps
      </p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: lead.email,
    subject: "We received your query — Quilonix",
    html,
  });
}
