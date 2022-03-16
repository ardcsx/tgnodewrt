source /root/tgnodewrt/.env

curl -X POST http://192.168.7.1/jrd/webapi?api=SetDeviceReboot -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0", "method":"SetDeviceReboot", "params":{"UserName":"admin","Password":"$PASSWORD"}, "id": "13.5"}' --referer http://192.168.7.1/index.html --http0.9 &> /dev/null