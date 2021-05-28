import { rule } from '../rule';

exports.description = "Deletes messages meeting certain patterns.";
exports.options = [{
    	name: "add",
	    type: "SUB_COMMAND",
	    description: "Deletes messages meeting certain patterns.",
	    options: [
	    	{
	    		name: "match",
	    		type: "STRING",
	    		description: "Reject certain messages, matching a regular-expression.",
	    		required: true
	    	}, {
	    		name: "reply",
	    		type: "STRING",
	    		description: "Reply when rejecting."
	    	}
	    ]
	}, {
		name: "rm",
		type: "SUB_COMMAND",
		description: "Remove a rejection rule.",
		options: [
			{
				name: "rule",
				type: "INTEGER",
				description: "Remove a rejection rule.",
				required: true,
				choices: []
			}
		]
	}
];
exports.main = rule('reject');