import { getNames, getUser } from "@/app/(backend)/data-access/user";

export async function GET() {
    const { data: { user: user } } = await getUser();

    if (!user) return new Response(null, { status: 401, statusText: 'User not found' });

    const { firstName, lastName } = await getNames(user.id);

    return new Response(JSON.stringify({ firstName, lastName }), { status: 200 });
}