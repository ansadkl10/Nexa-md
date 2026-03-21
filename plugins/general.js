const os = require("os");
const start = Date.now();

module.exports = [
  {
    pattern: /^ping$/,
    desc: "Check bot speed",
    execute: async ({ sock, m, from }) => {
      const ms = Date.now() - start;
      await sock.sendMessage(from, { text: `🏓 Pong! *${ms}ms*` }, { quoted: m });
    },
  },
  {
    pattern: /^info$/,
    desc: "Bot information",
    execute: async ({ sock, m, from, config }) => {
      const text =
        `╔══════════════════╗\n` +
        `║  🤖 *${config.botName}*  \n` +
        `╚══════════════════╝\n\n` +
        `• *Version:* ${config.version}\n` +
        `• *Prefix:* ${config.prefix}\n` +
        `• *Mode:* ${config.mode}\n` +
        `• *Platform:* ${os.platform()}\n` +
        `• *Node:* ${process.version}`;
      await sock.sendMessage(from, { text }, { quoted: m });
    },
  },
  {
    pattern: /^uptime$/,
    desc: "Bot uptime",
    execute: async ({ sock, m, from }) => {
      const s = Math.floor((Date.now() - start) / 1000);
      const h = Math.floor(s / 3600), min = Math.floor((s % 3600) / 60), sec = s % 60;
      await sock.sendMessage(from, { text: `⏱️ Uptime: *${h}h ${min}m ${sec}s*` }, { quoted: m });
    },
  },
  {
    pattern: /^menu$/,
    desc: "Show all commands",
    execute: async ({ sock, m, from, config }) => {
      const p = config.prefix;
      const text =
        `╔══════════════════╗\n` +
        `║  🤖 *${config.botName} Menu*\n` +
        `╚══════════════════╝\n\n` +
        `📌 *General*\n` +
        `• ${p}ping  ${p}info  ${p}uptime  ${p}menu  ${p}help\n\n` +
        `🎵 *Downloads*\n` +
        `• ${p}ytmp3 <url>  ${p}ytmp4 <url>\n` +
        `• ${p}tiktok <url>  ${p}instagram <url>\n` +
        `• ${p}facebook <url>  ${p}twitter <url>\n` +
        `• ${p}spotify <name>  ${p}lyrics <song>\n` +
        `• ${p}img <query>  ${p}gif <query>\n` +
        `• ${p}sticker  ${p}toimg  ${p}attp <text>\n\n` +
        `👥 *Group*\n` +
        `• ${p}kick  ${p}add  ${p}promote  ${p}demote\n` +
        `• ${p}mute  ${p}unmute  ${p}tag  ${p}tagall\n` +
        `• ${p}tagadmin  ${p}invite  ${p}revoke\n` +
        `• ${p}groupinfo  ${p}setname  ${p}setdesc\n` +
        `• ${p}antilink on/off\n\n` +
        `👑 *Owner*\n` +
        `• ${p}broadcast  ${p}ban  ${p}unban\n` +
        `• ${p}addsudo  ${p}delsudo  ${p}getsudo\n` +
        `• ${p}block  ${p}unblock  ${p}setprefix\n` +
        `• ${p}restart  ${p}eval\n\n` +
        `🎮 *Fun*\n` +
        `• ${p}joke  ${p}fact  ${p}quote  ${p}8ball\n` +
        `• ${p}dare  ${p}truth  ${p}rps  ${p}flip\n` +
        `• ${p}dice  ${p}choose\n\n` +
        `> _Powered by ${config.botName}_`;
      await sock.sendMessage(from, { text }, { quoted: m });
    },
  },
  {
    pattern: /^help$/,
    desc: "Show help",
    execute: async ({ sock, m, from, config }) => {
      const text =
        `📖 *Help — ${config.botName}*\n\n` +
        `Prefix: *${config.prefix}*\n` +
        `Use *${config.prefix}menu* for all commands.\n\n` +
        `Owner: set your number in *config.env*\n` +
        `Sudo: add numbers with *${config.prefix}addsudo*`;
      await sock.sendMessage(from, { text }, { quoted: m });
    },
  },
];
