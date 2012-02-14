NodeJS module for the Flattr API
================================

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=antics&url=https://github.com/antics/node-flattr&title=node-flattr&language=&tags=github&category=software)

Under heavy development. Give me a couple of more days and this one will become 
completed.

Status:

* flattr.flattrs **OK**
* flattr.things  **FAIL**
* flattr.users   **FAIL**
* flattr.activities **TODO**
* flattr.categories **TODO**
* flattr.languages  **TODO**

# Get Started

Require the flattr module:

    var flattr = require('flattr');

List an authenticated users flattrs:

	// First get your auth code by visiting:
	// https://flattr.com/oauth/authorize?response_type=code&client_id=<app_key>
	//
    var app = {
        client_id: '<app_key>',
		client_secret: '<app_secret>',
		// Must match your apps  callback url:
		redirect_uri: 'http://localhost:8080/flattr'
	};
	
	flattr.request_token(app, code, function (token) {
		flattr.flattrs.list_auth(token, function (flattrs_list) {
		    // do something
		});
	});
	
List a users (flattr) three latest flattrs:

	flattr.flattrs.list('flattr', {count: 3}, function (flattrs) {
        // do something
	});
	
# API

## Flattrs

Resource for listing a users flattrs and to flattr things.

http://developers.flattr.net/api/resources/flattrs/

    var flattrs = require('flattr').flattrs;

### flattrs.list(user, [obj], callback)

List a users flattrs. `obj.count` default to **30** and tells Flattr number of records
to retrieve, `obj.page` defaults to **1**. 

    flattrs.list('flattr_user', {count: 5}, function (data) {
	    console.log(data);
	});

### flattrs.list_auth(token, [obj], callback)

List an authenticated users flattrs. `obj.count` default to **30** and tells Flattr number of records
to retrieve, `obj.page` defaults to **1**.

    flattrs.list_auth(token, function (data) {
	    console.log(data);
	});
   
### flattrs.thing(token, id, callback)

Flattr a thing with id of `id`.

    flattrs.id(token, 423405, function (data) {
	    console.log(data);
	});
	
### flattrs.url(token, url, user, [obj], callback)

Flattr an URL. `obj` holds optional query parameters for the auto-submit url.

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

