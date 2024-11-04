//code copied from official documentation of clerk "https://clerk.com/docs/integrations/webhooks/sync-data#sync-clerk-data-to-your-application-with-webhooks"
//I could have created thsi wekhook in cloudflare workers to deploy it in serverless environment and attach a queue to handel db queries adn retry if it fails
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  switch (eventType) {
    case "user.created":
      await prisma.$transaction([
        prisma.user.create({
          data: {
            id: id || "",
            imageUrl: payload.data.profile_image_url || "",
          },
        }),
        prisma.email.create({
          data: {
            userId: id || "",
            email: payload.data.email_addresses[0].email_address,
            verification: payload.data.email_addresses[0].verification.status,
          },
        }),
      ]);
      break;

    case "user.updated":
      console.log("User details have been updated.");
      break;

    case "user.deleted":
      console.log("A user has been deleted.");
      break;

    default:
      console.log("Unknown event type.");
      break;
  }

  console.log("Webhook body:", body);
  return new Response("", { status: 200 });
}
