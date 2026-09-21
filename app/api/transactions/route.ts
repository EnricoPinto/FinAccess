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

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ transactions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { type, category, amount, description, isDiscretionary, source, ocrConfidence, rawOcrText, date } = body;

    const parsedAmount = Number(amount);
    if (!type || !category || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Valid type, category, and positive amount are required" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        category,
        amount: parsedAmount,
        description: description || "",
        isDiscretionary: Boolean(isDiscretionary),
        date: date ? new Date(date) : new Date(),
        source: source || "manual",
        ocrConfidence: ocrConfidence || null,
        rawOcrText: rawOcrText || null,
      },
    });

    return NextResponse.json({ transaction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, type, category, amount, description, isDiscretionary, source, ocrConfidence, rawOcrText, date } = body;

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const parsedAmount = Number(amount);
    if (!type || !category || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Valid type, category, and positive amount are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.transaction.updateMany({
      where: { id, userId },
      data: {
        type,
        category,
        amount: parsedAmount,
        description: description || "",
        isDiscretionary: type === "EXPENSE" ? Boolean(isDiscretionary) : false,
        ...(date ? { date: new Date(date) } : {}),
        ...(source ? { source } : {}),
        ...(ocrConfidence ? { ocrConfidence } : {}),
        ...(rawOcrText ? { rawOcrText } : {}),
      },
    });

    return NextResponse.json({ success: true, count: updated.count });
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
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    await prisma.transaction.deleteMany({
      where: { id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
