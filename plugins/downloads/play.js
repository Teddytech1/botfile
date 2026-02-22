const axios = require("axios");

module.exports = {
  command: ["play"],
  desc: "Search and play a song",
  category: "Music",
  usage: ".play <song name>",
  run: async ({ trashcore, m, args, xreply, chat }) => {
    try {
      if (!args.length) {
        return xreply("🎵 Please provide a song name\nExample: `.play Faded`");
      }

      const query = args.join(" ").slice(0, 100);
      const apiUrl = `https://api.ootaizumi.web.id/downloader/youtube/play?query=${encodeURIComponent(query)}`;

      const { data } = await axios.get(apiUrl, { timeout: 20000 });

      if (!data?.status || !data.result?.download) {
        return xreply("❌ Failed to fetch audio.");
      }

      const r = data.result;

      // Thumbnail + info
      await trashcore.sendMessage(
        chat,
        {
          image: { url: r.thumbnail },
          caption:
            `🎶 *Now Playing*\n\n` +
            `🎵 *Title:* ${r.title}\n` +
            `🎤 *Artist:* ${r.author?.name || "Unknown"}\n` +
            `⏱ *Duration:* ${r.duration?.timestamp || "N/A"}`
        },
        { quoted: m }
      );

      // Audio
      await trashcore.sendMessage(
        chat,
        {
          audio: { url: r.download },
          mimetype: "audio/mpeg",
          fileName: `${r.title}.mp3`
        },
        { quoted: m }
      );

    } catch (err) {
      console.error("❌ Play error:", err?.response?.data || err.message);
      xreply("⚠️ An error occurred while playing the song.");
    }
  }
};