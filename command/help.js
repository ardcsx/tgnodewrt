import { Composer } from "telegraf"

const composer = new Composer();

const helpText = `tgnodeWRT Bot Command\n
<b>Main command</b>
/ping - bot response time
/system_info - router system information
/modeminfo - allcatel modem information
/my_ip - IP information
/speedtest - run speedtest ookla
/speeedtest_log - get speedtest log
/vnstat - show vnstat menu

<b>Restart command</b>
/restart_bot - restart tgnodeWRT bot
/restart - restart router

<b>Bash command</b>
.bash {cmd}

<b>Cek Kuota XL</b>
/kuotaxl - cek informasi no xl
!setxl (nohp) - set no xl

<b>Extra command</b>
.tts {text} - text to speech`


async function helpCmd(ctx) {
    try {
        ctx.reply(helpText, { parse_mode: "HTML" })
    } catch (error) {
        console.log(error)
    }
}
composer.command('help', helpCmd)
composer.command('start', helpCmd)
export default composer
