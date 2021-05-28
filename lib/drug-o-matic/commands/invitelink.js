exports.run = (client, message, args) => {
  message
    .reply('Want to invite Dosebot Redux to your server? Click this: https://discord.com/oauth2/authorize?client_id=799165497710084116&scope=bot&permissions=268815552')
    .catch(console.error);
}
