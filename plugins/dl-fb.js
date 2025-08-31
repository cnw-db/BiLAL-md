const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename,
  use: "<Facebook URL>",
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("*`Need a valid Facebook URL`*\n\nExample: `.fb https://www.facebook.com/...`");
    }

    // Loading react
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // API Call
    const apiUrl = `https://supun-md-api-xmjh.vercel.app/api/download/fbdown?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.success || !data.results) {
      return reply("❌ Failed to fetch the video. Try another link.");
    }

    const { title, description, hdLink, sdLink } = data.results;

    if (!hdLink && !sdLink) return reply("❌ No downloadable link found.");

    // Show choices
    let menu = `📥 *Facebook Video Downloader*\n\n`;
    menu += `*🎬 Title:* ${title}\n`;
    menu += `*📝 Description:* ${description}\n\n`;
    menu += `🔽 Choose Quality by Replying Number:\n\n`;
    if (sdLink) menu += `1️⃣ SD Quality\n`;
    if (hdLink) menu += `2️⃣ HD Quality\n\n`;
    menu += `⚡ Reply with *1* or *2*`;

    await conn.sendMessage(from, { text: menu }, { quoted: m });

    // Create temporary store for reply
    conn.FB_DOWNLOAD = conn.FB_DOWNLOAD || {};
    conn.FB_DOWNLOAD[m.sender] = { sdLink, hdLink };

  } catch (e) {
    console.error("FB Error:", e);
    reply("❌ Error fetching the video. Please try again.");
  }
});

// Reply handler
cmd({
  on: "message"
}, async (conn, m) => {
  if (!conn.FB_DOWNLOAD) return;
  const choice = m.body?.trim();
  const user = m.sender;

  if (conn.FB_DOWNLOAD[user]) {
    const { sdLink, hdLink } = conn.FB_DOWNLOAD[user];

    if (choice === "1" && sdLink) {
      await conn.sendMessage(m.chat, {
        video: { url: sdLink },
        caption: "📥 *Facebook SD Video Downloaded*\n\n- Powered By BILAL-ᎷᎠ ✅"
      }, { quoted: m });
      delete conn.FB_DOWNLOAD[user];
    }

    if (choice === "2" && hdLink) {
      await conn.sendMessage(m.chat, {
        video: { url: hdLink },
        caption: "📥 *Facebook HD Video Downloaded*\n\n- Powered By BILAL-ᎷᎠ ✅"
      }, { quoted: m });
      delete conn.FB_DOWNLOAD[user];
    }
  }
});
