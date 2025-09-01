const { cmd } = require('../command');
const axios = require('axios');

// ===============================
// Pair 1 (BILAL-MD)
// ===============================
cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for BILAL-MD bot",
    category: "download",
    use: ".pair +947XXXXXXXX",
    filename: __filename
}, async (conn, mek, m, { q, senderNumber, reply }) => {
    try {
        const phoneNumber = q ? q.trim() : senderNumber;

        if (!phoneNumber || !phoneNumber.match(/^\+?\d{10,15}$/)) {
            return await reply("❌ Please provide a valid phone number with country code\nExample: .pair +94XXXXXXXXX");
        }

        // Fetch HTML page from Heroku site
        const res = await axios.get(`https://bilalmd-pair-602d1996abb2.herokuapp.com/pair?phone=${encodeURIComponent(phoneNumber)}`);
        const html = res.data;

        // Extract code (search for CODE: XXXXXXX)
        const match = html.match(/CODE:\s*([A-Z0-9]+)/i);
        if (!match) {
            return await reply("❌ Could not extract pairing code. Try again later.");
        }

        const pairingCode = match[1];
        const doneMessage = "> *BILAL-MD PAIRING COMPLETED*";

        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);

        await new Promise(resolve => setTimeout(resolve, 2000));

        await reply(`${pairingCode}`);

    } catch (err) {
        console.error("Pair1 command error:", err);
        await reply("❌ Error while getting BILAL-MD pairing code.");
    }
});

// ===============================
// Pair 2 (WHITESHADOW-MD)
// ===============================
cmd({
    pattern: "pair2",
    alias: ["getpair2", "clonebot2"],
    react: "✅",
    desc: "Get pairing code for biLAL-MD bot",
    category: "download",
    use: ".pair2 +947XXXXXXXX",
    filename: __filename
}, async (conn, mek, m, { q, senderNumber, reply }) => {
    try {
        const phoneNumber = q ? q.trim() : senderNumber;

        if (!phoneNumber || !phoneNumber.match(/^\+?\d{10,15}$/)) {
            return await reply("❌ Please provide a valid phone number with country code\nExample: .pair2 +94XXXXXXXXX");
        }

        // Fetch HTML page from Heroku site
        const res = await axios.get(`https://ilmd-pair-602d1996abb2.herokuapp.com/pair?phone=${encodeURIComponent(phoneNumber)}`);
        const html = res.data;

        // Extract code (search for CODE: XXXXXXX)
        const match = html.match(/CODE:\s*([A-Z0-9]+)/i);
        if (!match) {
            return await reply("❌ Could not extract pairing code. Try again later.");
        }

        const pairingCode = match[1];
        const doneMessage = "> *BiLAL-MD PAIRING COMPLETED*";

        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);

        await new Promise(resolve => setTimeout(resolve, 2000));

        await reply(`${pairingCode}`);

    } catch (err) {
        console.error("Pair2 command error:", err);
        await reply("❌ Error while getting BiLAL-MD pairing code.");
    }
});
