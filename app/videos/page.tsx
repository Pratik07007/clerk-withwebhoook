import VideosButton from "@/components/VideosButton";
import { auth } from "@clerk/nextjs/server";

export default async function Videos() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return (
    <div>
      <h1>Hello, {userId}</h1>
      <VideosButton />
    </div>
  );
}
