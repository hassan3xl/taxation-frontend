// app/api/profile/me/route.ts
import { getAccessToken } from "@/lib/actions/auth.actions";

export async function GET() {
  const token = await getAccessToken();

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_BACKEND_API_URL}/api/profile/me/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  return new Response(await res.text(), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
