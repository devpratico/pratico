import { NextRequest, NextResponse } from 'next/server';
import createClient from '@/supabase/clients/server';


const webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';


export async function POST(request: NextRequest) {
    if (!webhookUrl) {
        console.error('next:api', 'sendDiscordMessage', 'No webhook url provided. Please provide the DISCORD_WEBHOOK_URL environment variable');
        return NextResponse.json({ error: 'No webhook url provided' }, { status: 400 });
    }

    const { message: messageContent } = await request.json();

    if (!messageContent) {
        console.error('next:api', 'sendDiscordMessage', 'No message provided');
        return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    const supabase = createClient()
    const {data: userData, error: userError } = await supabase.auth.getUser()

    let names: string | undefined

    if (!userError && userData?.user?.id) {
        const { data: _names, error: namesError } = await supabase.from('user_profiles').select('first_name, last_name').eq('id', userData.user.id).single()
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
            console.error('next:api', 'sendDiscordMessage', 'Error sending message');
            return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
        }

        return NextResponse.json({ msg: 'Message sent' }, { status: 200 });

    } catch (error) {
        console.error('next:api', 'sendDiscordMessage', 'Error sending message:', error);
        return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
    }
}