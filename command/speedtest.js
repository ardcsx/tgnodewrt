import { Composer } from "telegraf"
import { Bash } from 'node-bash';
import fs from "fs"
import { parseSpeedtestData, sleep, editMsg } from '../lib/helper.js'
import { exec } from "child_process"

const composer = new Composer();

composer.command('/speedtest', speedtest)

async function speedtest(ctx) {


    const sh = new Bash({
        debug: false,
    });
    let loading = true
    const reply = await ctx.reply('Please wait')
    ctx.replyWithChatAction('typing')
    try {
        exec("speedtest --accept-license -f json > /tmp/speedtest.json", (error, stdout, stderr) => {
            // if (error) {
            //     console.log(`error: ${error.message}`);
            //     return;
            // }
            if (stderr) {
                // console.log(`stderr: ${stderr}`);
                loading = false
                try {
                    ctx.replyWithChatAction('typing')
                    const rawData = fs.readFileSync('/tmp/speedtest.json')
                    const data = JSON.parse(rawData)
                    const speedtest_text = parseSpeedtestData(data)
                    editMsg(ctx, reply, speedtest_text)
                    return;
                } catch (error) {
                    editMsg(ctx, reply, error.message)
                }
            }
            // console.log(`stdout: ${stdout}`);
        });
        let i = 1
        while (loading) {
            editMsg(ctx, reply, `Please wait (${i * 2}s)...`)
            await sleep(2000)
            i++
        }
        return
    } catch (error) {
        editMsg(ctx, reply, error.message)
        console.log(error)
    }
}

export default composer
