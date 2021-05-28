//tripsit combo chart message
exports.run = (client, message, args) => {
  message.reply({ files: [`${process.cwd()}/lib/drug-o-matic/assets/combochart.png`] })
};
