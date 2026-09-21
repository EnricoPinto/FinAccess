import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const emailClean = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: emailClean } });
    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists. Please sign in." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email: emailClean,
        name: name?.trim() || emailClean.split("@")[0] || "User",
        password: hashed,
        monthlyIncome: 0,
        age: 22,
        existingObligations: 0,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
