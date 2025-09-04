const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

// MP4 video download

cmd({
    pattern: "video",
    alias: ["videox"],
    desc: "To download videos.",
    react: "🎥",
    category: "download",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try {
    if (!q) return reply("Please give me a url or title");

    const search = await yts(q);
    const data = search.videos[0];
    const url = data.url;

    let desc = `
*███⦁BILAL-MD DOWNLOADⵊNG⦁███*

🎥 *VⵊDEO FOUND!* 

➥ *Title:* ${data.title} 
➥ *Duration:* ${data.timestamp} 
➥ *Views:* ${data.views} 
➥ *Uploaded On:* ${data.ago} 
➥ *Link:* ${data.url} 

🎬 *ENJOY THE VIDEO BROUGHT TO YOU!*

> *BILAL-MD* 
`;

    await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

    // Use new API
    let apiRes = await fetch(`https://api.giftedtech.web.id/api/download/dlmp4?apikey=gifted&url=${encodeURIComponent(url)}`);
    let json = await apiRes.json();

    if (!json.success) return reply("Failed to fetch video from new API");

    let downloadUrl = json.result.download_url;

    await conn.sendMessage(from, { video: { url: downloadUrl }, mimetype: "video/mp4" }, { quoted: mek });
    await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: json.result.title + ".mp4",
        caption: "*Powered by BILAL-MD✅*"
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`_Hi ${pushname}, retry later_`);
}
})


// MP3 song download 


cmd({
  pattern: "song",
  alias: ["play", "mp3"],
  react: "🎶",
  desc: "Download YouTube song (Audio)",
  category: "download",
  use: ".song <query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("⚠️ Please provide a song name or YouTube link.");

    const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/play?query=${encodeURIComponent(q)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.status || !data.result?.downloads) {
      return reply("❌ Song not found or API error.");
    }

    const song = data.result.metadata;
    const downloadUrl = data.result.downloads;

    await conn.sendMessage(from, {
      audio: { url: downloadUrl },
      mimetype: "audio/mpeg",
      fileName: `${song.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: song.title.length > 25 ? song.title.substring(0, 22) + "..." : song.title,
          body: `🎤 ${song.author?.name || "Unknown"} • ⏱ ${song.timestamp}`,
          thumbnailUrl: song.thumbnail,
          sourceUrl: song.url,
          mediaUrl: song.url,
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply("⚠️ An error occurred while processing your request.");
  }
});
