import logger from "@/app/_utils/logger";


export async function POST(req: Request) {
    console.log('req', req);
    const { type, record } = await req.json();

    logger.log(
        "next:api",
        "brevo/update-list",
        "POST",
        "type",
        type,
        "record",
        record
    )

    const BREVO_API_KEY = process.env.BREVO;
    if (!BREVO_API_KEY) {
        return Response.json({
            success: false,
            message: 'Brevo API key not found',
        });
    }

    if (type === 'INSERT') {
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify({ updateEnabled: false })
        };

        fetch('https://api.brevo.com/v3/contacts', options)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.error(err));

    } else if (type === 'UPDATE') {
        const options = {
            method: 'PUT',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'api-key': BREVO_API_KEY
            }
        };

        fetch('https://api.brevo.com/v3/contacts/identifier', options)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.error(err));

    } else if (type === 'DELETE') {
        const options = {
            method: 'DELETE',
            headers: {
                accept: 'application/json',
                'api-key': BREVO_API_KEY
            }
        };

        fetch('https://api.brevo.com/v3/contacts/identifier', options)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.error(err));

    } else {
        return Response.json({
            success: false,
            message: 'Invalid type',
        });
    }

    return Response.json({
        success: true,
        message: 'Record updated successfully',
    });
}