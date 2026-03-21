module.exports = [
  {
    pattern: /^broadcast$/,
    desc: "Broadcast message to all chats",
    ownerOnly: true,
    execute: async ({ sock, m, from, args, config }) => {
      const msg = args.join(" ");
      if (!msg) return sock.sendMessage(from, { text: "Usage: .broadcast <message>" }, { quoted: m });
      const chats = await sock.groupFetchAllParticipating();
      let sent = 0;
      for (const jid of Object.keys(chats)) {
        try { await sock.sendMessage(jid, { text: `📢 *Broadcast from ${config.botName}*\n\n${msg}` }); sent++; } catch {}
      }
      await sock.sendMessage(from, { text: `✅ Broadcast sent to ${sent} groups.` }, { quoted: m });
    },
  },
  {
    pattern: /^ban$/,
    desc: "Ban a user",
    ownerOnly: true,
    execute: async ({ sock, m, from, config }) => {
      const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        || m.message?.extendedTextMessage?.contextInfo?.participant;
      if (!mentioned) return sock.sendMessage(from, { text: "Tag or reply to the user to ban." }, { quoted: m });
      const banned = config.sudoNumbers;
      if (!banned.includes(mentioned.split("@")[0])) {
        config.sudoNumbers.push("BANNED:" + mentioned.split("@")[0]);
      }
      await sock.sendMessage(from, { text: `🚫 Banned: @${mentioned.split("@")[0]}`, mentions: [mentioned] }, { quoted: m });
    },
  },
  {
    pattern: /^unban$/,
    desc: "Unban a user",
    ownerOnly: true,
    execute: async ({ sock, m, from }) => {
      await sock.sendMessage(from, { text: "✅ User unbanned." }, { quoted: m });
    },
  },
  {
    pattern: /^addsudo$/,
    desc: "Add sudo user",
    ownerOnly: true,
    execute: async ({ sock, m, from, args, config }) => {
      const num = args[0]?.replace(/\D/g, "");
      if (!num) return sock.sendMessage(from, { text: "Usage: .addsudo <number>" }, { quoted: m });
      if (!config.sudoNumbers.includes(num)) config.sudoNumbers.push(num);
      await sock.sendMessage(from, { text: `✅ Added ${num} as sudo.` }, { quoted: m });
    },
  },
  {
    pattern: /^delsudo$/,
    desc: "Remove sudo user",
    ownerOnly: true,
    execute: async ({ sock, m, from, args, config }) => {
      const num = args[0]?.replace(/\D/g, "");
      config.sudoNumbers = config.sudoNumbers.filter(n => n !== num);
      await sock.sendMessage(from, { text: `✅ Removed ${num} from sudo.` }, { quoted: m });
    },
  },
  {
    pattern: /^getsudo$/,
    desc: "List sudo users",
    ownerOnly: true,
    execute: async ({ sock, m, from, config }) => {
      const list = config.sudoNumbers.length ? config.sudoNumbers.join("\n") : "No sudo users.";
      await sock.sendMessage(from, { text: `👑 *Sudo Users:*\n${list}` }, { quoted: m });
    },
  },
  {
    pattern: /^block$/,
    desc: "Block a user",
    ownerOnly: true,
    execute: async ({ sock, m, from }) => {
      const target = m.message?.extendedTextMessage?.contextInfo?.participant;
      if (!target) return sock.sendMessage(from, { text: "Reply to the user to block." }, { quoted: m });
      await sock.updateBlockStatus(target, "block");
      await sock.sendMessage(from, { text: `🔴 Blocked: @${target.split("@")[0]}`, mentions: [target] }, { quoted: m });
    },
  },
  {
    pattern: /^unblock$/,
    desc: "Unblock a user",
    ownerOnly: true,
    execute: async ({ sock, m, from }) => {
      const target = m.message?.extendedTextMessage?.contextInfo?.participant;
      if (!target) return sock.sendMessage(from, { text: "Reply to the user to unblock." }, { quoted: m });
      await sock.updateBlockStatus(target, "unblock");
      await sock.sendMessage(from, { text: `🟢 Unblocked: @${target.split("@")[0]}`, mentions: [target] }, { quoted: m });
    },
  },
  {
    pattern: /^setprefix$/,
    desc: "Change command prefix",
    ownerOnly: true,
    execute: async ({ sock, m, from, args, config }) => {
      const p = args[0];
      if (!p) return sock.sendMessage(from, { text: "Usage: .setprefix <new prefix>" }, { quoted: m });
      config.prefix = p;
      await sock.sendMessage(from, { text: `✅ Prefix changed to: *${p}*` }, { quoted: m });
    },
  },
  {
    pattern: /^restart$/,
    desc: "Restart the bot",
    ownerOnly: true,
    execute: async ({ sock, m, from }) => {
      await sock.sendMessage(from, { text: "🔄 Restarting..." }, { quoted: m });
      process.exit(0);
    },
  },
  {
    pattern: /^eval$/,
    desc: "Evaluate JS code (owner only)",
    ownerOnly: true,
    execute: async ({ sock, m, from, args }) => {
      const code = args.join(" ");
      try {
        const result = await eval(code);
        await sock.sendMessage(from, { text: `✅ ${JSON.stringify(result, null, 2)}` }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ ${e.message}` }, { quoted: m });
      }
    },
  },
];
