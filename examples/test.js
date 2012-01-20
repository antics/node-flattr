var flattrs = require('../flattr').flattrs;


flattrs.list('Jerec', 3, 1, function (data, headers) {
	console.log(data, headers);
});

/*
flattrs.list_auth('', '', function (data, headers) {
	console.log(data, headers);
});
*/
