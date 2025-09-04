// ytmp4.js
// ESM plugin for a Baileys-style WhatsApp bot (WHITESHADOW-MD style).
// Command name: ytmp4
// Usage: .ytmp4 <youtube-url>
// Dependencies: axios
import axios from 'axios';
import { fileTypeFromBuffer } from 'file-type'; // optional but helpful

export default {
  name: 'video',
  alias: ['ytmp4', 'ytmp'],
  desc: 'Download YouTube mp4 via Kaizenji API — first send details, then send video',
  async exec(m, { conn, args, usedPrefix, command }) {
    try {
      const url = (args && args[0]) ? args[0] : null;
      if (!url) {
        return conn.sendMessage(m.chat, { text: `Usage: ${usedPrefix}${command} <youtube_url>` }, { quoted: m });
      }

      // Build API URL (example encoded form). Replace apikey if you want dynamic.
      const apiKey = '8e3b0d39-d9d4-47a1-a125-0801eb103e7f';
      const api = `https://kaiz-apis.gleeze.com/api/ytmp4?url=${encodeURIComponent(url)}&quality=360&apikey=${apiKey}`;

      // Inform user we're fetching details
      await conn.sendMessage(m.chat, { text: '🔎 Getting video details...' }, { quoted: m });

      const res = await axios.get(api, { timeout: 20000 });
      if (!res || !res.data) throw new Error('Empty response from API');

      const data = res.data;
      // expected keys: author, title, thumbnail, download_url, quality
      const { author, title, thumbnail, download_url: downloadUrl, quality } = data;

      if (!title || !downloadUrl) {
        return conn.sendMessage(m.chat, { text: '❌ API returned incomplete data.' }, { quoted: m });
      }

      // Prepare details caption
      const caption =
`🎬 Title: ${title}
👤 Author: ${author || 'Unknown'}
📺 Quality: ${quality || 'Unknown'}
🔗 Source: ${url}

▶️ Sending video now...`;

      // First send thumbnail + details message (image with caption)
      try {
        if (thumbnail) {
          // send thumbnail as image with caption
          await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption
          }, { quoted: m });
        } else {
          await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
        }
      } catch (errThumb) {
        // If thumbnail send fails, still send text details
        await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
      }

      // Now download the video (arraybuffer) - careful with big files
      await conn.sendMessage(m.chat, { text: '⬇️ Downloading video... (may take a moment)' }, { quoted: m });

      const dlResp = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
        timeout: 120000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const buffer = Buffer.from(dlResp.data);

      // Check file type (optional)
      let mime = 'video/mp4';
      try {
        const ft = await fileTypeFromBuffer(buffer);
        if (ft && ft.mime) mime = ft.mime;
      } catch (e) {
        // ignore
      }

      // If file is very large (> 100 MB) better to send as document or send the direct link
      const MAX_SEND_BYTES = 100 * 1024 * 1024; // 100 MB threshold (adjust as needed)
      if (buffer.length > MAX_SEND_BYTES) {
        // send as document with caption OR fallback to send link only
        try {
          await conn.sendMessage(m.chat, {
            document: buffer,
            fileName: `${title.replace(/[/\\?%*:|"<>]/g, '').slice(0, 60)}.mp4`,
            mimetype: mime,
            caption: `📦 File is large (${(buffer.length / (1024*1024)).toFixed(2)} MB). Sending as document.`
          }, { quoted: m });
        } catch (errDoc) {
          // if even that fails, provide the download link for manual download
          await conn.sendMessage(m.chat, {
            text: `⚠️ Video is too large to send. Download it directly: ${downloadUrl}`
          }, { quoted: m });
        }
      } else {
        // send as video (native playback)
        try {
          await conn.sendMessage(m.chat, {
            video: buffer,
            caption: `▶️ ${title}\nUploaded by: ${author || 'Unknown'}`,
            mimetype: mime,
            fileName: `${title.replace(/[/\\?%*:|"<>]/g, '').slice(0, 60)}.mp4`,
            // you can set gifPlayback: true if you want animated preview for short clips
          }, { quoted: m });
        } catch (errVideo) {
          // fallback: send as document
          try {
            await conn.sendMessage(m.chat, {
              document: buffer,
              fileName: `${title.replace(/[/\\?%*:|"<>]/g, '').slice(0, 60)}.mp4`,
              mimetype: mime,
              caption: `⚠️ Couldn't send as native video. Sending as file.`
            }, { quoted: m });
          } catch (errDoc2) {
            // final fallback: send link
            await conn.sendMessage(m.chat, {
              text: `⚠️ Couldn't send file. Download link: ${downloadUrl}`
            }, { quoted: m });
          }
        }
      }

    } catch (err) {
      console.error(err);
      const emsg = (err && err.response && err.response.data) ? JSON.stringify(err.response.data).slice(0, 1000) : (err.message || String(err));
      await conn.sendMessage(m.chat, { text: `❌ Error: ${emsg}` }, { quoted: m });
    }
  }
};
