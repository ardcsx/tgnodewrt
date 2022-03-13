source /root/tgnodewrt/.env

curl -k -s -X POST https://api.telegram.org/bot$TOKEN/sendMessage -d chat_id=$ADMIN_ID -d parse_mode=Markdown --data-urlencode text="Bot started." &> /dev/null