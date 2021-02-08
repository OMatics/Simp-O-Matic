//tripsit combo chart message
exports.run = (client, message, args) => {
  message.channel
    .send({ files: [`${process.cwd()}/lib/drug-o-matic/assets/combochart.png`] })
    .catch(console.error);
};
