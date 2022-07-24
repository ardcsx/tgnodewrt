import fs from "fs"


export function isAdmin(ctx, next) {
    if (ctx.from.id == process.env.ADMIN_ID) {
        next()
    }
}

export function bytesToSize(bytes) {
    const sizes = [' B', ' KB', ' MB', ' GB', ' T'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + '' + sizes[i];
}

export function responseTime(timestamp) {
    const start = timestamp * 1000
    const end = new Date().getTime()
    const total_time = (end - start) / 1000
    return `📍 <b>Success in <code>${total_time.toFixed(1)}s</code></b>`
}

export function getConfig() {
    if (fs.existsSync(`./config.json`)) {
        const file = fs.readFileSync('./config.json')
        const config = JSON.parse(file)
        return config
    }
    return null
}

export function setConfig(name, value) {
    if (fs.existsSync(`./config.json`)) {
        const file = fs.readFileSync('./config.json')
        const config = JSON.parse(file)
        config[name] = value
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
        return true
    }
    const file = {
        [name]: value
    }
    fs.writeFileSync('./config.json', JSON.stringify(file, null, 2));
    return true
}

