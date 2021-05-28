exports.run = (client, message, args) => {
  message
    .reply({ files: [`${process.cwd()}/lib/drug-o-matic//assets/hrtguide.png`] })
    .catch(console.error);
}
