import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return null;
  return userId as string;
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const emis = await prisma.emiEntry.findMany({
      where: { userId },
      orderBy: { dueDay: "asc" },
    });

    // Normalize status to uppercase to handle any legacy lowercase values from DB default
    const normalizedEmis = emis.map((e) => ({
      ...e,
      status: (e.status || "ACTIVE").toUpperCase() as "ACTIVE" | "PAID_OFF",
    }));

    return NextResponse.json({ emis: normalizedEmis });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      name,
      type = "LOAN",
      principalAmount,
      interestRate,
      tenureMonths,
      monthlyInstallment,
      dueDay,
      startDate,
      linkedLoanProductId,
    } = body;

    if (!name || !monthlyInstallment || !dueDay) {
      return NextResponse.json(
        { error: "Name, monthly installment amount, and due day are required" },
        { status: 400 }
      );
    }

    const parsedDueDay = Math.min(31, Math.max(1, parseInt(dueDay, 10)));
    const parsedInstallment = Math.max(0, parseFloat(monthlyInstallment));

    const newEmi = await prisma.emiEntry.create({
      data: {
        userId,
        name: name.trim(),
        type: type === "CREDIT_CARD" ? "CREDIT_CARD" : "LOAN",
        principalAmount: principalAmount ? parseFloat(principalAmount) : null,
        interestRate: interestRate ? parseFloat(interestRate) : null,
        tenureMonths: tenureMonths ? parseInt(tenureMonths, 10) : null,
        monthlyInstallment: parsedInstallment,
        dueDay: parsedDueDay,
        startDate: startDate ? new Date(startDate) : new Date(),
        status: "ACTIVE",
        linkedLoanProductId: linkedLoanProductId || null,
      },
    });

    return NextResponse.json({ emi: newEmi }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, status, name, monthlyInstallment, dueDay } = body;

    if (!id) {
      return NextResponse.json({ error: "EMI ID is required" }, { status: 400 });
    }

    const existing = await prisma.emiEntry.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "EMI obligation not found" }, { status: 404 });
    }

    const updated = await prisma.emiEntry.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(name ? { name: name.trim() } : {}),
        ...(monthlyInstallment !== undefined ? { monthlyInstallment: parseFloat(monthlyInstallment) } : {}),
        ...(dueDay !== undefined ? { dueDay: Math.min(31, Math.max(1, parseInt(dueDay, 10))) } : {}),
      },
    });

    return NextResponse.json({ emi: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "EMI ID is required" }, { status: 400 });
    }

    const existing = await prisma.emiEntry.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "EMI obligation not found" }, { status: 404 });
    }

    await prisma.emiEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
