import { Composer } from "telegraf"
import { Bash } from 'node-bash';

const composer = new Composer();


async function system_info(ctx) {
    const sh = new Bash({
        debug: false,
    });

    try {
        const bashcmd = await sh.invoke('./command/sh/systeminfo.sh')
        ctx.reply(`<b>System Information</b> \n\n<code>${bashcmd.raw}</code>`, {
            parse_mode: 'HTML'
        })
    } catch (error) {
        ctx.reply('Err: ' + error.message)
        console.log(error)
    }
}

async function restart_bot(ctx) {
    const sh = new Bash({
        debug: false,
    });
    try {
        ctx.reply('Restart bot...')
        await sh.invoke('/etc/init.d/tgnodewrt restart')
    } catch (error) {
        ctx.reply('Err: ' + error.message)
        console.log(error)
    }
}

async function restart(ctx) {
    const sh = new Bash({
        debug: false,
    });
    try {
        ctx.reply('Router restart in 2 secs...')
        await sh.invoke('sleep 2')
        await sh.invoke('reboot')
    } catch (error) {
        ctx.reply('Err: ' + error.message)
        console.log(error)
    }
}

async function ping(ctx) {
    const start = ctx.update.message.date * 1000
    const end = new Date().getTime()
    const total_time = (end - start) / 1000
    ctx.reply(`📍 <b>Bot response time <code>${total_time.toFixed(2)}s</code></b>`, { reply_to_message_id: ctx.message.message_id, parse_mode: 'HTML' });
}

composer.command('ping', ping)
composer.command('system_info', system_info)
composer.command('restart_bot', restart_bot)
composer.command('restart', restart)

export default composer

