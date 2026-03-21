const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
const config = require("./config");

const logger = pino({ level: "silent" });
const plugins = [];
const startTime = Date.now();

function loadPlugins() {
  const dir = path.join(__dirname, "plugins");
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
  for (const file of files) {
    try {
      const cmds = require(path.join(dir, file));
      if (Array.isArray(cmds)) plugins.push(...cmds);
    } catch (e) {
      console.error(`[Plugin error] ${file}:`, e.message);
    }
  }
  console.log(`✅ Loaded ${plugins.length} commands from ${files.length} files`);
}

function isOwner(sender) {
  const num = sender.split("@")[0];
  return num === String(config.ownerNumber) || config.sudoNumbers.includes(num);
}

async function startBot() {
  if (!fs.existsSync(config.sessionPath)) fs.mkdirSync(config.sessionPath, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(config.sessionPath);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false,
    browser: ["Nexa-md", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log("\n📱 Scan this QR code:\n");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        console.log("Reconnecting...");
        startBot();
      } else {
        console.log("Logged out. Delete auth_info/ and restart.");
      }
    }
    if (connection === "open") {
      console.log(`\n🤖 ${config.botName} is online!`);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    const m = messages[0];
    if (!m?.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = isGroup ? (m.key.participant || "") : from;
    const senderOwner = isOwner(sender);

    const body =
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      m.message?.imageMessage?.caption ||
      m.message?.videoMessage?.caption || "";

    if (!body.startsWith(config.prefix)) return;
    if (config.mode === "private" && !senderOwner) return;

    const parts = body.slice(config.prefix.length).trim().split(/\s+/);
    const cmd = parts.shift().toLowerCase();
    const args = parts;

    const ctx = { sock, m, from, sender, args, isGroup, senderOwner, body, config, startTime };

    for (const plugin of plugins) {
      if (!plugin.pattern.test(cmd)) continue;
      if (plugin.ownerOnly && !senderOwner) {
        await sock.sendMessage(from, { text: "❌ Owner only command." }, { quoted: m });
        return;
      }
      if (plugin.groupOnly && !isGroup) {
        await sock.sendMessage(from, { text: "❌ Use this command in a group." }, { quoted: m });
        return;
      }
      try {
        await plugin.execute(ctx);
      } catch (err) {
        console.error(`[Error] ${cmd}:`, err.message);
        await sock.sendMessage(from, { text: `❌ Error: ${err.message}` }, { quoted: m });
      }
      return;
    }
  });
}

loadPlugins();
startBot().catch(console.error);
