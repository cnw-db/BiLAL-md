const { cmd } = require('../command');

cmd({
    pattern: "add",
    alias: ["a", "invite"],
    desc: "Add a member to the group",
    category: "admin",
    react: "➕",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, isAdmins, reply
}) => {
    try {
        // Group check
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // Admin check
        if (!isAdmins) return reply("⚠️ Only group admins can use this command!");
        if (!isBotAdmins) return reply("⚠️ I need to be an admin to add members!");

        let number;
        if (m.quoted) {
            number = m.quoted.sender.split("@")[0]; // From replied message
        } else if (q && q.includes("@")) {
            number = q.replace(/[^0-9]/g, ""); // From @mention
        } else if (q && /^\d+$/.test(q)) {
            number = q; // From plain number
        } else {
            return reply("⚠️ Please reply to a user, mention a number, or type a number to add.");
        }

        const jid = number + "@s.whatsapp.net";

        // Prevent bot adding itself
        if (jid === conn.user.id) return reply("⚠️ I cannot add myself!");

        // Try to add
        await conn.groupParticipantsUpdate(from, [jid], "add");

        return conn.sendMessage(from, {
            text: `✅ Successfully added @${number}`,
            mentions: [jid]
        }, { quoted: mek });

    } catch (error) {
        console.error("Add command error:", error);
        reply("❌ Failed to add the member. They might have left recently, blocked group invites, or number is invalid.");
    }
});
