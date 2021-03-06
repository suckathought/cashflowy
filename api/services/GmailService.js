var extract_config = {
	
}

var atob = require('atob');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var async = require('async');
// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// const TOKEN_PATH = 'token.json';

// console.log(sails.config.gmail.installed);
// console.log(sails.config.gmail.token);
// console.log("\n\nclient_id - "+client_id)
const {client_secret, client_id, redirect_uris} = sails.config.gmail.installed;
// var oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
// oAuth2Client.setCredentials(options.email_token);

// // Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
// 	console.log('reading credentials.json');
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Gmail API.
//   // authorize(JSON.parse(content), listLabels);
//   var credentials = JSON.parse(content);
//   const {client_secret, client_id, redirect_uris} = credentials.installed;
//   oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getNewToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//   });
//   // authorize(JSON.parse(content), listMessages);
// });


/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return callback(err);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
}

function authorize(credentials) {
	const {client_secret, client_id, redirect_uris} = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

	// Check if we have previously stored a token.
	// fs.readFile('token.json', (err, token) => {
		// if (err) return getNewToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(credentials.token);
		// callback(null,oAuth2Client);
		return oAuth2Client;
	// });
}


module.exports={
	getMessages:function (options,callback) {
		var config=_.cloneDeep(sails.config.gmail);
		config.token = options.email_token;
		var auth = authorize(config);
		const gmail = google.gmail({version: 'v1', auth});
		console.log('in getMessages');
		gmail.users.messages.list({
			userId: 'me',
			q:options.q,
			maxResults:30,
			pageToken:options.pageToken?options.pageToken:null,
			// q:options.q,
		}, (err, res) => {
			console.log('get messages responded');
			if (err) return callback(err);
			// const messages = res.data.messages;
			// // if (messages.length) {
			// // 	console.log('messages:');
			// // 	messages.forEach((message) => {
			// // 	  console.log(`- ${message}`);
			// // 	});
				
			// // } else {
			// // 	console.log('No messages found.');
			// // }
			callback(null,res.data);
		});
		// });
	},
	// getMessageDetails:function (m_id,callback) {
	// 	var auth  = authorize(sails.config.gmail);
	// 	// console.log("\n\n\n====== m_id="+m_id);
	// 	const gmail = google.gmail({version: 'v1', auth});
	// 	gmail.users.messages.get({
	// 		userId: 'me',
	// 		id:m_id
	// 	}, (err, res) => {
	// 		// console.log('before throwing error');
	// 		// if (err) return console.log('The API returned an error: ' + err);
	// 		if (err) throw err;
	// 		// const messages = res.data.messages;
	// 		// console.log(res.data);
	// 		// console.log(res.data.payload.parts);
	// 		var body;
	// 		if(res.data.payload.body.size!=0)
	// 			body=res.data.payload.body.data;
	// 		else{ // these are emails containing attachments
	// 			res.data.payload.parts.forEach(function(part){
	// 				if(part.mimeType=='text/html'){
	// 					body=part.body.data;
	// 				}
	// 			})
	// 		}
	// 		var b = atob(body.replace(/-/g, '+').replace(/_/g, '/') ); 
	// 		// console.log(b);
	// 		const cheerio = require('cheerio')
	// 		const $ = cheerio.load(b);
	// 		console.log($('body').text());
	// 		var result = GmailService.extractData($('body').text());
	// 		// console.log('--------ED---------');
	// 		data.m_id=m_id;
	// 		// console.log(data);
	// 		callback(null,result);
			
	// 	});
	// 	// });
	// },
	getMessageBody:function(options,callback){
		var auth  = authorize(sails.config.gmail);
		var m_id=options.message_id;
		// console.log("\n\n\n====== m_id="+m_id);
		const gmail = google.gmail({version: 'v1', auth});
		gmail.users.messages.get({
			userId: 'me',
			id:m_id
		}, (err, res) => {
			// console.log('before throwing error');
			// if (err) return console.log('The API returned an error: ' + err);
			if (err) throw err;
			// const messages = res.data.messages;
			// console.log(res.data);
			// console.log(res.data.payload.parts);
			var body;
			if(res.data.payload.body.size!=0)
				body=res.data.payload.body.data;
			else{ // these are emails containing attachments
				res.data.payload.parts.forEach(function(part){
					if(part.mimeType=='text/html'){
						body=part.body.data;
					}
				})
			}
			var b = atob(body.replace(/-/g, '+').replace(/_/g, '/') ); 
			// console.log(b);
			const cheerio = require('cheerio')
			const $ = cheerio.load(b);
			callback(null,$('body').text());
			// console.log($('body').text());
			// var result = GmailService.extractData($('body').text());
			// // console.log('--------ED---------');
			// data.m_id=m_id;
			// // console.log(data);
			// callback(null,result);
			
		});
	},
	getMessageDetails:function(options,callback){
		var config=_.cloneDeep(sails.config.gmail);
		config.token = options.email_token;
		// console.log('\n\nconfig');
		// console.log(config);
		var auth  = authorize(config);
		var m_id=options.message_id;
		// console.log("\n\n\n====== m_id="+m_id);
		// console.log(options);
		const gmail = google.gmail({version: 'v1', auth});
		gmail.users.messages.get({
			userId: 'me',
			id:m_id
		}, (err, res) => {
			// console.log('before throwing error');
			// if (err) return console.log('The API returned an error: ' + err);
			if (err) throw err;
			// const messages = res.data.messages;
			// console.log(res.data);
			// console.log(res.data.payload.parts);
			var body;
			if(res.data.payload.body.size!=0)
				body=res.data.payload.body.data;
			else{ // these are emails containing attachments
				res.data.payload.parts.forEach(function(part){
					if(part.mimeType=='text/html'){
						body=part.body.data;
					}else if(part.mimeType=='text/plain'){
						body=part.body.data;
					}else if(part.mimeType=='multipart/related'){ // the case with paytm emails
						body=part.parts[0].body.data;
					}
				})
			}
			var b = atob(body.replace(/-/g, '+').replace(/_/g, '/') ); 
			// console.log(b);
			const cheerio = require('cheerio')
			const $ = cheerio.load(b);
			var result={
				body:$('body').text(),
				header:{
					date:_.find(res.data.payload.headers,{'name':'Date'}).value,
				}
			}
			callback(null,result);
			// console.log($('body').text());
			// var result = GmailService.extractData($('body').text());
			// // console.log('--------ED---------');
			// data.m_id=m_id;
			// // console.log(data);
			// callback(null,result);
			
		});
	},
	/**
	 * Extract data from email body
	 * Try different body parsers
	 * For each body parser, check if all required fields are extracted. try different body parser
	 * If no body parser works, alert that no body parse gave full info
	 * latest body parser is the one on the top.
	 * [extractDataFromMessage description]
	 * @param  {[type]}   options  [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	extractDataFromMessageBody:function(options,callback){
		var extract_config = require('../filters/'+options.email_type+'.js');
		
		var body_parsers=extract_config.body_parsers;
		var ed={};
		var body_parser_used=''
		for(var i = 0;i<body_parsers.length;i++){
			// console.log(i);
			ed={};
			var all_good_flag=true;

			body_parsers[i].fields.forEach(function(field){
				ed[field.name]=GmailService.extractOneField(field,options.body);
				if(typeof ed[field.name]=='number' && ed[field.name]==0)
					all_good_flag=true;
				else if(!ed[field.name])
					all_good_flag=false;
			});
			// console.log(ed);
			// console.log(all_good_flag);
			if(all_good_flag){ // if all data is fine, break out.
				body_parser_used=body_parsers[i].version;
				break;
			} 
		}
		// console.log('\n\n\n\ndid this run');
		// console.log(body_parser_used);
		callback(null,{
			ed:ed,
			body_parser_used:body_parser_used,
		});
		
	},
	// given a body parser, the details are extracted
	extractDataFromMessageBodyUsingBodyParser:function(options,callback){
		var extract_config = require('../filters/'+options.email_type+'.js');
		var body_parser=options.body_parser;
		var ed={};
		var body_parser_used='';
		var all_good_flag=true;
		console.log('\n\n\n--------');
		console.log(body_parser);
		body_parser.fields.forEach(function(field){
			ed[field.name]=GmailService.extractOneField(field,options.body);
			if(typeof ed[field.name]=='number' && ed[field.name]==0)
				all_good_flag=true;
			else if(!ed[field.name])
				all_good_flag=false;
		});
		if(all_good_flag)
			body_parser_used=body_parser.version;
		
		// console.log('\n\n\n\ndid this run');
		// console.log(body_parser_used);
		callback(null,{
			ed:ed,
			body_parser_used:body_parser_used,
		});
		
	},

	/**
	 * Extract data from email body
	 * Try different body parsers
	 * For each body parser, check if all required fields are extracted. try different body parser
	 * If no body parser works, alert that no body parse gave full info
	 * latest body parser is the one on the top.
	 * @param  {[type]} body [description]
	 * @return {[type]}      [description]
	 */
	extractData : function (body){

		var extract_config = require('../filters/IciciCreditCardTransactionAlertFilter.js');
		var ed={};
		extract_config.fields.forEach(function(field){
			ed[field.name]=GmailService.extractOneField(field,body);
		});
		return ed;
	},
	extractOneField:function(field,body){
		var filters=field.filters;
		// console.log(typeof filters)
		// console.log(filters)
		filters.forEach(function(f){
			if(f.type == 'find_start_position'){
				var end = body.length;
				if(f.criteria=='text_match_after')
					var start = body.indexOf(f.q)+f.q.length;
				else if(f.criteria=='text_match_before')
					var start = body.indexOf(f.q);
				body=body.substring(start,end);
			}
			else if(f.type == 'find_end_position'){
				var start = 0;
				if(f.criteria=='text_match_after')
					var end = body.indexOf(f.q)+f.q.length;
				else if(f.criteria=='text_match_before')
					var end = body.indexOf(f.q);
				body=body.substring(start,end);
			}else if(f.type=='trim'){
				body=body.trim(body);
			} else if(f.type=='replace'){
				var temp = body.split(f.options.replace);
				body=temp.join(f.options.with);
			} else if(f.type=='substring'){
				var start = f.options.start?f.options.start:0;
				var end = f.options.end?f.options.end:body.length;
				body=body.substring(start,end);
			} else if(f.type=='is'){
				body=f.value;
			}
			// console.log('\n\n\n\n*********');
			// console.log(start);
			// console.log(end);
		})
		var output;
		if(field.type=='float')
			output = parseFloat(body);
		else if(field.type=='integer')
			output = parseInt(body);
		else 
			output = body.replace(/  +/g, ' '); // replaces multiple spaces. ref - https://stackoverflow.com/questions/1981349/regex-to-replace-multiple-spaces-with-a-single-space
			// output = body.replace(/\s\s+/g, ' '); replaces multiple spaces tabs and new lines
		return output;
	},
	/**
	 * Gets 30 messages from gmail and processes each of those
	 * @param  {[type]}   options  [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	getMessagesAndProcessEach:function(options,outer_callback){
		async.auto({
			getEmail:function(callback){
				Email.findOne({id:options.email_id}).exec(function(err,email){
					callback(err,email);
				});
			},
			getMessages:['getEmail',function (results,callback) {
				var extract_config= require('../filters/'+options.email_type+'.js');
				var o={
					q:extract_config.gmail_filter,
					pageToken:options.pageToken?options.pageToken:null,
					email_token:results.getEmail.token,
				}
				GmailService.getMessages(o,callback);
			}],
			processEachMessage: ['getMessages', function (results, callback) {
				console.log('inside processEachMessage');
				var count=0;
				var email_address = results.getEmail.email;		
				var user = results.getEmail.user;
				var email = results.getEmail;
				async.eachLimit(results.getMessages.messages,1,function(m,next){
					console.log("\n\n\n====== m_id="+m.id);
					console.log(count);
					count++;
					async.auto({
						getMessageDetails:function(callback){
							// console.log('getMessageDetails');
							var opts={
								message_id:m.id,
								email_token:email.token,
							}
							GmailService.getMessageDetails(opts,callback);
						},
						extractDataFromMessageBody:['getMessageDetails',function(results,callback){
							// console.log('extractDataFromMessageBody');
							var opts={
								email_type:options.email_type,
								body:results.getMessageDetails.body
							}
							GmailService.extractDataFromMessageBody(opts,callback);
						}],
						findOrCreateEmail:['extractDataFromMessageBody',function(results,callback){
							// console.log('findOrCreateEmail');
							// console.log(results.extractDataFromMessageBody);
							var email={
								extracted_data:results.extractDataFromMessageBody.ed,
								user:user,
								type:options.email_type,
								body_parser_used:results.extractDataFromMessageBody.body_parser_used,
								email:email_address,
								message_id:m.id
							}
							email.extracted_data.email_received_time= new Date(results.getMessageDetails.header.date);
							if(email.body_parser_used==''){
								// console.log('parser failed');
								var text="Parsing email failure\n";
								text+="<-Email body->\n";
								text+=results.getMessageDetails.body.trim();
								text+=" ```"+JSON.stringify(email,null,4)+"```";
								var content = {
									"icon_emoji": ":robot_face:",
									"username": "highlyreco-bot",
									"text":text,
								}
								Parse_failure.findOne({message_id:m.id}).exec(function(err,pf){
									if(err)
										return callback(err);
									if(!pf){
										console.log('\n\n\nbody parser is null');
										console.log(email);
										console.log(results.getMessageDetails.body);
										Parse_failure.create(email).exec(function(err,pf_new){
											SlackService.pushToSlack('cashflowy',content,callback);	
										});		
									}else{
										callback(err);
									}
								});
							}else{		
								// console.log('parser success');
								Parsed_email.findOrCreate({message_id:m.id},email).exec(callback);
							}
							// during testing a new filter, comment/uncomment the following lines
							// console.log(email);
							// callback(null);
							// Parsed_email.findOrCreate({message_id:m.id},email).exec(function(err,result){
							// 	callback('manual error');
							// });
						}]
					},next)


				},callback)
				// results.getMessages.forEach()
			}]
		}, outer_callback)
	}
}