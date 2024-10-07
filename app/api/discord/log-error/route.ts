import logger from '@/app/_utils/logger';
import { NextRequest, NextResponse } from 'next/server';
import createClient from '@/supabase/clients/server';
import { use } from 'react';

const webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';


export async function POST(request: NextRequest) {
    if (!webhookUrl) {
        logger.error('next:api', 'sendDiscordMessage', 'No webhook url provided. Please provide the DISCORD_WEBHOOK_URL environment variable');
        return NextResponse.json({ error: 'No webhook url provided' }, { status: 400 });
    }

    const { message: messageContent } = await request.json();

    if (!messageContent) {
        logger.error('next:api', 'sendDiscordMessage', 'No message provided');
        return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    const supabase = createClient()
    const {data: userData, error: userError } = await supabase.auth.getUser()

    const userId = userData?.user?.id
    const email = userData?.user?.email

    let names: string | undefined

    if (userId) {
        const { data: _names, error: namesError } = await supabase.from('user_profiles').select('first_name, last_name').eq('id', userId).single()
        if (!namesError && _names.first_name && _names.first_name !== '' && _names.last_name && _names.last_name !== '') {
            names = `${_names.first_name} ${_names.last_name}`
        }
    }

    const userIdentity = {
        name: names || '',
        email: ('__' +  userData?.user?.email + '__') || '',
        isAnonymous: userData?.user?.is_anonymous ? '(anonyme)' : '',
        id: '`' + userData?.user?.id + '`' || 'Utilisateur inconnu',
    }

    const userIdentitiesArray = [userIdentity.name, userIdentity.email, userIdentity.isAnonymous, userIdentity.id]
    const useridentitiesString = userIdentitiesArray.join(' ')

    const message = '⚠️ ' + useridentitiesString + ' a rencontré une erreur :\n' + '`' + messageContent + '`'


    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content: message,}),
        });

        if (!response.ok) {
            logger.error('next:api', 'sendDiscordMessage', 'Error sending message');
            return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
        }

        return NextResponse.json({ msg: 'Message sent' }, { status: 200 });

    } catch (error) {
        logger.error('next:api', 'sendDiscordMessage', 'Error sending message:', error);
        return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
    }
}