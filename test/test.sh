#!/bin/bash
(cd ../build && NODE_ENV=NODE_LOCAL node app.js) &
sleep 1
(cd ../sql/ && ./reset-database-all.sh) && ../node_modules/newman/bin/newman.js run collections/App.postman_collection.json -e environments/App-Local.postman_environment.json --delay-request 50 --insecure --color on
lsof -n -i4TCP:8081 | grep LISTEN | awk '{ print $2 }' | xargs kill
echo "Server killed"
