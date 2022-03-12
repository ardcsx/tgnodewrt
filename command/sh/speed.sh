# Speedtest log
# crontab per jam: 0 */1 * * *  /root/tgnodewrt/command/sh/speed.sh

curl -s 'https://google.com' > /dev/null
    if [ $? -eq 0 ]; then
    sleep 10
    # speedtest -s 37344 -f json >> /tmp/speedtest.log
    speedtest -f json >> /tmp/speedtestall.log
fi