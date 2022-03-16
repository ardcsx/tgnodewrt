import { Composer } from "telegraf"
import * as googleTTS from 'google-tts-api';

const composer = new Composer();

async function handleTTS(ctx) {
    try {
        const text = ctx.match[1]
        if (text.length > 100) {
            ctx.reply("😰 Text to long", { reply_to_message_id: ctx.message.message_id })
            return
        }
        ctx.replyWithChatAction('upload_voice')
        const url = googleTTS.getAudioUrl(text, {
            lang: 'id',
            slow: false,
            host: 'https://translate.google.com',
        });
        ctx.replyWithAudio(url, { reply_to_message_id: ctx.message.message_id })
    } catch (error) {
        ctx.reply('Err ' + error.message)
        console.log(error)
    }
}


composer.hears(/^.tts (.+)/i, handleTTS)

export default composer
