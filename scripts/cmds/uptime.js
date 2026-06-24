const os = require("os");

module.exports = {

  config: {
    name: "uptime",
    aliases: ["up", "ut"],
    version: "5.2",
    author: "Crimson",
    countDown: 5,
    role: 0,
    shortDescription: {
      fr: "Statut complet du bot"
    },
    category: "info"
  },


  onStart: async function ({ message }) {

    const adminName = "Crimson Administration"; // change ici

    const images = [
      "https://i.ibb.co/FqxFFdsN/724445663-994099853547199-5777702525822511869-n-jpg-stp-dst-jpg-s480x480-tt6-nc-cat-110-ccb-1-7-nc.jpg",
      "https://i.ibb.co/xqDXzMfF/728490763-1429022605913776-7295616967194994570-n-jpg-stp-dst-jpg-p480x480-tt6-nc-cat-107-ccb-1-7-n.jpg",
      "https://i.ibb.co/jZgyKGGn/541586638-1960318068060545-1824596428901731723-n-jpg-stp-dst-jpg-s480x480-tt6-nc-cat-102-ccb-1-7-n.jpg"
    ];

    const img =
      images[Math.floor(Math.random() * images.length)];


    const uptime = process.uptime();

    const d = Math.floor(uptime / 86400);
    const h = Math.floor((uptime % 86400) / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);


    const body = `
╭━━━━━━ 🌸 𝐌𝐀𝐑𝐈𝐍 𝐊𝐈𝐓𝐀𝐆𝐀𝐖𝐀 🌸 ━━━━━━╮

👋 Salut ✨

🤖 𝐁𝐎𝐓 𝐒𝐓𝐀𝐓𝐔𝐒

🟢 Statut :
『 En ligne ✅ 』

⏱️ Uptime :
${d}j ${h}h ${m}m ${s}s

⚡ Ping :
${Date.now() % 150} ms

📦 Commandes :
${global.GoatBot.commands.size}

💾 RAM :
${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB

👑 Administration :
『 ${adminName} 』

🖥️ Système :
${os.platform()} ${os.arch()}

🌸 Mode :
『 Marin Kitagawa AI 』

╰━━━━━━━━━━━━━━━━━━╯
`;

    await message.reply({
      body,
      attachment: await global.utils.getStreamFromURL(img)
    });

  }
};
