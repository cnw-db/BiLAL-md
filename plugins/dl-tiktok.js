// plugins/tiktok.js
// TikTok Downloader with reply system (1 = Video, 2 = Audio)

const axios = require("axios");
const { cmd } = require("../command");

const API_BASE = "https://lance-frank-asta.onrender.com/api/tikdl?url=";

// cache to remember last TikTok data per chat
const cache = {};

function formatNum(n) {
  return typeof n === "number" ? n.toLocaleString("en-US") : n;
}

function buildCaption(d) {
  return `*🎯 Title:* ${d.title || "-"}
*👤 Author:* ${d.author?.nickname || ""} (@${d.author?.unique_id || ""})
*⏱️ Duration:* ${d.duration || "—"}s
*📊 Stats:* Plays ${formatNum(d.play_count)} | Likes ${formatNum(d.digg_count)} | Comments ${formatNum(d.comment_count)} | Shares ${formatNum(d.share_count)}

➡️ Reply with *1* for Video
➡️ Reply with *2* for Audio`;
}

async function fetchTikTok(url) {
  const { data } = await axios.get(API_BASE + encodeURIComponent(url.trim()), { timeout: 20000 });
  if (!data?.status || !data?.data) throw new Error("Invalid API response");
  return data.data;
}

// main command
cmd({
  pattern: "tiktok",
  alias: ["tt", "tik"],
  react: "🎵",
  desc: "TikTok Downloader - Reply system (1=Video, 2=Audio).",
  category: "downloader",
  filename: __filename
}, async (m, sock, args, { from, reply }) => {
  try {
    const url = args[0];
    if (!url) return reply(`Usage: .tiktok <tiktok-url>`);

    const d = await fetchTikTok(url);

    // save in cache
    cache[from] = d;

    // send info + instructions
    await sock.sendMessage(from, {
      image: { url: d.cover || d.origin_cover },
      caption: buildCaption(d),
      contextInfo: {
        externalAdReply: {
          title: d.title?.slice(0, 50) || "TikTok Downloader",
          body: d.author?.nickname || "TikTok",
          thumbnailUrl: d.cover,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: url
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    reply("❌ TikTok download failed. Try again.");
  }
});

// reply hook (1 or 2)
cmd({
  pattern: "tiktok_reply",
  dontAddCommandList: true
}, async (m, sock, args, { from }) => {
  try {
    const text = (m.message?.conversation || m.message?.extendedTextMessage?.text || "").trim();
    if (!["1", "2"].includes(text)) return;

    const d = cache[from];
    if (!d) return;

    if (text === "1") {
      // send video
      await sock.sendMessage(from, {
        video: { url: d.play },
        mimetype: "video/mp4",
        caption: "🎬 TikTok Video"
      }, { quoted: m });
    } else if (text === "2") {
      // send audio
      await sock.sendMessage(from, {
        audio: { url: d.music_info?.play || d.music },
        mimetype: "audio/mpeg",
        ptt: false
      }, { quoted: m });
    }
  } catch (e) {
    console.error("TT reply error:", e);
  }
});
