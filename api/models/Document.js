/**
 * Email.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var async = require('async');

module.exports = {

	attributes: {
		parsed_data: {
			type: 'json',
		},
		org: {
			model: 'org',
			required: true
		},
		parser_used: {
			type: 'string',
		},
		type:{
			type:'string',
			allowNull: true
		},
		description:{
			type:'string',
			allowNull: true
		},
		details: {
			type: 'json',
		},
		accounts:{
			collection:'account',
			via:'docs',
		},
		statement_line_items:{
			collection: 'statement_line_item',
			via: 'document'
		}
	}
};

