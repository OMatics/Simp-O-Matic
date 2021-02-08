const Discord = require('discord.js');

// Panic attack command
exports.run = (client, message, args) => {
  message.channel.send({ files: [`${process.cwd()}/lib/drug-o-matic/assets/breathe.gif`] });
};
