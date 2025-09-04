

const axios = require('axios');

module.exports = {
  name: 'video',
  alias: ['ytmp4','ytshort','ytshorts'],
  desc: 'Download YouTube MP4 using PrinceTech API (Bilal-MD style).',
  category: 'download',
  isOwner: false,

  async handle(conn, msg, { args, quoted, reply }) {
    try {
      const extractUrl = (text = '') => {
        if (!text) return null;
        const urlRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[\w\-?=&%.#\/]+)|(youtube\.com\/[\w\-?=&%.#\/]+)/i;
        const match = text.match(urlRegex);
        if (!match) return null;
        return match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
      };

      const provided = args?.length ? args.join(' ') : (quoted && (quoted.text || quoted.caption)) || '';
      const ytUrl = extractUrl(provided);

      if (!ytUrl) return await reply('🧩 Usage: ytmp4x <youtube-url>\nOr reply to a message containing a YouTube link.');

      const api = `https://api.princetechn.com/api/download/ytmp4?apikey=prince&url=${encodeURIComponent(ytUrl)}`;
      await reply('⏳ Fetching video info from PrinceTech...');

      const { data } = await axios.get(api, { timeout: 30000, headers: { 'User-Agent': 'Bilal-MD/1.0' } });

      if (!data || data.success !== true || !data.result?.download_url) {
        return await reply('❌ Unable to fetch video info. Try another link or later.');
      }

      const { title, thumbnail, download_url, quality } = data.result;
      const cleanTitle = title ? title.replace(/[\\/:*?"<>|]/g, '') : 'video';

      // send details card first
      await conn.sendMessage(msg.from, {
        image: { url: thumbnail },
        caption: `*🎬 Title:* ${title}\n📺 *Quality:* ${quality || '—'}\n🔗 *Download:* ${download_url}`,
      }, { quoted: msg });

      // then send video file
      try {
        await conn.sendMessage(msg.from, {
          video: { url: download_url },
          fileName: `${cleanTitle}.mp4`,
          mimetype: 'video/mp4',
          caption: `✅ ${title}\n📥 Source: PrinceTech API`
        }, { quoted: msg });
      } catch (err) {
        await reply(`⚠️ Can't upload video (size or bot limit).\nDirect download: ${download_url}`);
      }
    } catch (error) {
      console.error('ytmp4x (bilal) error =>', error?.message || error);
      await reply('🚫 Unexpected error. Please try again later.');
    }
  }
};
