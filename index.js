const { Client } = require('discord.js-selfbot-v13');
const config = require('./config.json');

const client = new Client();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setTimeout(() => {
    config.guilds.forEach(guildConfig => {
      const guild = client.guilds.cache.get(guildConfig.id);
      if (guild) {
        console.log(`Guild ${guildConfig.id} found`);
        guildConfig.channels.forEach(channelConfig => {
          const { id, message, interval } = channelConfig;

          const channel = guild.channels.cache.get(id);
          if (channel) {
            console.log(`Channel ${id} found in guild ${guildConfig.id}`);
            if (channel.isText()) {
              console.log(`Setting up interval for channel ${id} with interval ${interval} minutes`);
              setInterval(() => {
                console.log(`Interval triggered for channel ${id}`);
                if (message && message.trim()) {
                  channel.send(message)
                    .then(() => console.log(`Message sent to ${id}: ${message}`))
                    .catch(console.error);
                } else {
                  console.error(`Message for channel ${id} is empty or invalid`);
                }
              }, interval * 60000); // interval in minutes
            } else {
              console.error(`Channel ${id} is not a text channel`);
            }
          } else {
            console.error(`Channel ${id} not found in guild ${guildConfig.id}`);
          }
        });
      } else {
        console.error(`Guild ${guildConfig.id} not found`);
      }
    });
  }, 5000); // Tunggu 5 detik sebelum mengakses channel

  // Mengirim pesan ke channel untuk pengujian
  const testChannel = client.channels.cache.get('1266151361326874627');
  if (testChannel && testChannel.isText()) {
    testChannel.send('Hello from bot!')
      .then(() => console.log('Test message sent successfully'))
      .catch(console.error);
  } else {
    console.error('Test channel not found or not a text channel');
  }
});

client.login(config.token);