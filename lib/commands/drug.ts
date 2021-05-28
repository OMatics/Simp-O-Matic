exports.description = "Drouges";
exports.options = [
  { name: 'about', type: 'SUB_COMMAND', description: 'About DoseBot Redux' },
  { name: 'avatar', type: 'SUB_COMMAND', description: 'DoseBot Redux Avatar Service' },
  { name: 'badtrip', type: 'SUB_COMMAND', description: 'Assistance' },
  { name: 'bobross', type: 'SUB_COMMAND', description: 'Enjoy a random episode of The Joy of Painting' },
  { name: 'breathe', type: 'SUB_COMMAND', description: 'Panic attack command' },
  {
    name: 'combochart',
    type: 'SUB_COMMAND',
    description: "That Drug Combo Chart You've Probably Seen A Million Times"
  },
  {
    name: 'dxmcalc',
    type: 'SUB_COMMAND_GROUP',
    description: 'DXM Dosage Calculator',
   options: [{
      name: "kg",
      type: "SUB_COMMAND",
      description: "DXM Dosage Calculator",
      options: [{
        name: "weight",
        type: "INTEGER",
        description: "Weight in kilograms",
        required: true
      }]
   }, {
      name: "lbs",
      type: "SUB_COMMAND",
      description: "DXM Dosage Calculator",
      options: [{
        name: "weight",
        type: "INTEGER",
        description: "Weight in kilograms",
        required: true
      }]
   }]
  },
  {
    name: 'effectinfo',
    type: 'SUB_COMMAND',
    description: 'Look up on the Effect Index',
   options: [{
    name: "drug",
    type: "STRING",
    description: "Drug name",
    required: true
   }]
  },
  { name: 'effects', type: 'SUB_COMMAND', description: 'Drug effect information', 
   options: [{
    name: "drug",
    type: "STRING",
    description: "Drug Name",
    required: true
   }]},
  { name: 'help', type: 'SUB_COMMAND', description: 'DoseBot Help' },
  { name: 'hrt', type: 'SUB_COMMAND', description: 'DIY HRT Guide' },
  { name: 'info', type: 'SUB_COMMAND', description: 'Get drug information',
     options: [{
    name: "drug",
    type: "STRING",
    description: "Drug name",
    required: true
   }] },
  {
    name: 'invitelink',
    type: 'SUB_COMMAND',
    description: 'Invite Link for DoseBot'
  },
  {
    name: 'ketaminecalc',
    type: 'SUB_COMMAND_GROUP',
    description: 'Ketamine Dosage Calculator',
   options: [{
      name: "kg",
      type: "SUB_COMMAND",
      description: "Ketamine Dosage Calculator",
      options: [{
        name: "weight",
        type: "INTEGER",
        description: "Weight in kilograms",
        required: true
      }]
   }, {
      name: "lbs",
      type: "SUB_COMMAND",
      description: "Ketamine Dosage Calculator",
      options: [{
        name: "weight",
        type: "INTEGER",
        description: "Weight in lbs",
        required: true
      }]
   }]
  },
  {
    name: 'psychtolerance',
    type: 'SUB_COMMAND',
    description: 'Calculate tolerance/extra dose needed to achieve normal effects',
    options: [{
    name: "days",
    type: "INTEGER",
    description: "Days since last trip",
    required: true
   }]
  },
  { name: 'randomtdc', type: 'SUB_COMMAND', description: 'Send a random TDC video to the channel' },
  { name: 'sei', type: 'SUB_COMMAND', description: 'The Subjective Effect Index' },
];

exports.main = async (home_scope: HomeScope) => {
	const { CLIENT, message, Drugs } = home_scope;
	try {
		message.defer();
		message.content = `--${message.options[0].name} ${message.options[0].options[0]?message.options[0].options[0].value || (message.options[0].options[0].name + " " + message.options[0].options[0].options[0].value):""}`;
		message.reply = message.editReply;
    Drugs.execute(CLIENT, message);
	} catch (e) {
		message.reply(`Failed to execute \`${message.options[0].name}\` command for Drug-O-Matic.`
			+ "\n```\n" + `${e}` + "\n```")
	}
};
