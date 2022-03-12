# tgnodeWRT
Personal telegram bot for openwrt

#Usage
## Install NodeJS
```bash
opkg update
opkg install node node-npm
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
5. Auto start on boot.
    ```bash
    cp etc/init.d/tgnodewrt /etc/init.d/
    /etc/init.d/tgnodewrt enable
    /etc/init.d/tgnodewrt start
    ```







