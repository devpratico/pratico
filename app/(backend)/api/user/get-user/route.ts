import { getUser } from "@/app/(backend)/data-access/user";

export async function GET() {
    const { data: { user: user } } = await getUser();

    if (!user) return new Response(null, { status: 401, statusText: 'User not found' });

    return new Response(JSON.stringify(user), { status: 200 });
}