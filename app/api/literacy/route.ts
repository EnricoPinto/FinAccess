import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SAMPLE_LITERACY_MODULES } from "@/lib/seedData";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    let modules = await prisma.literacyModule.findMany({
      orderBy: { title: "asc" },
    });

    if (modules.length === 0) {
      modules = SAMPLE_LITERACY_MODULES.map((m, i) => ({
        id: `sample-module-${i}`,
        ...m,
        createdAt: new Date(),
      }));
    }

    if (slug) {
      const moduleItem = modules.find((m) => m.slug === slug);
      if (!moduleItem) {
        return NextResponse.json({ error: "Module not found" }, { status: 404 });
      }
      return NextResponse.json({ module: moduleItem });
    }

    return NextResponse.json({ modules });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
