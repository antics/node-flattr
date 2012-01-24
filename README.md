NodeJS module for Flattr API
============================


## API

### flattrs.list(user, [count], [page], callback)

List a users flattrs. `count` default to **30** and tells Flattr number of records
to recieve, `page` defaults to **1**. 

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

Flattr an URL. `params` holds an object with optional query parameters to the
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


