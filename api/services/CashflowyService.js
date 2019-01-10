var async=require('async');
const fx = require('money');
fx.base='INR';
fx.rates=sails.config.fx_rates;

var convertSliToTransaction = function(sli){
	var t={
		original_currency:sli.data.currency,
		createdBy:'parsed_document',
		type:'income_expense',
		account:sli.data.acc_no,
		third_party:sli.data.paid_whom,
	}

	if(sli.details.type=='icici_bank' && sli.details.parser_used=='sebtifdmvape'){
		sli.data.credit=sli.data.credit.replace(',','');
		sli.data.credit=sli.data.credit.replace(',','');
		sli.data.credit=sli.data.credit.replace(',','');
		sli.data.debit=sli.data.debit.replace(',','');
		sli.data.debit=sli.data.debit.replace(',','');
		sli.data.debit=sli.data.debit.replace(',','');
		if(!isNaN(parseFloat(sli.data.credit))) // is credit a number
			t.original_amount=parseFloat(sli.data.credit);
		else if(!isNaN(parseFloat(sli.data.debit)))
			t.original_amount=-parseFloat(sli.data.debit);
	}else if(sli.details.type=='hdfc_credit_card' && sli.details.parser_used=='bzqxicqhpsrk'){
	// }else{
		sli.data.amount=sli.data.amount.replace(',','');
		sli.data.amount=sli.data.amount.replace(',','');
		sli.data.amount=sli.data.amount.replace(',','');
		if(sli.data.dr_cr=='Cr') // amount is creditted
			t.original_amount=parseFloat(sli.data.amount);
		else if(sli.data.dr_cr=='Dr')
			t.original_amount=-parseFloat(sli.data.amount);
		t.third_party=sli.data.details;
	}

	// t.amount_inr=t.original_amount;
	if(t.original_amount)
		t.amount_inr=fx.convert(t.original_amount, {from: sli.data.currency, to: "INR"});
	
	if(sli.data.date){
		var temp_date=sli.data.date.split('-').reverse().join('-');
		t.occuredAt = new Date(temp_date+' 12:00:00.000 +5:30'); 
	}
	return t;
}

var findSimilarTransactions = function(t,callback){
	// console.log('this is the thing that is done');
	var escape=[];
	var query = 'select * from transaction';
	query+=' where';
	query+=` (("original_amount">${t.original_amount-10} AND "original_amount"<${t.original_amount+10}) `;
	query+=` OR ("original_amount">${-t.original_amount-10} AND "original_amount"<${-t.original_amount+10})) `;
	var temp = new Date(t.occuredAt);
	var from = new Date(temp.setDate(t.occuredAt.getDate()-2)).toISOString();
	var to = new Date(temp.setDate(t.occuredAt.getDate()+2)).toISOString();
	query+=` AND "occuredAt">'${from}' AND "occuredAt"<'${to}'`;
	
	// query+=` AND account ='${results.getSnapshot.account}'`;
	query+=' ORDER BY "occuredAt" DESC';
	query+=' LIMIT 100';
	// console.log('\n\n\n\n '+query);
	// callback(null);
	Transaction.query(query,escape,function(err, rawResult) {
		// console.log('\n\n\n\n');
		// console.log(results.getSnapshot);
		// console.log('\n\n\n\n')
		// console.log(rawResult.rows[0])
		// var prev_snap = rawResult.rows[0];
		if(err)
			callback(err);
		else
			return callback(err,rawResult.rows);
			// if(!rawResult.rows.length)
			// 	return callback('no similar transactions');
			// else
	});
}

var identifyExistingTransaction=function(options){
	similar_transactions=options.similar_transactions;
	new_t=options.new_t;
	if(similar_transactions.length==0)
		return null;
	var existing_t=null;
	similar_transactions.forEach(function(st){
		// expense can be
		// - expense
		// - tranfer 
		// income can be
		// - income
		// - transfer
		// Dates can be off by 48hrs both sides
		// Original amount can have a margin both sidespo
		// date band is already checked. 
		
		// Cases
		// 1 new_t is an expense, existing transaction is also an expense
		// 2 new_t is an expense, existing transaction is a transafer
		// 3 new_t is an income, existing transaction is also an income
		// 4 new_t is an income, existing transaction is a transfer

		// handling case 1 and 3
		if(new_t.account==st.account && new_t.type==st.type)
			existing_t=st;
	})
	return existing_t;
}

module.exports={
	internal:{
		convertSliToTransaction:convertSliToTransaction,
		findSimilarTransactions:findSimilarTransactions,
		identifyExistingTransaction:identifyExistingTransaction,
	},
	afterCreate_SLI:function(sli,callback){
		// check if transaction exists, 
		// if not create a transaction and link it to the sli
		// sli.type='ICICIBankStatement';
		// sli.type='hdfc_creditcard_statement';
		// sli.body_parser_used='sebtifdmvape';
		// sli.body_parser_used='bzqxicqhpsrk';
		// sli.data=_.cloneDeep(sli.extracted_data); // temp - should be removed
		// sli.data.currency?sli.data.currency:'INR';
		if(!sli.data.currency)
			sli.data.currency='INR'
		console.log('\n\n\n ------------');
		var t = convertSliToTransaction(sli);
		console.log(t);
		// callback('error');
		async.auto({
			getAccount:function(callback){
				var filter = {
					like:{
						acc_number:'%'+t.account, // ends with the following number
					},
					user:sli.user
				}
				var account={ // incase the account does not exist, create account.
					acc_number:''+t.account,
					user:sli.user,
					type:'bank', // user might need to change this
					name:'Auto generated account'+t.account,
				} 
				Account.findOne(filter).exec(function(err,result){
					if(result)
						callback(err,result);
					else{
						Account.create(account).exec(function(err,result){
							callback(err,result);
						});
					}
				});
				
			},
			findSimilarTransactions:function(callback){
				findSimilarTransactions(t,callback);
			},
			createTransactionIfNew:['getAccount','findSimilarTransactions',function(results,callback){
				sli.transaction=null;
				t.account=results.getAccount.id;
				if(t.original_amount){
					var existing_t = null;
					if(results.findSimilarTransactions.length!=0){
						existing_t=identifyExistingTransaction({similar_transactions:results.findSimilarTransactions,new_t:t});
					}
					if(!existing_t){
						Transaction.create(t).exec(function(err,transaction){
							console.log(err);
							// sli.transaction=transaction.id;
							callback(err,transaction);
						});
					}else{
						callback(null);
					}
				}
			}],
			updateSli:['createTransactionIfNew',function(results,callback){
				var existing_t = identifyExistingTransaction({similar_transactions:results.findSimilarTransactions,new_t:t});
				if(existing_t)
					sli.transaction=existing_t.id;
				else
					sli.transaction=results.createTransactionIfNew.id;
				Statement_line_item.update({id:sli.id},{transaction:sli.transaction}).exec(callback);
			}]
		},function(err,results){
			if(err){
				console.log('\n\n\n_____________');
				console.log('we got error');
				console.log(err);
			}else
				callback();
		})
	},
}