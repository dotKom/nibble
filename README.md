# nibble
App for buying foods &amp; drinks at the office

## Requirements
- [Node js](https://nodejs.org/en/) (only for bower)
- [Bower](http://bower.io/#getting-started)
- A webserver to run the app on (just static files)
- A server running the REST API [backend](https://github.com/dotKom/onlineweb4/tree/develop/apps/api/rfid) (not needed for dummy testing)

## Setup
- start bash or cmd and cd to nibble
- run: "bower install"
- fill in host, apiRoot, client_id and client_secret in "views/api/config.js"
- open the location of index.html in a webserver (opening as file:// messes with angular)
