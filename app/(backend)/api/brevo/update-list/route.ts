import logger from "@/app/_utils/logger";

const listId: number = 17;

export async function POST(req: Request) {
    const { type, record, old_record } = await req.json();

    logger.log(
        "next:api",
        "brevo/update-list",
        "POST",
        "type",
        type,
        "record",
        record.email,
        "old_record",
        old_record?.email
    )

    const BREVO_API_KEY = process.env.BREVO;
    if (!BREVO_API_KEY) {
        logger.error('next:api', 'brevo/update-list', 'POST', 'Brevo API key not found');
        return Response.json({
            success: false,
            message: 'Brevo API key not found',
        });
    }

    const email = record.email;
    if (!email) {
        logger.error('next:api', 'brevo/update-list', 'POST', 'Email not found');
        return Response.json({
            success: false,
            message: 'Email not found',
        });
    }

    const oldEmail = old_record?.email as string | undefined;

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

        await fetch('https://api.brevo.com/v3/contacts', options)
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

        if (oldEmail === email) {
            return Response.json({
                success: false,
                message: 'Old email and new email are the same. Ignoring update.',
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

        await fetch(
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

        await fetch(
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