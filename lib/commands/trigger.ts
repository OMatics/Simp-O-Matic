import { rule } from '../rule';

exports.description = "Triggers a command on messages meeting certain patterns";
exports.options = [{
    	name: "add",
	    type: "SUB_COMMAND",
	    description: "Triggers a command on messages meeting certain patterns",
	    options: [
	    	{
	    		name: "match",
	    		type: "STRING",
	    		description: "Match a regular expression.",
	    		required: true
	    	}, {
	    		name: "cmd",
	    		type: "STRING",
	    		description: "Run this command.",
	    		required: true
	    	}
	    ]
	}, {
		name: "rm",
		type: "SUB_COMMAND",
		description: "Remove the trigger-rule.",
		options: [
			{
				name: "rule",
				type: "INTEGER",
				description: "Remove the trigger-rule.",
				required: true,
				choices: []
			}
		]
	}
];
exports.main = rule('trigger');
