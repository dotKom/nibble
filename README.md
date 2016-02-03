# nibble
App for buying foods &amp; drinks at the office
![Nibble shop](http://i.imgur.com/1ItEFrd.png "Main shop view")

## Requirements
- [Node js](https://nodejs.org/en/) (only for bower)
- [Bower](http://bower.io/#getting-started)
- A webserver to run the app on (just static files)
- A server running the REST API [backend](https://github.com/dotKom/onlineweb4/tree/develop/apps/shop) (not needed for dummy testing)

## Setup
- start bash or cmd and cd to nibble
- run: "bower install"
- fill in host, apiRoot, client_id and client_secret in "config.json"
- open the location of index.html in a webserver (opening as file:// messes with angular)
