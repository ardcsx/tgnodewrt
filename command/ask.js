import { Configuration, OpenAIApi } from "openai";
import { Composer } from "telegraf";
import { editMsg } from "../lib/helper.js";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const composer = new Composer();

async function handleAsk(ctx) {
  try {
    if (!configuration.apiKey) {
      ctx.reply(
        "OpenAI API key not configured, please follow instructions in README.md",
        {
          reply_to_message_id: ctx.message.message_id,
        }
      );
      return;
    }
    const reply = await ctx.reply("Please wait", {
      reply_to_message_id: ctx.message.message_id,
    });
    ctx.replyWithChatAction("typing");
    const question = ctx.match[1];
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question,
      max_tokens: 1000,
      temperature: 0,
    });
    if (completion.status === 200) {
      editMsg(ctx, reply, completion.data.choices[0].text);
    } else {
      console.log(completion);
      editMsg(ctx, reply, "Error with OpenAI API request");
    }
    return;
  } catch (error) {
    console.log(error);
  }
}

composer.hears(/^.ask (.+)/i, handleAsk);

export default composer;
