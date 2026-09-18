import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateWelcomeEmailHtml, sendEmail } from "@/lib/emailService";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = subscribeSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message || "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = parseResult.data;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    let alreadySubscribed = false;

    if (!existing) {
      // Save to Supabase DB
      await prisma.newsletterSubscriber.create({
        data: {
          email: normalizedEmail,
          source: "footer",
        },
      });
    } else {
      alreadySubscribed = true;
    }

    // Determine base URL for email links
    const appUrl =
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://fin-access-chi.vercel.app");

    // Send the beautifully formatted welcome email
    const emailHtml = generateWelcomeEmailHtml(normalizedEmail, appUrl);
    const emailResult = await sendEmail({
      to: normalizedEmail,
      subject: "Welcome to FinAccess Financial Signals",
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: alreadySubscribed
        ? "Welcome back! We've resent your Financial Signals welcome guide."
        : "Subscribed! Check your inbox for your Financial Signals welcome guide.",
      alreadySubscribed,
      provider: emailResult.provider,
    });
  } catch (error: any) {
    console.error("[Newsletter API Error]:", error);
    return NextResponse.json(
      { error: "Failed to process subscription. Please try again." },
      { status: 500 }
    );
  }
}
