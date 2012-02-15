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

		if (typeof params === 'object') {
			count = params.count;
			page  = params.page;
		}
		else if (typeof params === 'function')
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

		if (typeof params === 'object') {
			count = params.count;
			page  = params.page;
		}
		else if (typeof params === 'function')
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

	//
	// TODO: Check how this one works. What happens if one submits an url
	// to flattr without the user_id param?
	//
	// Flattr an URL
	// Params is also available if you auto-submit an url.
	//
	// token - access token
	// url - URL of the thing
	// user - user owning the thing
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
	self.url = function (token, url, user, params, callback) {

		var query_str = '';
		
		if (typeof params === 'object') {
			for (key in params)
				query_str += '&'+key+'='+params[key];
		}
		else if (typeof params === 'function')
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
			"url": 'http://flattr.com/submit/auto?user_id='+user+'&url='+
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
	// params (optional) - param object:
	//     count - Number of records to retrieve
	//     page  - Page of results to retrieve
	// callback - callback function
	//
	self.list = function (user, params, callback) {

		var count = '', page = '';

		if (typeof params === 'object') {
			count = params.count;
			page = params.page;
		}
		else if (typeof params === 'function')
			callback = params;
						
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/users/'+user+'/things?count='+count+'&page='+page,
			method: 'GET'
		};

		make_request(httpsopts, function (data) {
			callback(data)
		});
	};

	// List the authenticated users things
	//
	// token - access token
	// params (optional) - param object:
	//     count - Number of records to retrieve
	//     page  - Page of results to retrieve
	// callback - callback function
	//
	self.list_auth = function (token, params, callback) {

		var count = '', page = '';

		if (typeof params === 'object') {
			count = params.count;
			page = params.page;
		}
		else if (typeof params === 'function')
			callback = params;

		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/user/things?count='+count+'&page='+page,
			method: 'GET',
			headers: {
				"Authorization": "Bearer "+token
			}
		};

		make_request(httpsopts, function (data) {
			callback(data)
		});
	};

	// Get a thing
	//
	// TODO: Getting multiple things results in an "unauthorized to access"
	// error. Are the docs wrong?
	//
	// Arguments
	// id - id of thing or array of ids
	// token - optional access token
	// callback - callback function
	//
	self.get = function (id, token, callback) {

		var ids = '';
		
		if (typeof id === 'number')
			ids = '/'+id;
		// Array:
		else {
			ids = '?id='+id;
			for (i=1; i<id.length; i++)
				ids += ','+id[i];
		}

		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things'+ids,
			method: 'GET'
		};

		if (typeof token === 'string')
			httpsopts['headers'] = { "Authorization": "Bearer "+token }
		else if (typeof token === 'function')
			callback = token;

		make_request(httpsopts, function (data) {
			callback(data)
		});
	};

	// Check if a thing exists
	//
	// url - The url to lookup
	// autosubmit - set to true to check an auto submit url
	// callback - callback function
	//
	self.exists = function (url, autosubmit, callback) {

		var query = '';
		
		if (autosubmit === true) {
			query = 'http://flattr.com/submit/auto?url='+
				encodeURIComponent(checkurl(url));
		}
		else if (typeof autosubmit === 'function') {
			query = checkurl(url);
			callback = autosubmit;
		}
		
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things/lookup?url='+query,
			method: 'GET'
		};

		make_request(httpsopts, function (data) {
			callback(data)
		});
	};

	// Create a thing
	//
	// token - access_token
	// url - String url to submit
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
	self.create = function (token, url, params, callback) {

		if (typeof params === 'function') {
			callback = params;
			params = {};
		}

		params["url"] = checkurl(url);

		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things',
			method: 'POST',
			headers: {
				"Authorization": "Bearer "+token
			}
		};

		make_request(httpsopts, params, function (data) {
			callback(data)
		});
	};


	// Update a thing
	//
	// token - access_token
	// id - id of string
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
	self.update = function (token, id, params, callback) {

		if (typeof params === 'function') {
			callback = params;
			params = {};
		}

		// Flattr workaround for the PATCH request. See docs.
		params['_method'] = 'patch';
		
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things/'+id,
			method: 'PATCH',
			headers: {
				"Authorization": "Bearer "+token
			}
		};

		make_request(httpsopts, params, function (data) {
			callback(data)
		});
	};

	// Deletes a thing
	//
	// token - access token
	// id - id of thing to delete
	// callback - callback function
	//
	self.del = function (token, id, callback) {
		var httpsopts = {
			hostname: o.host,
			path: o.endpoint+'/things/'+id,
			method: 'DELETE',
			headers: {
				"Authorization": "Bearer "+token
			}
		};

		make_request(httpsopts, {}, function (data) {
			console.log('DATA', data);
			callback(data.error_description ? data : { message: 'ok' });
		});
	};

	// Search things
	//
	// params - object containing search params
	//     query (Optional) - string Free text search string
	//     tags (Optional) - string Filter by tags, separate with ,
	//     language (Optional) - string Filter by language
 	//     category (Optional) - string Filter by category
	//     user (Optional) - string Filter by username
	//     page (Optional) - integer The result page to show
	//     count (Optional) - integer Number of items per page
	//
	// callback - callback function
	//
 	self.search = function (params, callback) {

		var query_str = '';

		for (key in params)
			query_str += key+'='+encodeURIComponent(params[key])+'&';

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
			//console.log(data);
			try {
				data = JSON.parse(data);
				callback(data, res.headers);
			}
			catch (e) {
				callback({}, res.headers);
			}
		});
	});

	req.on('error', function (e) {
		console.log(e);
	});
	
	req.end(reqdata);
}

function checkurl (url) {
	return /^(http|https):\/\//.test(url) ? url : 'http://'+url;
}
