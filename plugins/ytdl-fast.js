const { cmd } = require('../command');
const fetch = require('node-fetch');
const yts = require('yt-search');

// HD 1080p
cmd({
    pattern: "video2hd",
    alias: ["vid2hd", "ytvideo2hd"],
    react: "🎬",
    desc: "Download YouTube video HD (1080p)",
    category: "download",
    use: ".video2hd <url or query>",
    filename: __filename
}, async (conn, m, mek, { from, q }) => {
    try {
        if (!q) return m.reply("❌ Please provide a YouTube URL or search query!");

        m.reply("⏳ Searching video...");

        let videoUrl = q;

        if (!q.match(/(youtube\.com|youtu\.be)/)) {
            const search = await yts(q);
            if (!search.videos.length) return m.reply("❌ No results found!");
            videoUrl = search.videos[0].url;
        }

        const apiUrl = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(videoUrl)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.status || !data.result?.media?.video_url_hd) {
            return m.reply("❌ HD video not available!");
        }

        const media = data.result.media;

        await conn.sendMessage(from, {
            video: { url: media.video_url_hd },
            mimetype: "video/mp4",
            caption: `✅ Downloaded HD (1080p): *${media.title}*`
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        m.reply("❌ Error: " + err.message);
    }
});

// SD 720p
cmd({
    pattern: "video2sd",
    alias: ["vid2sd", "ytvideo2sd"],
    react: "🎬",
    desc: "Download YouTube video SD (720p)",
    category: "download",
    use: ".video2sd <url or query>",
    filename: __filename
}, async (conn, m, mek, { from, q }) => {
    try {
        if (!q) return m.reply("❌ Please provide a YouTube URL or search query!");

        m.reply("⏳ Searching video...");

        let videoUrl = q;

        if (!q.match(/(youtube\.com|youtu\.be)/)) {
            const search = await yts(q);
            if (!search.videos.length) return m.reply("❌ No results found!");
            videoUrl = search.videos[0].url;
        }

        const apiUrl = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(videoUrl)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.status || !data.result?.media?.video_url) {
            return m.reply("❌ SD video not available!");
        }

        const media = data.result.media;

        await conn.sendMessage(from, {
            video: { url: media.video_url },
            mimetype: "video/mp4",
            caption: `✅ Downloaded SD (720p): *${media.title}*`
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        m.reply("❌ Error: " + err.message);
    }
});
