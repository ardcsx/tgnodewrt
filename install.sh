#!/bin/bash
# Telegram Node Openwrt Bot

CWARNING="\033[0;33m"
CSUCCESS="\033[0;32m"
CPRIMARY="\033[0;36m"
CEND="\033[0m"
ENV="/etc/tgnodewrt/.env"
DIR="/etc/tgnodewrt/"

showBanner () {
echo -e "################################################################
#${CSUCCESS}      __                        __   _       ______  ______   ${CEND}#
#${CSUCCESS}     / /_____ _____  ____  ____/ /__| |     / / __ \/_  __/   ${CEND}#
#${CSUCCESS}    / __/ __  / __ \/ __ \/ __  / _ \ | /| / / /_/ / / /      ${CEND}#
#${CSUCCESS}   / /_/ /_/ / / / / /_/ / /_/ /  __/ |/ |/ / _, _/ / /       ${CEND}#
#${CSUCCESS}   \__/\__, /_/ /_/\____/\__,_/\___/|__/|__/_/ |_| /_/        ${CEND}#
#${CSUCCESS}      /____/                                                  ${CEND}#
#                                                              #
################################################################\n"
}

version() {
    echo -e "version: 1.2"
    echo -e "updated date: 10/20/2022"
}

showHelp() {
    showBanner
    version
    echo -e "Usage: tgnodewrt ${CPRIMARY}[command]${CEND}
    help , -h                                    Show this help message
    version, -v                                  Show version info
    start,                                       Start tgnodeWRT
    stop,                                        Stop tgnodeWRT
    restart, -r                                  Restart tgnodeWRT
    install, -i                                  Install tgnodeWRT
    update, -u                                   Update tgnodeWRT
    add_bot_crontab, -bc                         Add bot crontab
    remove_bot_crontab, -rbc                     Remove bot crontab
    add_speedtest_crontab, -sc                   Add speedtest crontab [/h]
    remove_speedtest_crontab, -rsc               Remove speedtest crontab
    "
}

addCrontab(){
    if [ "$1" == "botcr" ]; then
        if crontab -l | grep -q 'bot-checker.sh'; then
            echo -e "Crontab bot already exists"
            return 0
        fi
    fi

    if [ "$1" == "spcr" ]; then
        if crontab -l | grep -q 'speed.sh'; then
            echo -e "Crontab speedtest already exists"
            return 0
        fi
    fi

    tmpfile=$(mktemp)
	crontab -l >"$tmpfile"
    printf '%s\n' "$2" >>"$tmpfile"
    crontab "$tmpfile" && rm -f "$tmpfile"
    echo -e "Successfully add crontab"
}

removeCrontab(){
    tmpfile=$(mktemp)
    crontab -l >"$tmpfile"
    if [ "$1" == "botcr" ]; then
        sed -i "/bot-checker.sh/d" "$tmpfile"
    fi

    if [ "$1" == "spcr" ]; then
        sed -i "/speed.sh/d" "$tmpfile"
    fi
    crontab "$tmpfile" && rm -f "$tmpfile"
    echo "Successfully delete crontab"
}

installPkg(){
    if [[ $(opkg list-installed | grep -c "^$1") == "0" ]]; then
        echo -e "Installing ${CPRIMARY}${1}${CEND}..." && opkg install $1
    fi
}



add_speedtest_crontab(){
    randomNumber=$((5 + $RANDOM % 50))
    addCrontab "spcr" "$randomNumber */1 * * *  /etc/tgnodewrt/command/sh/speed.sh"
}

installScript(){
    showBanner
    
    if test -f "${DIR}index.js"; then
        echo -e "${CPRIMARY}tgnodeWRT${CEND} already installed"
        while :; do
            read -e -p "Do you want to reinstall tgnodeWRT ? [y/n]: " config_flag
            if [ "${config_flag}" == 'y' ]; then
                echo -e "Uninstalling ${CPRIMARY}tgnodeWRT${CEND} ..."
                rm -rf $DIR
                rm /etc/init.d/tgnodewrt
                break
            elif [ "${config_flag}" == 'n' ]; then
                echo -e "Exit Installation Mode"
                exit 0
            else
                echo -e "${CWARNING}input error! Please only input 'y' or 'n'${CEND}"
            fi
        done
    fi

    while :; do
        read -p "$(echo -e "Please input ${CPRIMARY}BOT TOKEN${CEND} : ")" TOKEN
        if [[ -z "${TOKEN}" ]]; then
            echo -e "${CWARNING}TOKEN BOT cant be empty${CEND}"
        else
            break
        fi
    done

    while :; do
        read -p "$(echo -e "Please input ${CPRIMARY}ADMIN_ID${CEND}  : ")" ADMIN_ID
        if [[ -z "${ADMIN_ID}" ]]; then
            echo -e "${CWARNING}ADMIN_ID cant be empty${CEND}"
        else
            break
        fi
    done

    #installing dependencies
    echo -e "Installing dependencies ..."
    opkg update
    installPkg "bash"
    installPkg "node"
    installPkg "node-npm"
    installPkg "curl"
    installPkg "git"
    installPkg "git-http"
	if [[ $(opkg list-installed | grep -c "^vnstat -") == "1" ]]; then
        echo -e "Found old ${CPRIMARY}vnstat${CEND} Removing..."
        opkg remove vnstat
    fi
	if [[ $(opkg list-installed | grep -c "^vnstati -") == "1" ]]; then
        echo -e "Found old ${CPRIMARY}vnstati${CEND} Removing..."
        opkg remove vnstati
    fi
    installPkg "vnstat2"
    installPkg "vnstati2"

    # installing bot
    echo -e "Installing bot ..."
    cd /etc
    git clone https://github.com/ardcsx/tgnodewrt.git
    cd tgnodewrt
    npm install
    cp /etc/tgnodewrt/etc/init.d/tgnodewrt /etc/init.d/
    /etc/init.d/tgnodewrt enable
    createConfig "$TOKEN" "$ADMIN_ID"
    /etc/init.d/tgnodewrt start
    clear
    showBanner
    echo -e "Add bot crontab ..."
    addCrontab "botcr" "*/2 * * * *  /etc/tgnodewrt/util/bot-checker.sh"
    echo -e "Add speedtest crontab ..."
    add_speedtest_crontab
    echo -e "${CSUCCESS}tgnodeWRT Successfully installed${CEND}"
}

updateScript(){
    cd /etc/tgnodewrt
    git pull origin main
    npm install
    cp /etc/tgnodewrt/etc/init.d/tgnodewrt /etc/init.d/
    /etc/init.d/tgnodewrt enable
    /etc/init.d/tgnodewrt restart
}

createConfig(){
    printf '%s\n' 'TOKEN="'$1'"' >> "$ENV"
    printf '%s\n' "ADMIN_ID=$2" >> "$ENV"
}

while :; do
  case "$1" in
    -h|help)
      showHelp; exit 0
      ;;
    -v|version)
      version; exit 0
      ;;
    start)
      /etc/init.d/tgnodewrt start; exit 0
      ;;
    stop)
      /etc/init.d/tgnodewrt stop; exit 0
      ;;
    -r|restart)
      /etc/init.d/tgnodewrt restart; exit 0
      ;;
    -i|install)
        installScript
        exit 0
      ;;
    -u|update)
        updateScript
        exit 0
      ;;
    -bc|add_bot_crontab)
        addCrontab "botcr" "*/2 * * * *  /etc/tgnodewrt/util/bot-checker.sh"
        exit 0
      ;;
    -rbc|remove_bot_crontab)
        removeCrontab "botcr"
        exit 0
      ;;
    -sc|add_speedtest_crontab)
        add_speedtest_crontab
        exit 0
      ;;
    -rsc|remove_speedtest_crontab)
        removeCrontab "spcr"
        exit 0
      ;;
    *)
      showHelp; exit 0
      ;;
  esac
done
