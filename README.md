NodeJS module for Flattr API
============================


## API

### flattrs.list(user, [count], [page], callback)

List a users flattrs. `count` default to **30** and tells Flattr number of records
to recieve, `page` defaults to **1**. 

    flattrs.list('flattr', 5, 1, function (data, headers) {
	    console.log(data);
	});
