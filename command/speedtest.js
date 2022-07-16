import { Bash } from 'node-bash';
import fs from "fs"
import { bytesToSize, responseTime } from '../lib/helper.js'


async function speedtest(ctx) {
    const sh = new Bash({
        debug: false,
    });
    const reply = await ctx.reply('Please wait...')
    ctx.replyWithChatAction('typing')
    try {
        const bashrun = await sh.invoke('speedtest --accept-license -f json > /tmp/speedtest.log')
        const rawData = fs.readFileSync('/tmp/speedtest.log')
        const data = JSON.parse(rawData)
        const download = (data.download.bandwidth / 125000).toFixed(2)
        const upload = (data.upload.bandwidth / 125000).toFixed(2)
        const waktu = new Date().toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            hour12: false
        });
        const response_time = responseTime(ctx.update.message.date)
        const loss = data.packetLoss ? `${data.packetLoss.toFixed(1)} %` : '0'
        const speedtest_text = `<b>Speedtest Result</b> ${waktu}\n\n<code>Server: ${data.server.name} ${data.server.location}\n   ISP: ${data.isp}\n  Ping: ${data.ping.latency.toFixed()} ms (jitter ${data.ping.jitter.toFixed()} ms)\n    DL: ${download} Mbps (${bytesToSize(data.download.bytes)})\n    UL: ${upload} Mbps (${bytesToSize(data.upload.bytes)})\n  Loss: ${loss}</code>\n\nResult: ${data.result.url}\n\n${response_time}`
        ctx.telegram.editMessageText(
            reply.chat.id,
            reply.message_id,
            undefined,
            `${speedtest_text}`,
            {
                disable_web_page_preview: true,
                parse_mode: 'HTML'
            }
        )
        // console.log(data)

    } catch (error) {
        ctx.telegram.editMessageText(
            reply.chat.id,
            reply.message_id,
            undefined,
            `${error.message}`,
            {
                disable_web_page_preview: true,
                parse_mode: 'HTML'
            }
        )
        console.log(error)
    }
}

export default speedtest
