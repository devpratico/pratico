

export async function POST(req: Request) {
    console.log('req', req);
    const { type, record } = await req.json();

    console.log(type, record);

    return Response.json({
        success: true,
        message: 'Record updated successfully',
    });
}