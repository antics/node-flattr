var
https = require('https'),
querystring = require('querystring');

// Flattr HTTPS URIs
//
var
options = {
	host: 'api.flattr.com',
	endpoint: '/rest/v2'
},
o = options;

module.exports.flattrs = new Flattrs();
module.exports.things = new Things();
module.exports.users = new Users();

// Requst an access token for authorized requests
//
// app - object containing application data
//    client_id
//    client_secret
//    redirect_uri
// code - string in ?code=
// callback - callback function
//
exports.request_token = function (app, code, callback) {
	var
	basic_auth = new Buffer(app.client_id+':'+app.client_secret).toString('base64'),

	httpsopts = {
		hostname: 'flattr.com',
		path: '/oauth/token',
		method: 'POST',
		headers: {
			"Authorization": 'Basic '+basic_auth,			
		}
	},

	reqdata = {
		"code": code,
		"grant_type": "authorization_code",
		"redirect_uri": checkurl(app.redirect_uri)
	};

	make_request(httpsopts, reqdata, function (data) {
		callback(data.access_token);
	});
};

// http://developers.flattr.net/api/resources/flattrs/
function Flattrs () {
	
	var self = this;

	// List a users flattrs
	//
	// user - user name
	// params (optional) - param object:
	//     count - Number of records to receive
	//     page  - Page of results to retreive
	// callback - callback function
	//
	self.list = function (user, params, callback) {

		var count = '', page = '';

		if (typeof params == 'object') {
			count = params.count;
			page  = params.page;
		}
		else if (typeof params == 'function')
			callback = params;

		var httpsopts = {
			hostname: o.host,
			path: o.endpoint +'/users/'+user+'/flattrs?count='+count+'&page='+page,
			method: 'GET'
		};
		
		make_request(httpsopts, function (data) {
			callback(data);
		});
	};

	// List the authenticated users flattrs
	//
	// token - access token
	// params (optional) - param object:
	//     count - Number of records to receive
	//     page  - Page of results to retreive
	// callback - callback function
	//
	self.list_auth = function (token, params, callback) {

		var count = '', page = '';

		if (typeof params == 'object') {
			count = params.count;
			page  = params.page;
		}
		else if (typeof params == 'function')
			callback = params;
		
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/user/flattrs?count='+count+'&page='+page,
			method: 'GET',
			headers: {
				"Authorization": "Bearer "+token
			}
		};

		make_request(httpsopts, function (data) {
			callback(data);
		});
	};

	// Flattr a thing
	//
	// token - access token
	// id - id of thing to flattr
	// callback (optional)  - callback function
	//
	self.thing = function (token, id, callback) {
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things/'+id+'/flattr',
			method: 'POST',
			headers: {
				"Authorization": "Bearer "+token
			}
		};

		make_request(httpsopts, {}, function (data) {
			callback(data);
		});
	};

	// Flattr an URL
	// Params is also available if you auto-submit an url.
	//
	// token - access token
	// url - URL of the thing
	// params (optional) -  
	//     title - Title of your your thing.
	//     description -  Description for your thing.
	//     language - Language of your page, use one of the available
	//         languages.
	//     tags - Tags you want your post to be tagged with. Multiple
	//         tags are separated with ,
	//     hidden - If you want to hide the things from public listings
	//         on flattr.com set hidden to 1.
	//     category - Category from the list of categories found here.
	//
	// callback - callback function
	//
	self.url = function (token, url, params, callback) {

		var query_str = '';
		
		if (typeof params == 'object') {
			for (key in params)
				query_str += '&'+key+'='+params[key];
		}
		else if (typeof params == 'function')
			callback = params;

		var
		httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/flattr',
			method: 'POST',
			headers: {
				"Authorization": "Bearer "+token
			}
		},

		data = {
			"url": 'http://flattr.com/submit/auto?url='+
				encodeURIComponent(checkurl(url))+query_str
		};
		
		make_request(httpsopts, data, function (resp) {
			callback(resp);
		});
	}
}

function Things () {
	
	var self = this;

	// List a users things
	//
	// Parameters
	// user - user name
	// count ( Optional ) - Number of records to receive
	// page ( Optional ) - Page of results to retreive
	// callback - callback function
	//
	self.list = function (user) {

		var
		count = (typeof arguments[1] === 'number') ? arguments[1] : '',
		page  = (typeof arguments[2] === 'number') ? arguments[2] : '',
		callback = arguments[arguments.length-1];
				
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/users/'+user+'/things/?count='+count+'&page='+page,
			method: 'GET'
		};

		make_request(httpsopts, function (data, headers) {
			callback(data, headers)
		});
	};

	// List the authenticated users things
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
			path: o.endpoint+'/user/things/?count='+count+'&page='+page,
			method: 'GET'
		};

		make_request(httpsopts, function (data, headers) {
			callback(data, headers)
		});
	};

	// Get a thing
	//
	// Arguments
	// id - id of thing
	// callback - callback function
	//
	self.get = function (id, callback) {
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things/'+id,
			method: 'GET'
		};

		make_request(httpsopts, function (data, headers) {
			callback(data, headers)
		});
	};

	// Check if a thing exists
	//
	// Arguments
	// url - The url to lookup
	// callback - callback function
	//
	self.exists = function (url, callback) {
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things/lookup/?url='+
				encodeURIComponent(checkurl(url)),
			method: 'GET'
		};

		make_request(httpsopts, function (data, headers) {
			callback(data, headers)
		});
	};

	// Create a thing
	//
	// Arguments
	// url - String url to submit
	// token - access_token
	// params - Optional parameters, see below
	// callback - callback function
	//
	// Parameters:
	// title ( Optional ) - string Title of the new thing.
	// description ( Optional ) - string Description text of the new thing.
	// category ( Optional ) - string Default is "rest"
	// language ( Optional ) - string Default is "en_GB"
	// tags ( Optional ) - string Comma separated list of tags.
	// hidden ( Optional ) - boolean Default is "false"
	//
	self.create = function (url, token) {

		var
		params = (typeof arguments[2] === 'object') ? arguments[2] : {},
		callback = arguments[arguments.length-1];

		params["url"] = checkurl(url);

		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things',
			method: 'POST',
			headers: {
				"Authorization": "Bearer "+token
			}
		};

		make_request(httpsopts, params, function (data, headers) {
			callback(data, headers)
		});
	};

	// Update a thing
	//
	// Arguments
	// id - id of thing to update
	// params - Optional parameters, see below
	// callback - callback function
	//
	// Parameters:
	// title ( Optional ) - string Title of the new thing.
	// description ( Optional ) - string Description text of the new thing.
	// category ( Optional ) - string Default is "rest"
	// language ( Optional ) - string Default is "en_GB"
	// tags ( Optional ) - string Comma separated list of tags.
	// hidden ( Optional ) - boolean Default is "false"
	//
	self.update = function (id) {

		var
		params = (typeof arguments[1] === 'object') ? arguments[1] : {},
		callback = arguments[arguments.length-1];

		// Flattr workaround for the PATCH request. See docs.
		params['_method'] = 'patch';
		
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things/'+id,
			method: 'PATCH'
		};

		make_request(httpsopts, params, function (data, headers) {
			callback(data, headers)
		});
	};

	// Deletes a thing
	//
	// id - id of thing to delete
	// callback - callback function
	//
	self.del = function (id, callback) {
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things/'+id,
			method: 'DELETE'
		};

		make_request(httpsopts, function (data, headers) {
			callback(data, headers)
		});
	};

	// Search things
	//
	// params - object containing search params
	// callback - callback function
	//
	// Params: 
	// query (Optional) - string Free text search string
	// tags (Optional) - string Filter by tags, separate with ,
	// language (Optional) - string Filter by language
 	// category (Optional) - string Filter by category
	// user (Optional) - string Filter by username
	// page (Optional) - integer The result page to show
	// count (Optional) - integer Number of items per page
	//
 	self.search = function (params, callback) {

		var query_str = '';
		
		for (key in params)
			query_str += key+'='+params[key]+'&';

		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things/search?'+query_str,
			method: 'GET',
		};
		
		make_request(httpsopts, function (data, headers) {
			callback(data, headers)
		});		
	};
}

function Users () {
	var self = this;
	
	// Get a user
	//
	// Parameters
	// user - user name
	// callback - callback function
	//
	self.get = function (user, callback) {
		
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/users/'+user,
			method: 'GET'
		};
		
		make_request(httpsopts, function (data, headers) {
			callback(data, headers)
		});
	};

	// Get the authenticated user
	//
	// Parameters
	// token - access token
	// callback - callback function
	//
	self.get_auth = function (token, callback) {
		
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/user/',
			method: 'GET',
			headers: {
				Authorization: 'Bearer '+token
			}
		};
		
		make_request(httpsopts, function (data, headers) {
			callback(data, headers)
		});
	};
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

	if (reqdata) {

		if (!httpsopts.headers)
			httpsopts["headers"] = {};
		
		httpsopts.headers["Content-Length"] = reqdata.length;
		httpsopts.headers["Content-Type"] = 'application/json';
	}
	
	var req = https.request(httpsopts, function (res) {
		var data = '';

		res.setEncoding('utf-8');

		res.on('data', function (buffer) {
			data += buffer;
		});

		res.on('end', function () {
			try {
				data = JSON.parse(data);
				callback(data, res.headers);
			}
			catch (e) {
				console.log(data);
			}
		});
	});

	req.on('error', function (e) {
		console.log(err);
	});
	
	req.end(reqdata);
}

function checkurl (url) {
	return /^(http|https):\/\//.test(url) ? url : 'http://'+url;
}
