import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_USER_ID = "default-user-my-finances";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || DEFAULT_USER_ID;

    // Delete transactions & goals scoped to target user
    await prisma.transaction.deleteMany({ where: { userId } });
    await prisma.goal.deleteMany({ where: { userId } });

    // Reset user financial parameters
    await prisma.user.updateMany({
      where: { id: userId },
      data: {
        name: "My Finances",
        monthlyIncome: 0,
        age: 24,
        existingObligations: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "All financial data reset successfully! You have a fresh slate.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
