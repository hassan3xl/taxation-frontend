import { getAccessToken } from "@/lib/actions/auth.actions";

export async function getCurrentUser() {
  const token = await getAccessToken();

  if (!token) return null;

  const res = await fetch(
    `${process.env.NEXT_BACKEND_API_URL}/api/profile/me/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  return res.ok ? res.json() : null;
}
