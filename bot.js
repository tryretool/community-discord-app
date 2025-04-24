import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', message => {
  if (message.mentions.has(client.user)) {
    message.reply('Hello! You mentioned me?');
  }
});

client.login(process.env.DISCORD_TOKEN);