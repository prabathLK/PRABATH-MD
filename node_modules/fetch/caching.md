Caching in HTTP
===============

ETAG
----

Res 200:

    ETag: "fa6e-3e3073913b100"

Req:

    If-None-Match: "fa6e-3e3073913b100"

Res 304:

    ETag: "fa6e-3e3073913b100"


LAST MODIFIED
-------------

Res 200:

    Last-Modified: Mon, 28 Jan 2013 22:29:45 GMT

Req:

    If-Modified-Since: Mon, 28 Jan 2013 22:29:45 GMT

Res 304:

    Last-Modified:Mon, 28 Jan 2013 22:29:45 GMT


EXPIRES
-------

Res 200:

    Expires: Tue, 19 Mar 2013 11:17:57 GMT

Do not try again before Tue, 19 Mar 2013 11:17:57 GMT

CACHE-CONTROL
-------------

Res 200:

    Cache-Control: max-age=300

Do not try again until 5 minutes from now