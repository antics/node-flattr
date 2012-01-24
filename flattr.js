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
	self.list = function (user) {

		// Params
		var
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

	// Flattr a thing
	//
	// Arguments
	// id - id of thing to flattr
	// callback - callback function
	//
	self.thing = function (id, callback) {
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things/'+id+'/flattr',
			method: 'POST'
		};

		make_request(httpsopts, function (data, headers) {
			callback(data, headers)
		});
		
	}

	// Flattr an URL
	//
	// Arguments
	// url - URL of th thing
	// user - flattr user name
	// params (optional) -  Parameters, see below
	// callback - callback function
	//
	// Optional parameters
	// title (Optional) - Title of your your thing.
	// description (Optional) - Description for your thing.
	// language (Optional) - Language of your page, use one of the available languages.
	// tags (Optional) - Tags you want your post to be tagged with. Multiple tags are separated with ,
	// hidden (Optional) - If you want to hide the things from public listings on flattr.com set hidden to 1.
	// category (Optional) - Category from the list of categories found here.
	//	
	self.url = function (url, user) {

		var query_str = '';
		
		// arguments[2] == Optional parameters
		if (typeof arguments[2] === 'object') {
			var params = arguments[2];
			
			for (key in params)
				query_str += '&'+key+'='+params[key];
		}

		if (arguments.length > 2)
			var callback = arguments[arguments.length-1];

		var
		httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/flattr',
			method: 'POST',
		},
		data = {
			"url": 'http://flattr.com/submit/auto?user_id='+user+'&url='+
				encodeURIComponent(/^(http|https):\/\//.test(url) ? url : 'http://'+url)+query_str
		};
		
		make_request(httpsopts, data, function (data, headers) {
			callback(data, headers)
		});
		
	}
}

// Https request helper function
//
// Arguments
// httpsopts - options for the https request
// reqdata (optional) - data to be sent to server
// callback - callback function
//
function make_request (httpsopts) {

	var
	reqdata  = (typeof arguments[1] === 'object') ? JSON.stringify(arguments[1]) : '',
	callback = arguments[arguments.length-1];

	httpsopts.headers = {
		"Content-Length": reqdata.length,
		"Content-Type": 'application/json'
	};
	
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

	req.end(reqdata);
}
