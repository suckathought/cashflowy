module.exports.filters = {
	active: [
		'IciciCreditCardTransactionAlertFilter',
		'IciciInternetBankingFilter',
		'IciciDebitCardFilter', // atm and debit card transactions
		'IciciCreditCardRefundFilter',
		'HdfcUpiFilter',
		'HdfcNetBankingFilter',
		'CitibankCreditCardTransactionFilter',
		'AmazonPayTransactionFilter',
		'AmazonPayCashbackFilter',
		'AmazonPayExternalFilter',
		'HdfcBankBalanceFilter', //periodic balance alert from bank
		'ZerodhaTransferFilter',
		'HdfcBankAccountCreditFilter',
		'YesBankCreditCardTransactionFilter',
		'SBIDebitCardFilter',
		'SBIOnlineTransactionFilter',
		'SBIToSBIFilter',
		'SBIRtgsFilter',
		'SBINeftFilter',
		'PaytmFilter',
	]
}