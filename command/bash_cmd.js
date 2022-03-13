import { Bash } from 'node-bash';
import { responseTime } from '../lib/helper.js'



async function bash_cmd(ctx) {
    const sh = new Bash({
        debug: false,
        invocationTimeout: 120000,
        disposeTimeout: 120000,
    });
    const reply = await ctx.reply('Please wait...')
    ctx.replyWithChatAction('typing')
    try {
        const bashCmd = ctx.match[1]
        const bashrun = await sh.invoke(bashCmd)
        const response_time = responseTime(ctx.update.message.date)
        // ctx.reply(`<code>${bashrun.raw}</code>\n\n${response_time}`, { parse_mode: 'HTML' })
        ctx.telegram.editMessageText(
            reply.chat.id,
            reply.message_id,
            undefined,
            `<code>${bashrun.raw}</code>\n\n${response_time}`,
            {
                disable_web_page_preview: true,
                parse_mode: 'HTML'
            }
        )
    } catch (error) {
        // ctx.reply(`Err: \n<code>${error.message}</code>`, { parse_mode: 'HTML' })
        ctx.telegram.editMessageText(
            reply.chat.id,
            reply.message_id,
            undefined,
            `Err: ${error.message}`,
            {
                disable_web_page_preview: true,
                parse_mode: 'HTML'
            }
        )
        console.log(error.message)
    }
}

export default bash_cmd