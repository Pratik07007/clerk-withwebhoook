import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await prisma.user.findMany({
    include: {
      email: {
        select: {
          verification: true,
          email: true,
        },
      },
    },
  });
  return NextResponse.json(user);
}
