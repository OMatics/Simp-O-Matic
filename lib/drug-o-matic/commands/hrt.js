exports.run = (client, message, args) => {
  message.channel
    .send({ files: [`${process.cwd()}/lib/drug-o-matic//assets/hrtguide.png`] })
    .catch(console.error);
}
