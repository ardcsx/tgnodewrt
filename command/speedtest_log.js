import { readFileSync } from "fs"
import { bytesToSize } from '../lib/helper.js'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function speedtest_log(ctx) {
    try {
        const rawData = readFileSync('/tmp/speedtestall.log', 'utf-8')
        const arrayData = rawData.split(/\r?\n/)
        for (let i = 0; i < arrayData.length; i++) {
            if (arrayData[i].length > 20) {
                try {
                    const data = JSON.parse(arrayData[i])
                    const download = (data.download.bandwidth / 125000).toFixed(2)
                    const upload = (data.upload.bandwidth / 125000).toFixed(2)
                    const waktu = new Date(data.timestamp).toLocaleString('id-ID', {
                        timeZone: 'Asia/Jakarta',
                        hour12: false
                    });
                    const loss = data.packetLoss ? `${data.packetLoss.toFixed(1)} %` : '0'
                    const speedtest_text = `<b>Speedtest Result</b> ${waktu}\n\n<code>Server: ${data.server.name} ${data.server.location}\n   ISP: ${data.isp}\n  Ping: ${data.ping.latency.toFixed()} ms (jitter ${data.ping.jitter.toFixed()} ms)\n    DL: ${download} Mbps (${bytesToSize(data.download.bytes)})\n    UL: ${upload} Mbps (${bytesToSize(data.upload.bytes)})\n  Loss: ${loss}</code>\n\nResult: ${data.result.url}`
                    await ctx.reply(
                        `${speedtest_text}`,
                        {
                            disable_web_page_preview: true,
                            parse_mode: 'HTML'
                        }
                    )
                    await sleep(100)
                } catch (error) {
                    // console.log(error)
                }
            }
        }

    } catch (error) {
        ctx.reply('Err ' + error.message)
        console.log(error)
    }
}

export default speedtest_log
