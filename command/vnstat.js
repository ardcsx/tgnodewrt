import { Composer } from "telegraf"
import { Bash } from 'node-bash';


const composer = new Composer();

const commandList = [
    "vnstat_hours", "vnstat_days", "vnstat_summary", "vnstat_months", "vnstat_top10"
]

const list_menu = [
    [{ text: "Hours", callback_data: `vnstat_hours` }, { text: "Day", callback_data: 'vnstat_days' }],
    [{ text: "Month", callback_data: 'vnstat_months' }, { text: "📊 Summary", callback_data: 'vnstat_summary' }],
    [{ text: "📊 Top 10", callback_data: 'vnstat_top10' }]
]

async function getStats(ctx) {
    try {
        ctx.replyWithChatAction("upload_photo")
        const key = ctx.match[0]
        let stat
        switch (key) {
            case "vnstat_hours":
                stat = "-h"
                break;
            case "vnstat_days":
                stat = "-d"
                break;
            case "vnstat_summary":
                stat = "-vs"
                break;
            case "vnstat_months":
                stat = "-m"
                break;
            case "vnstat_top10":
                stat = "-t"
                break;

            default:
                stat = "-d"
                break;
        }
        const sh = new Bash({
            debug: false,
            invocationTimeout: 120000,
            disposeTimeout: 120000,
        });
        const bashCmd = await sh.invoke(`vnstati -i br-lan ${stat} -o /tmp/vnstat.png`)
        ctx.deleteMessage()
        await ctx.replyWithPhoto({ source: '/tmp/vnstat.png' }, {
            reply_markup: {
                inline_keyboard: list_menu
            }
        })
    } catch (error) {
        ctx.reply('Err ' + error.message)
        console.log(error)
    }
}

composer.command('vnstat', (ctx) => {
    const pesan = `Vnstat Menu:`
    ctx.reply(pesan,
        {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: list_menu
            }
        }
    )
})

composer.action(commandList, getStats)

export default composer