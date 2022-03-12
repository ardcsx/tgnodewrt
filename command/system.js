import { Bash } from 'node-bash';


export async function system_info(ctx) {
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

export async function restart_bot(ctx) {
    const sh = new Bash({
        debug: false,
    });
    try {
        ctx.reply('Restart bot...')
        await sh.invoke('pm2 restart tgnodewrt')
    } catch (error) {
        ctx.reply('Err: ' + error.message)
        console.log(error)
    }
}
export async function restart(ctx) {
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

