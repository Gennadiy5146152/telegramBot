import TelegramApi from "node-telegram-bot-api";
import { againOptions, gameOptions } from "./options.js";
const token = "5964356861:AAFju0Ldf8TpfFCfB2tqFlYSeGf3qRgUxH8";
const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Я сейчас загадаю цифру от 0 до 9, а ты должен ее отгадать!)"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай!)", gameOptions);
};

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    bot.setMyCommands([
      { command: "/start", description: "Начальное приветствие" },
      { command: "/game", description: "Игра - угадай число" },
    ]);
    if (text === "/start") {
      await bot.sendMessage(
        chatId,
        `${msg.chat.first_name} добро пожаловать в разговорный клуб!`
      );
      return bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/a0a/6b0/a0a6b09c-7f38-37e5-9dac-583343142b54/1.webp"
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз");
  });
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    console.log(data, chats[chatId]);
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Поздрвляю, ты угадал!`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Ты не угадал(!, бот задал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
