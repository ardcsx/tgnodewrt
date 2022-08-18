import { Composer } from "telegraf"
import { readFileSync } from "fs"
import { parseSpeedtestData } from '../lib/helper.js'

const composer = new Composer();

composer.command('/speedtest_log', speedtest_log)

async function speedtest_log(ctx) {
    try {
        const rawData = readFileSync('/tmp/speedtestall.log', 'utf-8')
        const arrayData = rawData.split(/\r?\n/).slice(-25)
        for (let i = 0; i < arrayData.length; i++) {
            if (arrayData[i].length > 20) {
                try {
                    const data = JSON.parse(arrayData[i])
                    const speedtest_text = parseSpeedtestData(data)
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

export default composer
