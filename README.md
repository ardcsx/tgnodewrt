# tgnodeWRT

Personal telegram bot for openwrt

# Usage

## Install NodeJS

```bash
opkg update
opkg install node node-npm vnstat vnstati git git-http
```

## Install Nodejs Package

```bash
npm i -g yarn pm2
```

## Install bot

1. Clone this repository
   ```bash
   git clone https://github.com/ardcsx/tgnodewrt.git
   ```
2. Install dependencies (`yarn` or `npm install`)
3. edit `.env` file, change `TOKEN` and `ADMIN_ID`
4. Start the development environment
   ```bash
   npm run dev or yarn dev
   ```

### Auto start on boot

```bash
cp /root/tgnodewrt/etc/init.d/tgnodewrt /etc/init.d/
/etc/init.d/tgnodewrt enable
/etc/init.d/tgnodewrt start
```

### Crontab setting

```bash
/root/tgnodewrt/bot.sh
Telegram NodeJS Openwrt Menu

1) add bot crontab        3) add speedtest crontab  5) install bot
2) del bot crontab        4) del speedtest crontab  6) Quit
```

### Speedtest every 1 hour

Add to scheduled task

```bash
0 */1 * * *  /root/tgnodewrt/command/sh/speed.sh
```

## Bot command

#### Main command<br/>

/ping - bot response time<br/>
/system_info - router system information<br/>
/modeminfo - allcatel modem information<br/>
/my_ip - IP information<br/>
/speedtest - run speedtest ookla<br/>
/speeedtest_log - get speedtest log<br/>
/vnstat - show vnstat menu<br/>
/restart_bot - restart tgnodeWRT bot<br/>
/restart - restart router<br/>
<br/>

#### Bash commnd<br/>

.bash {cmd}<br/>
<br/>

#### Cek Kuota XL<br/>

/kuotaxl - cek informasi no xl<br/>
!setxl (nohp) - set no xl<br/>
<br/>

#### Extra command<br/>

.tts {text} - text to speech<br/>
