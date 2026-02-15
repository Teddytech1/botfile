const settings = require("../settings");
const os = require("os");
const path = require("path");
const fs = require("fs");

// Uptime formatter
function runtime(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

async function tutorialCommand(sock, chatId, message) {
    try {
        // ❤️ Reaction when command triggered
        await sock.sendMessage(chatId, {
            react: {
                text: "📸",
                key: message.key
            }
        });

        const userName = message.pushName || "User";
        const botUptime = runtime(process.uptime());
        const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
        const usedMemory = (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2);
        const host = os.platform();

        const uptimeMessage =
            `👋 \`Hello ${userName}, here is the tutorial videos\` \n\n` +
            `*This ${settings.botName || "> *TEDDY-XMD"} Whatsapp Bot tutorials. This bot is easy to deploy*\n\n` +
            `*github workflows:* coming soon~\n` +
            `*bothosting video:* ~comming soon~\n` +
            `*heroku video:* ~coming soon~\n` +
            `*${settings.botName || "Pretty md"} Online*\n\n` +
            `*🧚Follow our channel:* https://whatsapp.com/channel/0029Vb6NveDBPzjPa4vIRt3nt\n\n` +
            `> ρσωєяє∂ ву ${settings.ownerName || "Teddy Tech"}`;

        // Resolve the local image path
        const imagePath = path.resolve(__dirname, "../assets/IMG-20250819-WA0001(1).jpg");

        // Send local image
        await sock.sendMessage(chatId, {
            image: fs.readFileSync(imagePath),
            caption: uptimeMessage
        }, { quoted: message });

    } catch (error) {
        console.error("Error in alive command:", error);

        // Send fallback text
        await sock.sendMessage(chatId, {
            text: `❌ An error occurred, but here's the info:\n\n${uptimeMessage}`
        }, { quoted: message });

        await sock.sendMessage(chatId, {
            react: { text: "⚠️", key: message.key }
        });
    }
}

module.exports = tutorialCommand;
