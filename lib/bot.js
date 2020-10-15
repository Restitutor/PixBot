const Discord = require('discord.js');
const {Player} = require('./player');

class Bot {
  constructor(config) {
    this.channel = undefined;
    this.client = new Discord.Client();
    this.client.login(config.discordToken);
    this.player = new Player(config.key, config.uuid, config.interval * 1000);

    this.client.on('error', console.error);

    this.client.on('ready', () => {
      this.player.start();

      this.client.channels.fetch(config.discordChannel)
          .then((channel) => this.channel = channel)
          .catch(console.error);

      this.player.emitter.on('join', () => {
        this.join();
      });

      this.player.emitter.on('quit', () => {
        this.quit();
      });
    });
  }

  join() {
    if (this.channel === undefined) return;
    this.channel.send(`Hex joined the game.`);
  }

  quit() {
    if (this.channel === undefined) return;
    this.channel.send(`Hex got kicked. @everyone`);
  }
}

module.exports = {
  Bot,
};
