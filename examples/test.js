var flattrs = require('../flattr').flattrs;
var things = require('../flattr').things;


/*
flattrs.list('flattr', 3, 1, function (data, headers) {
	console.log(data, headers);
});
*/

/*
flattrs.list_auth(function (data, headers) {
	console.log(data, headers);
});
*/

/* TODO: Test when authenticated
flattrs.thing(313733, function (data) {
	console.log(data);
});
*/

// TODO: Test when authenticated
/*
flattrs.url('http://inventoria.se', 'user', function (data) {
	console.log(data);
});
*/


/*
things.list('flattr', function (data, headers) {
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

/*
things.exists('https://flattr.com/profile/naturarvet', function (data, head) {
	console.log(data, head);
});
*/

/*
things.create('http://inventoria.se', {title: 'inventoria', description: 'nice site'}, function (data, head) {
	console.log(data, head);
});
*/

/*
things.update('431547', {title: 'inventoria', description: 'nice site'}, function (data, head) {
	console.log(data, head);
});
*/

/*
things.del('431547', function (data, head) {
	console.log(data, head);
});
*/

var search = {
	query: 'flattr',
	category: 'software',
	tags: 'ruby'
}

things.search(search, function (data, head) {
	console.log(data);
});
