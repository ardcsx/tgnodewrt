# tgnodeWRT
Personal telegram bot for openwrt

# Usage
## Install NodeJS
```bash
opkg update
opkg install node node-npm vnstat vnstati
```

## Install bot
1. Clone this repository
    ```bash
    git clone https://github.com/ardcsx/tgnodewrt.git
    ```
2. Install dependecies (`yarn` or `npm install`)
3. edit ```.env``` file, change ```TOKEN``` and ```ADMIN_ID```
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
### Speedtest every 1 hour
Add to scheduled task
```bash
0 */1 * * *  /root/tgnodewrt/command/sh/speed.sh
```







