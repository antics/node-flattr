NodeJS module for the Flattr API
================================

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=antics&url=https://github.com/antics/node-flattr&title=node-flattr&language=&tags=github&category=software)

Status:

* flattr.flattrs **OK**
* flattr.things  **OK**
* flattr.users   **OK**
* flattr.activities **TODO**
* flattr.categories **TODO**
* flattr.languages  **TODO**

# Get Started

    npm install flattr
	
Require the flattr module:

    var flattr = require('flattr');

Authentication code and Token

	// First get your auth code by visiting:
	// https://flattr.com/oauth/authorize?response_type=code&client_id=<app_key>
	// A helper is available to generate the url (with scopes):
	// var url = flattr.auth_url(client_id, 'flattr thing email extendedread');
	
    var app = {
        client_id: '<app_key>',
		client_secret: '<app_secret>',
		// Must match your apps  callback url:
		redirect_uri: 'http://localhost:8080/flattr'
	};
	
	// Get the token.
	flattr.request_token(app, auth_code, function (token) {
        console.log(token);
	});

List an authenticated users flattrs:

    flattr.flattrs.list_auth(token, function (flattrs_list) {
        console.log(flattrs_list);
    });
	
List a users (flattr) three latest flattrs:

	flattr.flattrs.list('flattr', {count: 3}, function (flattrs) {
        console.log(flattrs);
	});
	
# API

## Flattrs

Resource for listing a users flattrs and to flattr things.

http://developers.flattr.net/api/resources/flattrs/

    var flattrs = require('flattr').flattrs;

### flattrs.list(user, [obj], callback)

List a users flattrs. `obj.count` default to **30** and tells Flattr number of records to retrieve, `obj.page` defaults to **1**. 

    flattrs.list('flattr_user', {count: 5}, function (data) {
	    console.log(data);
	});

### flattrs.list_auth(token, [obj], callback)

List an authenticated users flattrs. `obj.count` default to **30** and tells Flattr number of records to retrieve, `obj.page` defaults to **1**.

    flattrs.list_auth(token, function (data) {
	    console.log(data);
	});
   
### flattrs.thing(token, id, callback)

Flattr a thing with id of `id`.

    flattrs.thing(token, 423405, function (data) {
	    console.log(data);
	});
	
### flattrs.url(token, url, [user], [obj], callback)

Flattr an URL. `obj` holds optional query parameters for the auto-submit url. You can submit things without a user (see: http://stackoverflow.com/a/9307116/691679).

    var params = {
	    title: 'Optional title',
		description: 'Description of your thing',
		// https://api.flattr.com/rest/v2/languages.txt
		language: 'en_GB',
		tags: 'yoga, top10, poses',
		// 1 to hide from public listings
		hidden: 1,
		// https://api.flattr.com/rest/v2/categories.txt
		category: 'text'
	};
	
	// With or without http/https is accepted.
	flattrs.url(token, 'womenshealthmag.com/yoga/top-10-yoga-poses-for-men', 'flattr_user', params, 
	    function (data) {
	        console.log(data);
	    }
    );


## Things

A resource to list, add, update and search for things.

http://developers.flattr.net/api/resources/things/

    var things = require('flattr').things;

### things.list(user, [obj], callback)

List a users things. `obj.count` default to **30** and tells Flattr number of records to retrieve, `obj.page` defaults to **1**.

    things.list('flattr', { count: 10 }, function (data) {});

### things.list_auth(token, [obj], callback)

List the authenticated users things.

### things.get(id, [token], callback)

Get a thing with id of `id` or multiple things as an array of id's. Supplying a `token` should give extra data if resource owner owns the thing.

    things.get(12345, function (data) {});
	
### things.exists(url, [autosubmit], callback)

Check if a thing exists. If `autosubmit == true` it checks an auto submit url.

    things.exists('http://github.com/antics/node-flattr', function (data) {});
	
### things.create(token, url, [obj], callback)

Create a thing with the url `url` and submit optional extra information in `obj`.

    var params = {
	    title: 'NodeJS module for the flattr API',
		tags: 'nodejs,flattr'
	};
    
    things.create(token, 'github.com/antics/node-flattr', params, function (data) {});

### things.update(token, id, [obj], callback)

Update a thing with the id `id`.

### things.del(token, id, callback)

Delete thing with id `id`.

    things.del(token, '1234', function (data) {
        // if ok, data.message == 'ok'
	});

### things.search(params, callback)

Search for things. `params` holds object with search parameters. See http://developers.flattr.net/api/resources/things/#search-things


## Users

Resource to get user data.

http://developers.flattr.net/api/resources/users/

    var users = require('flattr').users;
	
### users.get(user, callback)

Retrieve user data on `user`.

### users.get_auth(token, callback)

Retrieve user data on authenticated user.

# Licence
Copyright (C) 2012 Humanity

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

