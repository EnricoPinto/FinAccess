import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateLoanEligibility } from "@/lib/loanEligibility";
import { SAMPLE_LOAN_PRODUCTS } from "@/lib/seedData";

export async function GET() {
  try {
    let products = await prisma.loanProduct.findMany({
      orderBy: { minInterestRate: "asc" },
    });

    if (products.length === 0) {
      // Fallback sample loan products
      products = SAMPLE_LOAN_PRODUCTS.map((p, i) => ({
        id: `sample-loan-${i}`,
        ...p,
        createdAt: new Date(),
      }));
    }

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { monthlyIncome, existingObligations, age } = body;

    let products = await prisma.loanProduct.findMany();
    if (products.length === 0) {
      products = SAMPLE_LOAN_PRODUCTS.map((p, i) => ({
        id: `sample-loan-${i}`,
        ...p,
        createdAt: new Date(),
      }));
    }

    const evaluationSummary = evaluateLoanEligibility(
      {
        monthlyIncome: typeof monthlyIncome !== "undefined" && !isNaN(Number(monthlyIncome)) ? Math.max(Number(monthlyIncome), 0) : 0,
        existingObligations: Math.max(Number(existingObligations) || 0, 0),
        age: Math.max(Number(age) || 22, 18),
      },
      products as any
    );

    return NextResponse.json({ summary: evaluationSummary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
