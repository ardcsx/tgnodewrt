import fs from "fs"


export function isAdmin(ctx, next) {
    if (ctx.from.id == process.env.ADMIN_ID) {
        next()
    }
}


export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

export function parseSpeedtestData(data) {
    const download = (data.download.bandwidth / 125000).toFixed(2)
    const upload = (data.upload.bandwidth / 125000).toFixed(2)
    const waktu = new Date(data.timestamp).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour12: false
    });
    const loss = data.packetLoss ? `${data.packetLoss.toFixed(1)} %` : '0'
    const speedtest_text = `<b>Speedtest Result</b> ${waktu}\n\n<code>Server: ${data.server.name} ${data.server.location}\n   ISP: ${data.isp}\n  Ping: ${data.ping.latency.toFixed()} ms (jitter ${data.ping.jitter.toFixed()} ms)\n    DL: ${download} Mbps (${bytesToSize(data.download.bytes)})${data.download.latency && `\n        ${data.download.latency.iqm.toFixed(1)} ms`}\n    UL: ${upload} Mbps (${bytesToSize(data.upload.bytes)})${data.download.latency && `\n        ${data.upload.latency.iqm.toFixed(1)} ms`}\n  Loss: ${loss}</code>\n\nResult: ${data.result.url}`
    return speedtest_text
}

export async function editMsg(ctx, reply, msg) {
    return ctx.telegram.editMessageText(
        reply.chat.id,
        reply.message_id,
        undefined,
        `${msg}`,
        {
            disable_web_page_preview: true,
            parse_mode: 'HTML'
        }
    )
}

