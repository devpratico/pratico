import { NextApiRequest, NextApiResponse } from 'next';
import { Client, Message, TextChannel } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    'Guilds',
    'GuildMessages'
  ]
});

client.once('ready', () => {
  console.log('Bot ready!');
});

client.on('messageCreate', async (message: Message) => {
  if (!message.content.startsWith('!')) return;

  const [, , ...args] = message.content.split(' ');

  switch(args[0]) {
    case '!sendname':
      const channelId = process.env.NEXT_PUBLIC_DISCORD_CHANNEL_ID;
      if (!channelId) {
        console.error('NEXT_PUBLIC_DISCORD_CHANNEL_ID environment variable is not set');
        return;
      }

      const channel = await client.channels.fetch(channelId) as TextChannel;
      if (!channel) {
        console.error(`Channel with ID ${channelId} not found`);
        return ;
      }

      try {
        if (channel?.isTextBased())
            await channel.send(`Name : ${args.slice(1).join(' ')}`);
      } catch (error) {
        console.error('Sending msg error:', error);
      }
      break;
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const channelId = process.env.NEXT_PUBLIC_DISCORD_CHANNEL_ID ? process.env.NEXT_PUBLIC_DISCORD_CHANNEL_ID : '' ;
  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Nom requis' });
    }
    const channel = await client.channels.fetch(channelId);
    if (channel?.isTextBased())
        await (client.channels.cache.get(channelId) as TextChannel)?.send(`User : ${name}`);
    res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}