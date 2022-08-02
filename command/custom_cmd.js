import { Composer } from "telegraf"
import { Bash } from 'node-bash';
import { getConfig, setConfig } from "../lib/helper.js";

const composer = new Composer();
const config = getConfig()

const menu = [
    [{ text: "Command List", callback_data: `cmds` }]
]

function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

async function addCtCommand(ctx) {
    try {
        const [cmd_name, at_cmd] = ctx.match[1].split("#")
        const customCommands = config?.customCommands || []
        customCommands.unshift({
            name: cmd_name,
            command: at_cmd
        })
        const setconf = setConfig("customCommands", customCommands)
        if (setconf == true) {
            ctx.reply(`<i>Tambah Custom Command Berhasil</i>\n\nName: ${cmd_name}\n<code>${at_cmd}</code>`, { reply_to_message_id: ctx.message.message_id, parse_mode: "HTML" })
        }
    } catch (error) {
        console.log(error)
        ctx.reply("Tambah Custom Command Gagal", { reply_to_message_id: ctx.message.message_id, parse_mode: "HTML" })
    }
}

async function ctCommands(ctx, page = 1) {
    try {
        const commandlist = config?.customCommands
        const totalPage = Math.ceil(commandlist.length / 10)
        const cmdlist = paginate(commandlist, 10, page).map((cmd, i) => {
            const menu = [
                { text: `${cmd.name}`, callback_data: `ctcommand ${i}` }
            ]
            return menu
        })
        if (ctx.update?.callback_query) {
            await ctx.deleteMessage()
        }
        const pagination = []
        if (page > 1) {
            pagination.push(
                { text: `<< Prev`, callback_data: `changePage ${page - 1}` }
            )
        }
        if (page < totalPage) {
            pagination.push(
                { text: `Next >>`, callback_data: `changePage ${page + 1}` }
            )
        }
        if (pagination.length >= 1) {
            cmdlist.push(pagination)
        }
        await ctx.reply("Custom command list:",
            {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: cmdlist
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
}

async function handleCommand(ctx) {
    try {
        const selectedCmd = Number(ctx.match[1])
        const CT = config?.customCommands[selectedCmd]
        const sh = new Bash({
            debug: false,
        });
        const bashcmd = await sh.invoke(CT.command)
        ctx.deleteMessage()
        await ctx.reply(`<b>Custom Command ${CT.name}</b> \n\n<code>${bashcmd.raw}</code>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: menu
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const CustomCommandHelp = `<strong>Custom Command</strong>

/cmds - list custom command

<strong>!addcmd <code>{nama}#{perintah}</code></strong>
ex: <code>!addcmd Modem Information#echo ATI | atinout - /dev/ttyUSB2 -</code>`


// composer.hears(/^!setatport (.+)/i, setAtPort)
composer.hears(/^!addcmd (.+)/i, addCtCommand)
composer.action(/^ctcommand (.+)/i, handleCommand)
composer.action(/^changePage (.+)/i, (ctx) => { ctCommands(ctx, Number(ctx.match[1])) })
composer.action("cmds", (ctx) => { ctCommands(ctx, 1) })
composer.command("cmds", (ctx) => { ctCommands(ctx, 1) })
composer.command("cmd", (ctx) => ctx.reply(CustomCommandHelp, { parse_mode: 'HTML' }))

export default composer