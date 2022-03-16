#!/bin/bash
# Bash Menu Script Example

echo -e "Telegram NodeJS Openwrt Menu\n"
PS3='Please enter your choice: '
options=("add crontab" "del crontab" "install bot" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "add crontab")
            tmpfile=$(mktemp)
            crontab -l >"$tmpfile"
            printf '%s\n' "*/5 * * * *  /root/tgnodewrt/util/bot-checker.sh" >>"$tmpfile"
            crontab "$tmpfile" && rm -f "$tmpfile"
            echo -e "Successfully add crontab"
            break
            ;;
        "del crontab")
            tmpfile=$(mktemp)
            crontab -l >"$tmpfile"
            sed -i "/bot-checker.sh/d" "$tmpfile"
            crontab "$tmpfile" && rm -f "$tmpfile"
            echo "Successfully delete crontab"
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

