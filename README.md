NodeJS module for the Flattr API
================================

Under heavy development. Give me a couple of days and this one will become 
completed.

# API

## Flattrs

Resource for listing a users flattrs and to flattr things.

http://developers.flattr.net/api/resources/flattrs/

    var flattrs = require('flattr').flattrs;

### flattrs.list(user, [count], [page], callback)

List a users flattrs. `count` default to **30** and tells Flattr number of records
to retrieve, `page` defaults to **1**. 

    flattrs.list('flattr_user', 5, function (data, headers) {
	    console.log(data);
	});

### flattrs.list_auth([count], [page], callback)

List the authenticated users flattrs.

### flattrs.thing(id, callback)

Flattr a thing with id of `id`.

    flattrs.id(423405, function (data, headers) {
	    console.log(data);
	});
	
### flattrs.url(url, user, [params], callback)

Flattr an URL. `params` holds an object with optional query parameters for the
auto-submit url.

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
	flattrs.url('womenshealthmag.com/yoga/top-10-yoga-poses-for-men', 'flattr_user', params, 
	    function (data, headers) {
	        console.log(data);
	    }
    );

## Things

A resource to list and search for things.

http://developers.flattr.net/api/resources/things/

    var things = require('flattr').things;

### things.list(user, [count], [page], callback)

List a users things. `count` is the number of records to retrieve, `page` is 
page of results.

    things.list('flattr', function (data, headers) {
	    console.log(data);
	});

### things.list_auth([count], [page], callback)

List things from the authenticated user.

### things.get(id, callback)

Get a thing.

    things.get(423405, function (data, headers) {
	    console.log(data);
	});

### things.exists(url, callback)

Check if a thing exists by its URL.

    things.exists(url, function (data, headers) {
	    console.log(data);
	}):
	
### things.create(url, [params], callback)

Create/submit a new thing. Authorization is required.

    // Optional parameters
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
	things.create('womenshealthmag.com/yoga/top-10-yoga-poses-for-men', params, 
	    function (data, headers) {
	        console.log(data);
	    }
    );
	
### things.update(id, [params], callback)

Update a thing. Authorization is required.

	things.update(45325, {title: 'Relax man'}, function (data, head) {
	    console.log(data);
	});

### things.del(id, callback)

Deletes a thing. Authorization is required.

    things.del(543213, function (data, head) {
	    console.log(data);
    });

### things.search(params, callback)

Search for things. For the `params` argument use one or several of the 
following parameters:

* query - string Free text search string
* tags - string Filter by tags, separate with ,
* language - string Filter by language
* category - string Filter by category
* user - string Filter by username
* page - integer The result page to show
* count - integer Number of items per page

    things.search({query: 'charity', category: 'trees'}, function (results, head) {
	    // Results contains search results.
	    console.log(results);
	});


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

