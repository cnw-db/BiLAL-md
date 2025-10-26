//═══════════════════════════════════════════════//
//                BILAL-MD                 //
//═══════════════════════════════════════════════//
//  ⚡ Feature : AntiBot System
//  👑 Developer : Chamod Nimsara (WhiteShadow)
//  📡 Channel   : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110
//═══════════════════════════════════════════════//

const { cmd } = require('../command');
const fs = require('fs');
const filePath = './plugins/antibot-status.json';

// ✅ Create antibot status file if missing
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ enabled: false }, null, 2));
}

// ✅ Load antibot status
let antibotStatus = JSON.parse(fs.readFileSync(filePath));

// 💾 Save function
function saveStatus() {
    fs.writeFileSync(filePath, JSON.stringify(antibotStatus, null, 2));
}

// 🔢 Message counter for suspected bots
let botMessageCount = {};

//==============================//
//   🧠 COMMAND: .antibot on/off
//==============================//
cmd({
    pattern: "antibot",
    alias: ["botblock", "banbot"],
    desc: "Enable or disable AntiBot system in the group.",
    category: "group",
    react: "🛡️",
    use: ".antibot on/off",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    const args = q.trim().toLowerCase();

    if (args === 'on') {
        antibotStatus.enabled = true;
        saveStatus();
        reply('✅ *AntiBot Activated!*\nSuspicious bot IDs will be auto-detected and removed.');
    } else if (args === 'off') {
        antibotStatus.enabled = false;
        saveStatus();
        reply('🚫 *AntiBot Deactivated!*\nBot messages will no longer be monitored.');
    } else {
        reply(`⚙️ *Usage:*\n> .antibot on\n> .antibot off\n\n*Current:* ${antibotStatus.enabled ? '✅ ON' : '❌ OFF'}`);
    }
});

//==============================//
//   🤖 AUTO CHECK HANDLER
//==============================//
cmd({
    on: "message"
}, async (conn, mek, m, { isAdmin, isBotAdmin }) => {
    try {
        if (!m.isGroup || m.fromMe) return;
        if (!antibotStatus.enabled) return;

        // 📜 Regex patterns for bot message IDs
        const botPatterns = [
            /^3EBO/, /^4EBO/, /^5EBO/, /^6EBO/, /^7EBO/, /^8EBO/,
            /^9EBO/, /^AEBO/, /^BEBO/, /^CEBO/, /^DEBO/, /^EEBO/,
            /^FEBO/, /^ABE5/, /^BAE7/, /^CAEBO/, /^DAEBO/, /^FAEBO/
        ];

        // 🕵️ Check for suspected bot message
        if (botPatterns.some(rx => rx.test(m.key.id)) && m.key.remoteJid.endsWith('@g.us')) {
            const sender = m.key.participant;
            botMessageCount[sender] = (botMessageCount[sender] || 0) + 1;

            console.log(`🤖 Detected possible bot: ${sender} (${botMessageCount[sender]} messages)`);

            // 🚨 If same sender sends 5+ suspicious messages
            if (botMessageCount[sender] >= 5) {
                if (isBotAdmin) {
                    await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
                    await conn.sendMessage(m.chat, {
                        text: `🚫 *BOT REMOVED!*\n@${sender.split('@')[0]} sent 5 suspicious bot-like messages.`,
                        mentions: [sender]
                    });
                    delete botMessageCount[sender];
                } else {
                    m.reply('⚠️ I am not an admin, so I cannot remove suspected bots.');
                }
            }
        }
    } catch (e) {
        console.error('AntiBot Error:', e);
    }
});
