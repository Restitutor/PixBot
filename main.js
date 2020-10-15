const Discord = require('discord.js');
const { Bot } = require('./lib/bot');

const config = require('./config.json');
const pixbot = new Bot(config);
