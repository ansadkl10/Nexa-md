module.exports = [
  {
    pattern: /^kick$/,
    desc: "Kick a member",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from }) => {
      const target = m.message?.extendedTextMessage?.contextInfo?.participant
        || m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!target) return sock.sendMessage(from, { text: "Reply to or mention the user to kick." }, { quoted: m });
      await sock.groupParticipantsUpdate(from, [target], "remove");
      await sock.sendMessage(from, { text: `👋 Kicked @${target.split("@")[0]}`, mentions: [target] }, { quoted: m });
    },
  },
  {
    pattern: /^add$/,
    desc: "Add a member by number",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from, args }) => {
      const num = args[0]?.replace(/\D/g, "");
      if (!num) return sock.sendMessage(from, { text: "Usage: .add <number>" }, { quoted: m });
      const jid = `${num}@s.whatsapp.net`;
      await sock.groupParticipantsUpdate(from, [jid], "add");
      await sock.sendMessage(from, { text: `✅ Added ${num} to group.` }, { quoted: m });
    },
  },
  {
    pattern: /^promote$/,
    desc: "Promote member to admin",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from }) => {
      const target = m.message?.extendedTextMessage?.contextInfo?.participant
        || m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!target) return sock.sendMessage(from, { text: "Reply to or mention the user." }, { quoted: m });
      await sock.groupParticipantsUpdate(from, [target], "promote");
      await sock.sendMessage(from, { text: `⬆️ Promoted @${target.split("@")[0]}`, mentions: [target] }, { quoted: m });
    },
  },
  {
    pattern: /^demote$/,
    desc: "Demote admin to member",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from }) => {
      const target = m.message?.extendedTextMessage?.contextInfo?.participant
        || m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!target) return sock.sendMessage(from, { text: "Reply to or mention the user." }, { quoted: m });
      await sock.groupParticipantsUpdate(from, [target], "demote");
      await sock.sendMessage(from, { text: `⬇️ Demoted @${target.split("@")[0]}`, mentions: [target] }, { quoted: m });
    },
  },
  {
    pattern: /^mute$/,
    desc: "Mute the group (admins only can send)",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from }) => {
      await sock.groupSettingUpdate(from, "announcement");
      await sock.sendMessage(from, { text: "🔇 Group muted." }, { quoted: m });
    },
  },
  {
    pattern: /^unmute$/,
    desc: "Unmute the group",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from }) => {
      await sock.groupSettingUpdate(from, "not_announcement");
      await sock.sendMessage(from, { text: "🔊 Group unmuted." }, { quoted: m });
    },
  },
  {
    pattern: /^tag$/,
    desc: "Tag mentioned users",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from, args }) => {
      const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!mentions.length) return sock.sendMessage(from, { text: "Mention users to tag." }, { quoted: m });
      const msg = mentions.map(j => `@${j.split("@")[0]}`).join(" ");
      await sock.sendMessage(from, { text: `${args.join(" ") || "👋"}\n${msg}`, mentions }, { quoted: m });
    },
  },
  {
    pattern: /^tagall$/,
    desc: "Tag all group members",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from, args }) => {
      const meta = await sock.groupMetadata(from);
      const mentions = meta.participants.map(p => p.id);
      const msg = mentions.map(j => `@${j.split("@")[0]}`).join(" ");
      await sock.sendMessage(from, { text: `📢 ${args.join(" ") || "Attention!"}\n\n${msg}`, mentions }, { quoted: m });
    },
  },
  {
    pattern: /^tagadmin$/,
    desc: "Tag all admins",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from, args }) => {
      const meta = await sock.groupMetadata(from);
      const admins = meta.participants.filter(p => p.admin).map(p => p.id);
      const msg = admins.map(j => `@${j.split("@")[0]}`).join(" ");
      await sock.sendMessage(from, { text: `👑 ${args.join(" ") || "Admins!"}\n\n${msg}`, mentions: admins }, { quoted: m });
    },
  },
  {
    pattern: /^invite$/,
    desc: "Get group invite link",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from }) => {
      const code = await sock.groupInviteCode(from);
      await sock.sendMessage(from, { text: `🔗 Invite link:\nhttps://chat.whatsapp.com/${code}` }, { quoted: m });
    },
  },
  {
    pattern: /^revoke$/,
    desc: "Revoke group invite link",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from }) => {
      await sock.groupRevokeInvite(from);
      await sock.sendMessage(from, { text: "✅ Invite link revoked." }, { quoted: m });
    },
  },
  {
    pattern: /^groupinfo$/,
    desc: "Show group information",
    groupOnly: true,
    execute: async ({ sock, m, from }) => {
      const meta = await sock.groupMetadata(from);
      const admins = meta.participants.filter(p => p.admin).length;
      const text =
        `📋 *Group Info*\n\n` +
        `• *Name:* ${meta.subject}\n` +
        `• *Members:* ${meta.participants.length}\n` +
        `• *Admins:* ${admins}\n` +
        `• *Created:* ${new Date(meta.creation * 1000).toLocaleDateString()}\n` +
        `• *Description:* ${meta.desc || "None"}`;
      await sock.sendMessage(from, { text }, { quoted: m });
    },
  },
  {
    pattern: /^setname$/,
    desc: "Change group name",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from, args }) => {
      const name = args.join(" ");
      if (!name) return sock.sendMessage(from, { text: "Usage: .setname <new name>" }, { quoted: m });
      await sock.groupUpdateSubject(from, name);
      await sock.sendMessage(from, { text: `✅ Group name changed to: *${name}*` }, { quoted: m });
    },
  },
  {
    pattern: /^setdesc$/,
    desc: "Change group description",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from, args }) => {
      const desc = args.join(" ");
      if (!desc) return sock.sendMessage(from, { text: "Usage: .setdesc <description>" }, { quoted: m });
      await sock.groupUpdateDescription(from, desc);
      await sock.sendMessage(from, { text: "✅ Group description updated." }, { quoted: m });
    },
  },
  {
    pattern: /^antilink$/,
    desc: "Enable/disable antilink (delete WhatsApp links)",
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, m, from, args }) => {
      const mode = args[0]?.toLowerCase();
      if (!["on", "off"].includes(mode)) return sock.sendMessage(from, { text: "Usage: .antilink on|off" }, { quoted: m });
      await sock.sendMessage(from, { text: `🔗 Antilink turned *${mode}*.\n_(Restart bot to apply — store state in a DB for persistence)_` }, { quoted: m });
    },
  },
];
