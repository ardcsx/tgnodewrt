#!/bin/bash
# Bash Menu Script Example

echo -e "Telegram NodeJS Openwrt Menu\n"
PS3='Please enter your choice: '
options=("add bot crontab" "del bot crontab" "add speedtest crontab" "del speedtest crontab" "install bot" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "add bot crontab")
            tmpfile=$(mktemp)
            crontab -l >"$tmpfile"
            printf '%s\n' "*/2 * * * *  /root/tgnodewrt/util/bot-checker.sh" >>"$tmpfile"
            crontab "$tmpfile" && rm -f "$tmpfile"
            echo -e "Successfully add crontab"
            break
            ;;
        "del bot crontab")
            tmpfile=$(mktemp)
            crontab -l >"$tmpfile"
            sed -i "/bot-checker.sh/d" "$tmpfile"
            crontab "$tmpfile" && rm -f "$tmpfile"
            echo "Successfully delete crontab"
            break
            ;;
        "add speedtest crontab")
            tmpfile=$(mktemp)
            crontab -l >"$tmpfile"
            printf '%s\n' "0 */1 * * *  /root/tgnodewrt/command/sh/speed.sh" >>"$tmpfile"
            crontab "$tmpfile" && rm -f "$tmpfile"
            echo -e "Successfully add speedtest crontab"
            break
            ;;
        "del speedtest crontab")
            tmpfile=$(mktemp)
            crontab -l >"$tmpfile"
            sed -i "/speed.sh/d" "$tmpfile"
            crontab "$tmpfile" && rm -f "$tmpfile"
            echo "Successfully delete speedtest crontab"
            break
            ;;
        "install bot")
            echo "you chose choice $REPLY which is $opt but this option still not available"
            ;;
        "Quit")
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done

