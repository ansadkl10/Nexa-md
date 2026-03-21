const axios = require("axios");

async function dl(url) {
  const res = await axios.get(url, { responseType: "arraybuffer", timeout: 30000 });
  return Buffer.from(res.data);
}

module.exports = [
  {
    pattern: /^ytmp3$/,
    desc: "Download YouTube audio",
    execute: async ({ sock, m, from, args }) => {
      const url = args[0];
      if (!url) return sock.sendMessage(from, { text: "Usage: .ytmp3 <youtube url>" }, { quoted: m });
      await sock.sendMessage(from, { text: "⏳ Fetching audio..." }, { quoted: m });
      try {
        const api = `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(api, { timeout: 30000 });
        if (!data?.url) throw new Error("No download URL");
        const buf = await dl(data.url);
        await sock.sendMessage(from, { audio: buf, mimetype: "audio/mpeg" }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^ytmp4$/,
    desc: "Download YouTube video",
    execute: async ({ sock, m, from, args }) => {
      const url = args[0];
      if (!url) return sock.sendMessage(from, { text: "Usage: .ytmp4 <youtube url>" }, { quoted: m });
      await sock.sendMessage(from, { text: "⏳ Fetching video..." }, { quoted: m });
      try {
        const apiUrl = `https://api.ryzendesu.vip/api/downloader/ytmp4?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });
        if (!data?.url) throw new Error("No download URL");
        const buf = await dl(data.url);
        await sock.sendMessage(from, { video: buf, mimetype: "video/mp4" }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^tiktok$/,
    desc: "Download TikTok video (no watermark)",
    execute: async ({ sock, m, from, args }) => {
      const url = args[0];
      if (!url) return sock.sendMessage(from, { text: "Usage: .tiktok <url>" }, { quoted: m });
      await sock.sendMessage(from, { text: "⏳ Downloading TikTok..." }, { quoted: m });
      try {
        const api = `https://api.ryzendesu.vip/api/downloader/ttdl?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(api, { timeout: 30000 });
        const videoUrl = data?.data?.play || data?.data?.nowm;
        if (!videoUrl) throw new Error("Could not get video URL");
        const buf = await dl(videoUrl);
        await sock.sendMessage(from, { video: buf, mimetype: "video/mp4", caption: data?.data?.title || "" }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^instagram$/,
    desc: "Download Instagram post/reel",
    execute: async ({ sock, m, from, args }) => {
      const url = args[0];
      if (!url) return sock.sendMessage(from, { text: "Usage: .instagram <url>" }, { quoted: m });
      await sock.sendMessage(from, { text: "⏳ Downloading..." }, { quoted: m });
      try {
        const api = `https://api.ryzendesu.vip/api/downloader/igdl?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(api, { timeout: 30000 });
        const media = data?.data?.[0];
        if (!media?.url) throw new Error("No media found");
        const buf = await dl(media.url);
        const isVideo = media.type === "video";
        await sock.sendMessage(from, isVideo
          ? { video: buf, mimetype: "video/mp4" }
          : { image: buf }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^facebook$/,
    desc: "Download Facebook video",
    execute: async ({ sock, m, from, args }) => {
      const url = args[0];
      if (!url) return sock.sendMessage(from, { text: "Usage: .facebook <url>" }, { quoted: m });
      await sock.sendMessage(from, { text: "⏳ Downloading..." }, { quoted: m });
      try {
        const api = `https://api.ryzendesu.vip/api/downloader/fbdl?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(api, { timeout: 30000 });
        const videoUrl = data?.data?.hd || data?.data?.sd;
        if (!videoUrl) throw new Error("No video found");
        const buf = await dl(videoUrl);
        await sock.sendMessage(from, { video: buf, mimetype: "video/mp4" }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^twitter$/,
    desc: "Download Twitter/X video",
    execute: async ({ sock, m, from, args }) => {
      const url = args[0];
      if (!url) return sock.sendMessage(from, { text: "Usage: .twitter <url>" }, { quoted: m });
      await sock.sendMessage(from, { text: "⏳ Downloading..." }, { quoted: m });
      try {
        const api = `https://api.ryzendesu.vip/api/downloader/xdl?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(api, { timeout: 30000 });
        const videoUrl = data?.data?.[0]?.url;
        if (!videoUrl) throw new Error("No video found");
        const buf = await dl(videoUrl);
        await sock.sendMessage(from, { video: buf, mimetype: "video/mp4" }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^spotify$/,
    desc: "Search and download Spotify track",
    execute: async ({ sock, m, from, args }) => {
      const q = args.join(" ");
      if (!q) return sock.sendMessage(from, { text: "Usage: .spotify <song name>" }, { quoted: m });
      await sock.sendMessage(from, { text: "🎵 Searching Spotify..." }, { quoted: m });
      try {
        const search = `https://api.ryzendesu.vip/api/search/spotify?q=${encodeURIComponent(q)}`;
        const { data: sData } = await axios.get(search, { timeout: 15000 });
        const track = sData?.data?.[0];
        if (!track) throw new Error("Track not found");
        const dl_api = `https://api.ryzendesu.vip/api/downloader/spotify?url=${encodeURIComponent(track.url)}`;
        const { data } = await axios.get(dl_api, { timeout: 30000 });
        if (!data?.url) throw new Error("Download failed");
        const buf = await dl(data.url);
        const caption = `🎵 *${track.name}*\n👤 ${track.artists}\n⏱️ ${track.duration}`;
        await sock.sendMessage(from, { audio: buf, mimetype: "audio/mpeg", fileName: `${track.name}.mp3` }, { quoted: m });
        await sock.sendMessage(from, { text: caption }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^lyrics$/,
    desc: "Get song lyrics",
    execute: async ({ sock, m, from, args }) => {
      const q = args.join(" ");
      if (!q) return sock.sendMessage(from, { text: "Usage: .lyrics <song name>" }, { quoted: m });
      await sock.sendMessage(from, { text: "🎤 Searching lyrics..." }, { quoted: m });
      try {
        const api = `https://api.popcat.xyz/lyrics?song=${encodeURIComponent(q)}`;
        const { data } = await axios.get(api, { timeout: 15000 });
        if (!data?.lyrics) throw new Error("Lyrics not found");
        const text = `🎵 *${data.title}*\n👤 ${data.artist}\n\n${data.lyrics.slice(0, 4000)}`;
        await sock.sendMessage(from, { text }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^img$/,
    desc: "Search for an image",
    execute: async ({ sock, m, from, args }) => {
      const q = args.join(" ");
      if (!q) return sock.sendMessage(from, { text: "Usage: .img <query>" }, { quoted: m });
      await sock.sendMessage(from, { text: "🖼️ Searching..." }, { quoted: m });
      try {
        const api = `https://api.ryzendesu.vip/api/search/image?query=${encodeURIComponent(q)}`;
        const { data } = await axios.get(api, { timeout: 15000 });
        const url = data?.data?.[0] || data?.url;
        if (!url) throw new Error("No image found");
        const buf = await dl(url);
        await sock.sendMessage(from, { image: buf, caption: q }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^gif$/,
    desc: "Search for a GIF",
    execute: async ({ sock, m, from, args }) => {
      const q = args.join(" ");
      if (!q) return sock.sendMessage(from, { text: "Usage: .gif <query>" }, { quoted: m });
      await sock.sendMessage(from, { text: "🎥 Searching GIF..." }, { quoted: m });
      try {
        const api = `https://api.popcat.xyz/gif?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(api, { timeout: 15000 });
        const url = data?.data?.[0]?.images?.original?.url || data?.url;
        if (!url) throw new Error("No GIF found");
        const buf = await dl(url);
        await sock.sendMessage(from, { video: buf, mimetype: "video/mp4", gifPlayback: true }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^sticker$/,
    desc: "Convert replied image/video to sticker",
    execute: async ({ sock, m, from, config }) => {
      const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted) return sock.sendMessage(from, { text: "Reply to an image or video to make a sticker." }, { quoted: m });
      await sock.sendMessage(from, { text: "⏳ Making sticker..." }, { quoted: m });
      try {
        const { downloadMediaMessage } = require("@whiskeysockets/baileys");
        const stream = await downloadMediaMessage(
          { message: quoted, key: { remoteJid: from } },
          "buffer",
          {},
          { logger: require("pino")({ level: "silent" }), reuploadRequest: sock.updateMediaMessage }
        );
        await sock.sendMessage(from, {
          sticker: stream,
          ...({ stickerMetadata: { packname: config.botName, author: config.ownerName } })
        }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^toimg$/,
    desc: "Convert sticker to image",
    execute: async ({ sock, m, from }) => {
      const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted?.stickerMessage) return sock.sendMessage(from, { text: "Reply to a sticker." }, { quoted: m });
      try {
        const { downloadMediaMessage } = require("@whiskeysockets/baileys");
        const buf = await downloadMediaMessage(
          { message: quoted, key: { remoteJid: from } },
          "buffer",
          {},
          { logger: require("pino")({ level: "silent" }), reuploadRequest: sock.updateMediaMessage }
        );
        await sock.sendMessage(from, { image: buf }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^attp$/,
    desc: "Animated text sticker",
    execute: async ({ sock, m, from, args }) => {
      const text = args.join(" ");
      if (!text) return sock.sendMessage(from, { text: "Usage: .attp <text>" }, { quoted: m });
      await sock.sendMessage(from, { text: "⏳ Creating..." }, { quoted: m });
      try {
        const api = `https://api.popcat.xyz/attp?text=${encodeURIComponent(text)}`;
        const buf = await dl(api);
        await sock.sendMessage(from, { sticker: buf }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^play$/,
    desc: "Search and play audio from YouTube",
    execute: async ({ sock, m, from, args }) => {
      const q = args.join(" ");
      if (!q) return sock.sendMessage(from, { text: "Usage: .play <song name>" }, { quoted: m });
      await sock.sendMessage(from, { text: `🔍 Searching for *${q}*...` }, { quoted: m });
      try {
        const search = `https://api.ryzendesu.vip/api/search/ytsearch?query=${encodeURIComponent(q)}`;
        const { data } = await axios.get(search, { timeout: 15000 });
        const video = data?.data?.[0];
        if (!video) throw new Error("No results");
        const dl_api = `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(video.url)}`;
        const { data: dlData } = await axios.get(dl_api, { timeout: 30000 });
        if (!dlData?.url) throw new Error("Download failed");
        const buf = await dl(dlData.url);
        const caption = `🎵 *${video.title}*\n⏱️ ${video.duration}\n👁️ ${video.views}`;
        await sock.sendMessage(from, { audio: buf, mimetype: "audio/mpeg", fileName: `${video.title}.mp3` }, { quoted: m });
        await sock.sendMessage(from, { text: caption }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
  {
    pattern: /^video$/,
    desc: "Search and download video from YouTube",
    execute: async ({ sock, m, from, args }) => {
      const q = args.join(" ");
      if (!q) return sock.sendMessage(from, { text: "Usage: .video <name>" }, { quoted: m });
      await sock.sendMessage(from, { text: `🔍 Searching for *${q}*...` }, { quoted: m });
      try {
        const search = `https://api.ryzendesu.vip/api/search/ytsearch?query=${encodeURIComponent(q)}`;
        const { data } = await axios.get(search, { timeout: 15000 });
        const video = data?.data?.[0];
        if (!video) throw new Error("No results");
        const dl_api = `https://api.ryzendesu.vip/api/downloader/ytmp4?url=${encodeURIComponent(video.url)}`;
        const { data: dlData } = await axios.get(dl_api, { timeout: 30000 });
        if (!dlData?.url) throw new Error("Download failed");
        const buf = await dl(dlData.url);
        await sock.sendMessage(from, { video: buf, mimetype: "video/mp4", caption: video.title }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
    },
  },
];
