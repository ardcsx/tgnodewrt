#!/bin/sh

pgrep -f /root/tgnodewrt/index.js > /dev/null
    if [ $? -eq 1 ]; then
    /etc/init.d/tgnodewrt restart
fi