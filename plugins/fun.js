const axios = require("axios");

const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Why do cows wear bells? Because their horns don't work.",
  "What do you call a fish without eyes? A fsh.",
  "I'm reading a book about anti-gravity. It's impossible to put down.",
];

const facts = [
  "Honey never expires. Archaeologists found 3000-year-old honey in Egyptian tombs.",
  "A group of flamingos is called a flamboyance.",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
  "Sharks are older than trees.",
  "Bananas are berries, but strawberries are not.",
];

const quotes = [
  "The best way to predict the future is to create it. — Abraham Lincoln",
  "In the middle of every difficulty lies opportunity. — Albert Einstein",
  "It does not matter how slowly you go as long as you do not stop. — Confucius",
  "Life is what happens when you're busy making other plans. — John Lennon",
  "The only impossible journey is the one you never begin. — Tony Robbins",
];

const dares = [
  "Text your last contact 'I love you' 😂",
  "Do 20 push-ups right now.",
  "Send a voice note singing your favorite song.",
  "Change your profile picture for 1 hour.",
  "Text a random person 'Are you my dad?' 😂",
];

const truths = [
  "What's the most embarrassing thing you've done?",
  "Who do you have a crush on?",
  "What's your biggest fear?",
  "Have you ever lied to get out of trouble?",
  "What's the last thing you searched on Google?",
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

module.exports = [
  {
    pattern: /^joke$/,
    desc: "Get a random joke",
    execute: async ({ sock, m, from }) => {
      await sock.sendMessage(from, { text: `😂 ${rand(jokes)}` }, { quoted: m });
    },
  },
  {
    pattern: /^fact$/,
    desc: "Get a random fun fact",
    execute: async ({ sock, m, from }) => {
      await sock.sendMessage(from, { text: `🧠 *Fun Fact:*\n${rand(facts)}` }, { quoted: m });
    },
  },
  {
    pattern: /^quote$/,
    desc: "Get an inspirational quote",
    execute: async ({ sock, m, from }) => {
      await sock.sendMessage(from, { text: `💬 ${rand(quotes)}` }, { quoted: m });
    },
  },
  {
    pattern: /^8ball$/,
    desc: "Ask the magic 8 ball",
    execute: async ({ sock, m, from, args }) => {
      const q = args.join(" ");
      if (!q) return sock.sendMessage(from, { text: "Ask me a question! E.g: .8ball Will I be rich?" }, { quoted: m });
      const answers = ["Yes ✅", "No ❌", "Definitely! 🔥", "Not a chance 😅", "Ask again later 🤔", "Absolutely! 💯", "I doubt it 😬"];
      await sock.sendMessage(from, { text: `🎱 *8Ball:* ${rand(answers)}` }, { quoted: m });
    },
  },
  {
    pattern: /^dare$/,
    desc: "Get a dare challenge",
    execute: async ({ sock, m, from }) => {
      await sock.sendMessage(from, { text: `🔥 *Dare:*\n${rand(dares)}` }, { quoted: m });
    },
  },
  {
    pattern: /^truth$/,
    desc: "Get a truth question",
    execute: async ({ sock, m, from }) => {
      await sock.sendMessage(from, { text: `🤔 *Truth:*\n${rand(truths)}` }, { quoted: m });
    },
  },
  {
    pattern: /^rps$/,
    desc: "Rock Paper Scissors",
    execute: async ({ sock, m, from, args }) => {
      const choices = ["rock", "paper", "scissors"];
      const user = args[0]?.toLowerCase();
      if (!choices.includes(user)) return sock.sendMessage(from, { text: "Usage: .rps rock|paper|scissors" }, { quoted: m });
      const bot = rand(choices);
      const win = (user === "rock" && bot === "scissors") || (user === "paper" && bot === "rock") || (user === "scissors" && bot === "paper");
      const result = user === bot ? "It's a tie! 🤝" : win ? "You win! 🎉" : "Bot wins! 🤖";
      await sock.sendMessage(from, { text: `✊✋✌️ *RPS*\nYou: ${user}\nBot: ${bot}\n${result}` }, { quoted: m });
    },
  },
  {
    pattern: /^flip$/,
    desc: "Flip a coin",
    execute: async ({ sock, m, from }) => {
      const result = Math.random() < 0.5 ? "Heads 🪙" : "Tails 🪙";
      await sock.sendMessage(from, { text: `🪙 *Coin Flip:* ${result}` }, { quoted: m });
    },
  },
  {
    pattern: /^dice$/,
    desc: "Roll a dice",
    execute: async ({ sock, m, from }) => {
      const roll = Math.floor(Math.random() * 6) + 1;
      const faces = ["", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
      await sock.sendMessage(from, { text: `🎲 *Dice Roll:* ${faces[roll]} (${roll})` }, { quoted: m });
    },
  },
  {
    pattern: /^choose$/,
    desc: "Choose randomly from options",
    execute: async ({ sock, m, from, args }) => {
      if (args.length < 2) return sock.sendMessage(from, { text: "Usage: .choose option1 option2 option3..." }, { quoted: m });
      const choice = rand(args);
      await sock.sendMessage(from, { text: `🎯 I choose: *${choice}*` }, { quoted: m });
    },
  },
];
