import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_USER_ID = "default-user-my-finances";

async function getTargetUserId(session: any) {
  let userId = (session?.user as any)?.id;
  if (!userId) {
    let user = await prisma.user.findUnique({
      where: { id: DEFAULT_USER_ID },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: DEFAULT_USER_ID,
          name: "My Finances",
          email: "user@finaccess.local",
          password: "password123",
          monthlyIncome: 0,
        },
      });
    }
    userId = user.id;
  }
  return userId;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = await getTargetUserId(session);

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ goals });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = await getTargetUserId(session);

    const body = await req.json();
    const { name, targetAmount, currentAmount, monthlyContribution, category } = body;

    const parsedTarget = Number(targetAmount);
    if (!name || isNaN(parsedTarget) || parsedTarget <= 0) {
      return NextResponse.json(
        { error: "Goal name and positive target amount are required" },
        { status: 400 }
      );
    }

    const parsedContribution = typeof monthlyContribution !== "undefined" && !isNaN(Number(monthlyContribution)) ? Math.max(Number(monthlyContribution), 0) : 2500;

    const goal = await prisma.goal.create({
      data: {
        userId,
        name,
        targetAmount: parsedTarget,
        currentAmount: Math.max(Number(currentAmount) || 0, 0),
        monthlyContribution: parsedContribution,
        category: category || "General",
      },
    });

    return NextResponse.json({ goal });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = await getTargetUserId(session);
    const body = await req.json();
    const { id, currentAmount, monthlyContribution } = body;

    if (!id || !userId) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const parsedContribution = typeof monthlyContribution !== "undefined" && !isNaN(Number(monthlyContribution)) ? Math.max(Number(monthlyContribution), 0) : 0;

    const updated = await prisma.goal.updateMany({
      where: { id, userId },
      data: {
        currentAmount: Math.max(Number(currentAmount) || 0, 0),
        monthlyContribution: parsedContribution,
      },
    });

    return NextResponse.json({ success: true, count: updated.count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = await getTargetUserId(session);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !userId) {
      return NextResponse.json({ error: "Missing goal ID" }, { status: 400 });
    }

    await prisma.goal.deleteMany({
      where: { id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
