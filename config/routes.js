/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /': 'MainController.landingPage',
  'GET /dashboard': 'MainController.landingPage',
  'GET /org/:o_id/dashboard':'MainController.dashboard',
  'GET /debug':'MainController.debug',
  
  'GET /org/:o_id/emails':'MainController.listEmails',
  'GET /org/:o_id/email/create':'MainController.createEmail',
  'POST /org/:o_id/email/create':'MainController.createEmail',
  'GET /org/:o_id/email/:id/edit':'MainController.editEmail',
  'POST /org/:o_id/email/:id/edit':'MainController.editEmail',
  'GET /org/:o_id/email/:id':'MainController.viewEmail',

  'POST /org/:o_id/parse_failure/:id/retry': 'MainController.retryParseFailure',
  
  'GET /org/:o_id/accounts':'MainController.listAccounts',
  'GET /org/:o_id/account/create':'MainController.createAccount',
  'POST /org/:o_id/account/create':'MainController.createAccount',
  'GET /org/:o_id/account/:id':'MainController.viewAccount',
  'GET /org/:o_id/account/:id/edit':'MainController.editAccount',
  'POST /org/:o_id/account/:id/edit':'MainController.editAccount',
  // 'GET /account/:id/delete':'MainController.deleteAccount',
  // 'POST /account/:id/delete':'MainController.deleteAccount',

  
  'GET /org/:o_id/transactions':'MainController.listTransactions',
  'GET /org/:o_id/transaction/create':'MainController.createTransaction',
  'POST /org/:o_id/transaction/create':'MainController.createTransaction',
  'GET /org/:o_id/transaction/:id/edit':'MainController.editTransaction',
  'POST /org/:o_id/transaction/:id/edit':'MainController.editTransaction',
  'PUT /org/:o_id/tli/:id':'MainController.updateTli',
  'GET /org/:o_id/transaction/:id/delete':'MainController.deleteTransaction',
  'POST /org/:o_id/transaction/:id/delete':'MainController.deleteTransaction',


  'GET /org/:o_id/invoices': 'MainController.listInvoices',
  'GET /org/:o_id/invoice/create': 'MainController.createInvoice',
  'POST /org/:o_id/invoice/create': 'MainController.createInvoice',
  'GET /org/:o_id/invoice/:i_id/edit': 'MainController.editInvoice',
  'POST /org/:o_id/invoice/:i_id/edit': 'MainController.editInvoice',
  'GET /org/:o_id/invoice/:i_id/delete': 'MainController.deleteInvoice',
  'POST /org/:o_id/invoice/:i_id/delete': 'MainController.deleteInvoice',



  'GET /org/:o_id/snapshots':'MainController.listSnapshots',
  'GET /org/:o_id/snapshot/create':'MainController.createSnapshot',
  'POST /org/:o_id/snapshot/create':'MainController.createSnapshot',
  'GET /org/:o_id/snapshot/:id/edit':'MainController.editSnapshot',
  'POST /org/:o_id/snapshot/:id/edit':'MainController.editSnapshot',
  'GET /org/:o_id/snapshot/:id/delete':'MainController.deleteSnapshot',
  'POST /org/:o_id/snapshot/:id/delete':'MainController.deleteSnapshot',

  'GET /org/:o_id/categories':'MainController.listCategories',
  'GET /org/:o_id/category/create':'MainController.createCategory',
  'POST /org/:o_id/category/create':'MainController.createCategory',
  'GET /org/:o_id/category/:id':'MainController.viewCategory',
  'GET /org/:o_id/category/:id/edit':'MainController.editCategory',
  'POST /org/:o_id/category/:id/edit':'MainController.editCategory',
  'GET /org/:o_id/category/:id/delete':'MainController.deleteCategory',
  'POST /org/:o_id/category/:id/delete':'MainController.deleteCategory',

  'GET /org/:o_id/tags':'MainController.listTags',
  'GET /org/:o_id/tag/create':'MainController.createTag',
  'POST /org/:o_id/tag/create':'MainController.createTag',
  'GET /org/:o_id/tag/:id':'MainController.viewTag',
  'GET /org/:o_id/tag/:id/edit':'MainController.editTag',
  'POST /org/:o_id/tag/:id/edit':'MainController.editTag',


  'GET /org/:o_id/rules':'MainController.listRules',
  'GET /org/:o_id/rule/create':'MainController.createRule',
  'GET /org/:o_id/rule/:id':'MainController.viewRule',
  'GET /org/:o_id/rule/:id/edit':'MainController.editRule',
  'POST /org/:o_id/rule/:id/edit':'MainController.editRule',
  'GET /org/:o_id/rule/:id/delete':'MainController.deleteRule',
  'POST /org/:o_id/rule/:id/delete':'MainController.deleteRule',

  'GET /org/:o_id/documents':'MainController.listDocuments',
  'GET /org/:o_id/document/create':'MainController.createDocument',
  'POST /org/:o_id/document/create':'MainController.createDocument',
  'GET /org/:o_id/document/:id':'MainController.viewDocument',
  'GET /org/:o_id/document/:id/edit':'MainController.editDocument',
  'POST /org/:o_id/document/:id/edit':'MainController.editDocument',
  'GET /org/:o_id/document/:id/delete':'MainController.deleteDocument',
  'POST /org/:o_id/document/:id/delete':'MainController.deleteDocument',
  

  'GET /org/:o_id/pnls':'MainController.listPnLs',
  'GET /org/:o_id/pnl/create':'MainController.createPnL',
  'POST /org/:o_id/pnl/create':'MainController.createPnL',
  'GET /org/:o_id/pnl/:id':'MainController.indexPnL',
  'GET /org/:o_id/pnl/:id/view':'MainController.viewPnL',
  'GET /org/:o_id/pnl/:id/edit':'MainController.editPnL',
  'POST /org/:o_id/pnl/:id/edit':'MainController.editPnL',
  'GET /org/:o_id/pnl/:id/delete':'MainController.deletePnL',
  'POST /org/:o_id/pnl/:id/delete':'MainController.deletePnL',
  'GET /org/:o_id/view_sample_pnl':'MainController.viewSamplePnL',


  'GET /org/:o_id/balance_sheets': 'MainController.listBalanceSheets',
  'GET /org/:o_id/balance_sheet/create': 'MainController.createBalanceSheet',
  'POST /org/:o_id/balance_sheet/create': 'MainController.createBalanceSheet',
  'GET /org/:o_id/balance_sheet/:id': 'MainController.viewBalanceSheet',
  'GET /org/:o_id/balance_sheet/:id/edit': 'MainController.editBalanceSheet',
  'POST /org/:o_id/balance_sheet/:id/edit': 'MainController.editBalanceSheet',
  'GET /org/:o_id/balance_sheet/:id/delete': 'MainController.deleteBalanceSheet',
  'POST /org/:o_id/balance_sheet/:id/delete': 'MainController.deleteBalanceSheet',


  'GET /orgs': 'MainController.listOrgs',
  'GET /org/create': 'MainController.createOrg',
  'POST /org/create': 'MainController.createOrg',
  'GET /org/:o_id': 'MainController.viewOrg',
  'GET /org/:o_id/edit': 'MainController.editOrg',
  'POST /org/:o_id/edit': 'MainController.editOrg',
  'GET /org/:o_id/delete': 'MainController.deleteOrg',
  'POST /org/:o_id/delete': 'MainController.deleteOrg',
  
  'GET /org/:o_id/members': 'MainController.listMembers',
  'GET /org/:o_id/member/create': 'MainController.createMember',
  'POST /org/:o_id/member/create': 'MainController.createMember',
  'GET /org/:o_id/member/:id': 'MainController.viewMember',
  'GET /org/:o_id/member/:id/edit': 'MainController.editMember',
  'POST /org/:o_id/member/:id/edit': 'MainController.editMember',
  'GET /org/:o_id/member/:id/delete': 'MainController.deleteMember',
  'POST /org/:o_id/member/:id/delete': 'MainController.deleteMember',


  'GET /org/:o_id/dt/:id':'MainController.viewDoubtfulTransaction',
  'POST /org/:o_id/dt/:id/mark_as_unique':'MainController.markDTAsUnique', // api
  'POST /org/:o_id/dt/:id/mark_as_duplicate_of/:orig_txn_id':'MainController.markDTAsDuplicate', // api


  'GET /org/:o_id/rules':'MainController.listRules',
  // 'GET /rule/:id':'MainController.viewRule',
  'POST /org/:o_id/rule/create':'MainController.createRule',
  'GET /org/:o_id/rule/:id/edit':'MainController.editRule',
  'POST /org/:o_id/rule/:id/edit':'MainController.editRule',
  'GET /org/:o_id/rule/:id/delete':'MainController.deleteRule',
  'POST /org/:o_id/rule/:id/delete':'MainController.deleteRule',
  
  
  '/test':'MainController.test',

  // api patterns needs rewrite later
  'POST /org/:o_id/api/edit_desc':'MainController.editDescription',
  'POST /org/:o_id/api/edit_tags':'MainController.editTags',

  'GET /email_test':'MainController.emailTest',
  'GET /uam_test':'MainController.testUAM',

  'GET /login': 'AuthController.login',
  'POST /login': 'AuthController.login',
  'GET /signup': 'AuthController.signup',
  'POST /signup': 'AuthController.signup',
  'GET /logout': 'AuthController.logout',
  'GET /forgot': 'AuthController.view_forgot',
  'POST /forgot': 'AuthController.forgot',
  'GET /reset': 'AuthController.view_reset',
  'POST /reset': 'AuthController.reset',


  'GET /background/deepCrawl':'Background.deepCrawl',
  'POST /background/surface_crawl':'Background.surfaceCrawl',
  'GET /background/test':'Background.test',
  'POST /background/send_weekly_emails':'Background.sendWeeklyEmails',
  'POST /background/send_monthly_emails':'Background.sendMonthlyEmails',
  'POST /background/calculate_uam':'Background.calculateUAM',
  'POST /background/delete_tasks':'Background.deleteTasks',

  'GET /bull':'BullController.index',
  'GET /bull/restartQueueConnection':'BullController.restartQueueConnection',
  'GET /bull/:state':'BullController.listItems',
  'POST /bull/retry':'BullController.retryJob',
  'POST /bull/delete':'BullController.deleteJob',
	'POST /bull/repeat/delete':'BullController.deleteRepeatJob',

  'GET /testBull':'MainController.testBull',



  'GET /curator/filter_test':'CuratorController.filterTest',
  'POST /curator/filter_test':'CuratorController.filterTest',

  //webhooks

  'POST /webhook/docparser':'WebhookController.docparser',
  'POST /webhook/mailgun-inbound-parser': 'WebhookController.mailgunInboudParser',


  'GET /privacy': { view: 'privacy' },
  'GET /terms':{view:'terms'}
  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
