exports.run = (client, message, args) => {
  message.channel
    .send(`Hello <@${ message.author.id }>, I'm DoseBot Redux! Nice to meet you! ^_^`,
          { files: [`${process.cwd()}/lib/drug-o-matic/assets/mascot.png`] })
    .catch(console.error);
};
