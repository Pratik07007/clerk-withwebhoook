import prisma from "@/lib/db";
import React from "react";

async function Admin() {
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
  console.log(user);
  return <div>{JSON.stringify(user)}</div>;
}

export default Admin;
