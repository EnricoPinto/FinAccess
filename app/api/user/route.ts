import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_USER_ID = "default-user-my-finances";

async function getOrCreateDefaultUser() {
  let user = await prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID },
  });

  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: "user@finaccess.local" },
    });
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: DEFAULT_USER_ID,
        name: "My Finances",
        email: "user@finaccess.local",
        password: "password123",
        monthlyIncome: 0,
        age: 24,
        existingObligations: 0,
      },
    });
  }
  return user;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as any)?.id;

    let user;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }

    if (!user) {
      user = await getOrCreateDefaultUser();
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as any)?.id;
    const body = await req.json();

    if (!userId) {
      const user = await getOrCreateDefaultUser();
      userId = user.id;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name || "My Finances",
        monthlyIncome: Math.max(Number(body.monthlyIncome) || 0, 0),
        age: Math.max(Number(body.age) || 24, 18),
        existingObligations: Math.max(Number(body.existingObligations) || 0, 0),
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
