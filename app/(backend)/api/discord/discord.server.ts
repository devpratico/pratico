import 'server-only';
import createClient from '@/supabase/clients/server';


export interface SendDiscordMessageReturn {
    success: boolean;
    error: string | null;
}


const webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';


export async function sendDiscordMessage(message: string): Promise<SendDiscordMessageReturn> {

    if (!webhookUrl) {
        console.error('next:api', 'sendDiscordMessage', 'No webhook url provided. Please provide the DISCORD_WEBHOOK_URL environment variable');
        return { success: false, error: 'No webhook url provided' };
    }

    if (!message) {
        console.error('next:api', 'sendDiscordMessage', 'No message provided');
        return { success: false, error: 'No message provided' };
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message, }),
        });

        if (!response.ok) {
            console.error('next:api', 'sendDiscordMessage', 'Error sending message');
            return { success: false, error: 'Error sending message' };
        }

        return { success: true, error: null };

    } catch (error) {
        console.error('next:api', 'sendDiscordMessage', 'Error sending message:', error);
        return { success: false, error: 'Error sending message' };
    }

}


export async function sendDiscordError(message: string): Promise<SendDiscordMessageReturn> {
    if (!webhookUrl) {
        console.error('next:api', 'sendDiscordMessage', 'No webhook url provided. Please provide the DISCORD_WEBHOOK_URL environment variable');
        return { success: false, error: 'No webhook url provided' };
    }

    if (!message) {
        console.error('next:api', 'sendDiscordMessage', 'No message provided');
        return { success: false, error: 'No message provided' };
    }

    const supabase = createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    let names: string | undefined

    if (!userError && userData?.user?.id) {
        const { data: _names, error: namesError } = await supabase.from('user_profiles').select('first_name, last_name').eq('id', userData.user.id).single()
        if (!namesError && _names.first_name && _names.first_name !== '' && _names.last_name && _names.last_name !== '') {
            names = `${_names.first_name} ${_names.last_name}`
        }
    }

    const userIdentity = {
        name: names || '',
        email: ('__' + userData?.user?.email + '__') || '',
        isAnonymous: userData?.user?.is_anonymous ? '(anonyme)' : '',
        id: '`' + userData?.user?.id + '`' || 'Utilisateur inconnu',
    }

    const userIdentitiesArray = [userIdentity.name, userIdentity.email, userIdentity.isAnonymous, userIdentity.id]
    const useridentitiesString = userIdentitiesArray.join(' ')

    const fullMessage = '⚠️ ' + useridentitiesString + ' a rencontré une erreur :\n' + '`' + message + '`'


    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: fullMessage, }),
        });

        if (!response.ok) {
            console.error('next:api', 'sendDiscordMessage', 'Error sending message', JSON.stringify(response));
            return { success: false, error: 'Error sending message' };
        }

        return { success: true, error: null };

    } catch (error) {
        console.error('next:api', 'sendDiscordMessage', 'Error sending message:', error);
        return { success: false, error: 'Error sending message' };
    }
}