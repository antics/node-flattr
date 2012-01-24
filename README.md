NodeJS module for Flattr API
============================

Flattrs
-------

***List a users flattrs

**Parameters**

* user - user name
* count ( Optional ) - Number of records to receive
* page ( Optional ) - Page of results to retreive
* callback - callback function

   flattrs.list('flattr', 5, 1, function (data, headers) {
      console.log(data);
   });
