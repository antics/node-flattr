var flattrs = require('../flattr').flattrs;
var things = require('../flattr').things;


/*
flattrs.list('Jerec', 3, 1, function (data, headers) {
	console.log(data, headers);
});
*/

/*
flattrs.list_auth('', '', function (data, headers) {
	console.log(data, headers);
});
*/

/* TODO: Test when authenticated
flattrs.thing(313733, function (data) {
	console.log(data);
});
*/

// TODO: Test when authenticated
flattrs.url('http://inventoria.se', 'user', function (data) {
	console.log(data);
});


/*
things.list('Jerec', function (data, headers) {
	console.log(data, headers);
});
*/

/*
things.list_auth(function (data, headers) {
	console.log(data, headers);
});
*/

/*
things.get(423405, function (data, head) {
	console.log(data, head);
});

*/