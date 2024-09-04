// A VOIR PLUS TARD


// import type { NextApiRequest, NextApiResponse } from 'next';
  
// export const discordMessageHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  
//   try {
//     if (req.method !== 'POST') {
//       return res.status(405).json({ error: 'Method not allowed' });
//     }

//     const { content } = await req.body.json();
    
//     console.log('Discord bot received:',content);

//     const channelID = process.env.NEXT_PUBLIC_DISCORD_CHANNEL_ID;
//     const discordToken = process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN;
//     const discordURL = `${process.env.NEXT_PUBLIC_DISCORD_API_URL}/channels/${channelID}/messages`;
//     console.log('chanaanlele = ', channelID, "Message", content, discordToken);

//     if (!discordURL || !discordToken) {
//       return res.status(500).json({ error: 'Missing required environment variables' });
//     }

//     const response = await fetch(discordURL, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bot ${discordToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         content: content
//       }),
//     });

//     const data = await response.json();
//     console.log('Discord API response:', data);

//     if (data.status === 204) {
//       res.status(data.status).json({ message: 'Message sent successfully' });
//     } else {
//       throw new Error(`Discord API error: ${JSON.stringify(data)}`);
//     }
//   } catch (error) {
//     console.error('Error in discordMessageHandler:', error);
//     res.status(500).json({ error: 'Sending failed' });
//   }
// };