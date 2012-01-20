var
https = require('https'),
querystring = require('querystring');

module.exports.flattrs = new Flattrs();

// Flattr HTTPS URIs
//
var
options = {
	host: 'api.flattr.com',
	endpoint: '/rest/v2',
	oauth2_auth: 'flattr.com/oauth/authorize',
	oauth2_token: 'flattr.com/oauth/token'
},
o = options;

// http://developers.flattr.net/api/resources/flattrs/
function Flattrs () {

	var self = this;

	// List a users flattrs
	//
	// Parameters
	// user - user name
	// count ( Optional ) - Number of records to receive
	// page ( Optional ) - Page of results to retreive
	// callback - callback function
	//
	self.list = function () {

		var
		user  = arguments[0],
		count = (typeof arguments[1] === 'number') ? arguments[1] : '',
		page  = (typeof arguments[2] === 'number') ? arguments[2] : '',
		callback = arguments[arguments.length-1];
				
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/users/'+user+'/flattrs/?count='+count+'&page='+page,
			method: 'GET'
		};

		make_request(httpsopts, function (data, headers) {
			callback(data, headers)
		});
	};

	// List the authenticated users flattrs
	//
	// Arguments
	// count ( Optional ) - Number of records to receive 
	// page ( Optional ) - Page of results to retreive 
	// callback - callback function
	//
	self.list_auth = function () {

		var
		count = (typeof arguments[0] === 'number') ? arguments[0] : '',
		page  = (typeof arguments[1] === 'number') ? arguments[1] : '',
		callback = arguments[arguments.length-1];

		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/user/flattrs/?count='+count+'&page='+page,
			method: 'GET'
		};

		make_request(httpsopts, function (data, headers) {
			callback(data, headers)
		});
	};
}

function make_request (httpsopts, callback) {
	var req = https.request(httpsopts, function (res) {
		var data = '';

		res.setEncoding('utf-8');

		res.on('data', function (buffer) {
			data += buffer;
		});

		res.on('end', function () {
			callback(JSON.parse(data), res.headers);
		});
	});

	req.on('error', function (e) {
		console.log(err);
	});

	req.end();
}
