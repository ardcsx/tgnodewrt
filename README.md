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
