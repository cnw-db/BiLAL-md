const axios = require("axios");
const cheerio = require('cheerio');
const { cmd, commands } = require('../command')
const config = require('../config');
const {fetchJson} = require('../lib/functions');

const api = `https://nethu-api-ashy.vercel.app`;

cmd({
  pattern: "facebook2",
  react: "🎥",
  alias: ["fbb2", "fbvideo2", "fb2"],
  desc: "Download videos from Facebook",
  category: "download",
  use: '.facebook <facebook_url>',
  filename: __filename
},
async(conn, mek, m, {
    from, prefix, q, reply
}) => {
  try {
  if (!q) return reply("🚩 Please give me a facebook url");

  const fb = await fetchJson(`${api}/download/fbdown?url=${encodeURIComponent(q)}`);
  
  if (!fb.result || (!fb.result.sd && !fb.result.hd)) {
    return reply("I couldn't find anything :(");
  }

  let caption = `*BILAL-MD*

📝 ᴛɪᴛʟᴇ : Facebook video
🦸‍♀️ ᴘᴏᴡᴇʀᴇᴅ ʙʏ : BILAL-MD
🔗 ᴜʀʟ : ${q}`;


  if (fb.result.thumb) {
    await conn.sendMessage(from, {
      image: { url: fb.result.thumb },
      caption : caption,
      }, mek);
  }

    if (fb.result.sd) {
      await conn.sendMessage(from, {
        video: { url: fb.result.sd },
        mimetype: "video/mp4",
        caption: `*SD-Quality*`
      }, { quoted: mek });
    }

if (fb.result.hd) {
      await conn.sendMessage(from, {
        video: { url: fb.result.hd },
        mimetype: "video/mp4",
        caption: `*HD-Quality*`
      }, { quoted: mek });
    }

} catch (err) {
  console.error(err);
  reply("*ERROR*");
  }
});
