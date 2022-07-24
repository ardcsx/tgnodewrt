import { Composer } from "telegraf"
import axios from "axios"
import { getConfig, setConfig } from '../lib/helper.js'

const composer = new Composer();

async function kuotaXL(ctx) {
    try {
        const config = getConfig()
        if (config?.noxl) {
            const { data: { data } } = await axios.get(`https://apix.ardcs.my.id/cekxl?no=${config?.noxl}`)
            if (!data) throw "error"
            for (let i = 0; i < data.packageInfo.length; i++) {
                const packageItem = data.packageInfo[i];
                var text = ""
                const packageName = packageItem[0].packages.name
                const expDate = packageItem[0].packages.expDate
                text += `Nama Paket: ${packageName}\nEXP Date: ${expDate}\n\n`
                packageItem[0].benefits.map(item => {
                    text += `Type: ${item.type}\nBname: ${item.bname}\nQuota: ${item.quota}\nRemaining: ${item.remaining}\n\n`
                })
                if ((data.packageInfo.length - 1) == i) {
                    text += `Last update: ${data.lastUpdate}`
                }
                await ctx.reply(text, { parse_mode: "HTML" })
            }
        } else {
            ctx.reply("No XL belum ditambahkan!\n\n<code>!setxl &lt;nohp&gt;</code>\n\n<b>Contoh</b>:\n<code>!setxl 08123456789</code>", { reply_to_message_id: ctx.message.message_id, parse_mode: "HTML" })
        }
    } catch (error) {
        console.log(error)
        ctx.reply("Cek kuota XL GAGAL!", { reply_to_message_id: ctx.message.message_id })
    }
}

async function setXL(ctx) {
    try {
        const noxl = ctx.match[1]?.replace(/^62/, "0")
        if (!noxl || noxl.length < 10) {
            ctx.reply("ngeset yang bener dong!", { reply_to_message_id: ctx.message.message_id, parse_mode: "HTML" })
            return
        }
        const setnoxl = setConfig("noxl", noxl)
        if (setnoxl !== true) {
            ctx.reply("Set No XL GAGAL", { reply_to_message_id: ctx.message.message_id, parse_mode: "HTML" })
            return
        }
        ctx.reply("<i>set no XL berhasil</i>\n\n/kuotaxl - untuk mengecek kuota no xl", { reply_to_message_id: ctx.message.message_id, parse_mode: "HTML" })
    } catch (error) {
        console.log(error)
        ctx.reply("Set No XL GAGAL", { reply_to_message_id: ctx.message.message_id, parse_mode: "HTML" })
    }
}

composer.hears(/^!setxl (.+)/i, setXL)
composer.command('/kuotaxl', kuotaXL)

export default composer