const { cmd } = require('../command');
const fetch = require('node-fetch');
const yts = require('yt-search');

cmd({
  pattern: "song",
  alias: ["play", "mp3"],
  react: "🎶",
  desc: "Download YouTube song (Audio) via Nekolabs API",
  category: "download",
  use: ".song <query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("⚠️ Please provide a song name or YouTube link.");

    // 🔹 API Call (Nekolabs)
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    // ✅ Validate response
    if (!data?.success || !data?.result?.downloadUrl) {
      return reply("❌ Song not found or API error. Try again later.");
    }

    const meta = data.result.metadata;
    const dlUrl = data.result.downloadUrl;

    // 🔹 Try fetching the thumbnail
    let buffer;
    try {
      const thumbRes = await fetch(meta.cover);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {
      buffer = null;
    }

    // 🔹 Song info card
    const caption = `
╔═══════════════════════
🎶 *Now Playing*
╠═══════════════════════
🎵 *Title:* ${meta.title}
👤 *Channel:* ${meta.channel}
⏱ *Duration:* ${meta.duration}
🔗 [Watch on YouTube](${meta.url})
╠═══════════════════════
⚡ Powered by *BILAL-MD*
╚═══════════════════════
`;

    // 🖼️ Send thumbnail + info
    await conn.sendMessage(from, {
      image: buffer,
      caption
    }, { quoted: mek });

    // 🎧 Send MP3 file
    await conn.sendMessage(from, {
      audio: { url: dlUrl },
      mimetype: "audio/mpeg",
      fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
    }, { quoted: mek });

  } catch (err) {
    console.error("song cmd error:", err);
    reply("⚠️ An unexpected error occurred while processing your request.");
  }
});
