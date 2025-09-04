const { cmd } = require('../command');
const axios = require('axios');

function extractUrl(text = '') {
  if (!text) return null;
  const urlRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[\w\-?=&%.#\/]+)|(youtube\.com\/[\w\-?=&%.#\/]+)/i;
  const match = text.match(urlRegex);
  if (!match) return null;
  return match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
}

cmd({
  pattern: 'video',
  alias: ['mp40','ytmp4'],
  desc: 'Download YouTube video (MP4) using PrinceTech API.',
  category: 'download',
  react: '📥',
  filename: __filename
},
async (conn, mek, m, { from, args, reply, quoted }) => {
  try {
    const provided = args.join(' ').trim() || (quoted && (quoted.text || quoted.caption)) || '';
    const ytUrl = extractUrl(provided);

    if (!ytUrl) {
      return reply('🧩 *Usage:* .ytmp4 <youtube-url>\n👉 Or reply to a message containing a YouTube link.');
    }

    const api = `https://api.princetechn.com/api/download/ytmp4?apikey=prince&url=${encodeURIComponent(ytUrl)}`;
    await reply('⏳ Fetching video info...');

    const { data } = await axios.get(api, { timeout: 30_000, headers: { 'User-Agent': 'WhiteShadow-MD/1.0' } });

    if (!data || data.success !== true || !data.result?.download_url) {
      return reply('❌ Failed to fetch. Try another link or later.');
    }

    const { title, thumbnail, download_url, quality } = data.result;
    const caption = `*🎬 ${title}*\n🧩 Quality: *${quality || '—'}*\n\n➡️ *Auto-sending video...*`;

    // Normal image preview only
    await conn.sendMessage(from, {
      image: { url: thumbnail },
      caption
    }, { quoted: m });

    // Send video
    try {
      await conn.sendMessage(from, {
        video: { url: download_url },
        fileName: `${title.replace(/[\\/:*?"<>|]/g, '')}.mp4`,
        mimetype: 'video/mp4',
        caption: `✅ Downloaded: *${title}*\n📥 POWERED BY BILAL-MD`
      }, { quoted: m });
    } catch (err) {
      await reply(`⚠️ I couldn't upload the file due to size/limits.\n\n*Direct Download:* ${download_url}`);
    }
  } catch (e) {
    console.error('ytmp4x error =>', e?.message || e);
    reply('🚫 An unexpected error occurred. Please try again.');
  }
});
