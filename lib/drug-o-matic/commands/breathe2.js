const Discord = require('discord.js');

// Panic attack command
exports.run = (client, message, args) => {
  message.answer({ files: [`${process.cwd()}/lib/drug-o-matic/assets/breathe2.gif`] });
};
