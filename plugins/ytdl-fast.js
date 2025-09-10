const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

// MP4 video download

cmd({
    pattern: "videox",
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


