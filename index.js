import { Telegraf } from "telegraf";
import "dotenv/config";

import modeminfo from "./command/modeminfo.js";
import my_ip from "./command/my_ip.js";
import bash_cmd from "./command/bash_cmd.js";
import speedtest from "./command/speedtest.js";
import SystemHandler from "./command/system.js";
import vnstat from "./command/vnstat.js";
import tts from "./command/tts.js";
import sidompulHandler from "./command/sidompul.js";
import customCommand from "./command/custom_cmd.js";
import helpHandler from "./command/help.js";
import speedtestlog from "./command/speedtest_log.js";
import askHandler from "./command/ask.js";
import { isAdmin } from "./lib/helper.js";

const bot = new Telegraf(process.env.TOKEN);

bot.telegram.getMe().then((bot_informations) => {
  bot.options.username = bot_informations.username;
  console.log(
    "Server has initialized bot nickname. Nick: " + bot_informations.username
  );
});

bot.use(isAdmin);
bot.use(helpHandler);
bot.use(SystemHandler);
bot.command("modeminfo", modeminfo);
bot.command("my_ip", my_ip);
bot.hears(/^.bash (.+)/i, bash_cmd);
bot.use(vnstat);
bot.use(tts);
bot.use(sidompulHandler);
bot.use(customCommand);
bot.use(speedtest);
bot.use(speedtestlog);
bot.use(askHandler);

bot.launch();
