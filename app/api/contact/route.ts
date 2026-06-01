import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPool } from "@/lib/db";
import { sendAdminNotification, sendCustomerConfirmation } from "@/lib/mailer";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { name, email, phone, company, subject, message } = parsed.data;

    // Save to MySQL
    const pool = getPool();
    await pool.execute(
      `INSERT INTO contact_leads (name, email, phone, company, subject, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, company || null, subject || null, message]
    );

    // Fetch the created_at for the email
    const now = new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      dateStyle: "full",
      timeStyle: "short",
    });

    const lead = { name, email, phone, company, subject, message, created_at: now };

    // Send emails (non-blocking — don't fail the response if mail fails)
    await Promise.allSettled([
      sendAdminNotification(lead),
      sendCustomerConfirmation(lead),
    ]);

    return NextResponse.json({ success: true, message: "Lead submitted successfully" });
  } catch (error) {
    console.error("[/api/contact] Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
