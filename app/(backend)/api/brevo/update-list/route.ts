import logger from "@/app/_utils/logger";

const listId = '17';

export async function POST(req: Request) {
    console.log('req', req);
    const { type, record, old_record } = await req.json();

    logger.log(
        "next:api",
        "brevo/update-list",
        "POST",
        "type",
        type,
        "record",
        record,
        "old_record",
        old_record
    )

    const BREVO_API_KEY = process.env.BREVO;
    if (!BREVO_API_KEY) {
        return Response.json({
            success: false,
            message: 'Brevo API key not found',
        });
    }

    const email = record.email;
    if (!email) {
        return Response.json({
            success: false,
            message: 'Email not found',
        });
    }

    const oldEmail = old_record.email as string;

    if (type === 'INSERT') {
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify({
                email: email,
                updateEnabled: false,
                listIds: [listId]
            })
        };

        fetch('https://api.brevo.com/v3/contacts', options)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.error(err));

    } else if (type === 'UPDATE') {
        if (!oldEmail) {
            return Response.json({
                success: false,
                message: 'Old email not found. Cannot identify contact',
            });
        }
        const options = {
            method: 'PUT',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify({
                "EMAIL": email,
                updateEnabled: true,
                listIds: [listId]
            })
        };

        fetch(
            'https://api.brevo.com/v3/contacts/' + oldEmail,
            options
        )
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

        fetch(
            'https://api.brevo.com/v3/contacts/' + email,
            options
        )
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