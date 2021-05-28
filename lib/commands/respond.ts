import { rule } from '../rule';

exports.description = "How the bot should respond to certain messages";
exports.options = [{
    	name: "add",
	    type: "SUB_COMMAND",
	    description: "How the bot should respond to certain messages.",
	    options: [
	    	{
	    		name: "match",
	    		type: "STRING",
	    		description: "Match a regular expression.",
	    		required: true
	    	}, {
	    		name: "reply",
	    		type: "STRING",
	    		description: "Reply with this message",
	    		required: true
	    	}
	    ]
	}, {
		name: "rm",
		type: "SUB_COMMAND",
		description: "Remove the response-rule.",
		options: [
			{
				name: "rule",
				type: "INTEGER",
				description: "Remove the response-rule",
				required: true,
				choices: []
			}
		]
	}
];
exports.main = rule('respond');