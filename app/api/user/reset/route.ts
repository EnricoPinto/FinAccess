import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Delete all user data scoped to this account only
    await prisma.transaction.deleteMany({ where: { userId } });
    await prisma.goal.deleteMany({ where: { userId } });
    await prisma.emiEntry.deleteMany({ where: { userId } });

    // Reset user financial parameters to defaults
    await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyIncome: 0,
        age: 22,
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
