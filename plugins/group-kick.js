const { cmd } = require('../command');

cmd({
    pattern: "kick",
    alias: ["remove"],
    react: "⚠️",
    desc: "Remove a mentioned user from the group.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, args }) => {
    try {
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");
        if (!isAdmins) return reply("⚠️ Only group admins can use this command!");
        if (!isBotAdmins) return reply("⚠️ I need to be an admin to execute this command!");

        let target;
        if (m.quoted) {
            target = m.quoted.sender;
        } else if (args[0]) {
            target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        } else {
            return reply("⚠️ Please reply to the user's message or mention the user you want to kick!");
        }

        const groupMetadata = await robin.groupMetadata(from);
        const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

        if (groupAdmins.includes(target)) return reply("⚠️ I cannot remove another admin from the group!");
        if (target === robin.user.id) return reply("⚠️ I cannot remove myself!");

        await robin.groupParticipantsUpdate(from, [target], "remove");
        return robin.sendMessage(from, { text: `✅ Successfully removed: @${target.split('@')[0]}`, mentions: [target] }, { quoted: mek });

    } catch (e) {
        console.error("Kick Error:", e);
        reply(`❌ Failed to remove the user. Error: ${e.message}`);
    }
});
