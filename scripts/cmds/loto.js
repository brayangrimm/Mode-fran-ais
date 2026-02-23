module.exports = {
  config: {
    name: "loto",
    aliases: ["lot"],
    version: "2.0",
    author: "XxGhostxX",
    countDown: 10,
    role: 0,
    shortDescription: "Casino Naruto",
    category: "𝙅𝙀𝙐𝙓"
  },

  onStart: async function ({ args, message, usersData, event }) {

    const betType = args[0]?.toLowerCase();
    const betAmount = parseInt(args[1]);
    const userID = event.senderID;
    const userData = await usersData.get(userID);

    if (!["naruto","sasuke","sakura"].includes(betType))
      return message.reply("Choisis Naruto, Sasuke ou Sakura.");

    if (!Number.isInteger(betAmount) || betAmount < 30)
      return message.reply("Mise minimum : 30💲");

    if (betAmount > userData.money)
      return message.reply("Pas assez d'argent.");

    const slots = ["🍋","🍎","🍇","🍓","🍉","🍒","💣"];
    const spin = Array.from({length:3},()=>slots[Math.floor(Math.random()*slots.length)]);
    const spinText = spin.join(" | ");

    // 💣 bombe : si au moins une apparaît → perte
    if (spin.includes("💣")) {

      const loss = Math.floor(betAmount * 1.5);

      await usersData.set(userID,{
        money: userData.money - loss
      });

      return message.reply(
`🎰 ${spinText}

💣 BOOM !
Tu perds ${loss}💲`
      );
    }

    // 🎰 table des gains
    const roll = Math.random();
    let multiplier;

    if (roll < 0.40) multiplier = 2;
    else if (roll < 0.65) multiplier = 3;
    else if (roll < 0.80) multiplier = 4;
    else if (roll < 0.95) multiplier = 5;
    else multiplier = 10;

    const winAmount = betAmount * multiplier;

    const winText = {
      naruto: ["🔥 Naruto te porte chance !","🍜 Le ninja blond valide ton pari !"],
      sasuke: ["⚡ Sasuke t'offre la victoire.","🌀 Uchiha style, tu gagnes."],
      sakura: ["🌸 Sakura frappe fort !","💢 Sakura t’a sauvé."]
    };

    const msg = winText[betType][Math.floor(Math.random()*2)];

    await usersData.set(userID,{
      money: userData.money + winAmount
    });

    let label =
      multiplier === 10 ? "👑 JACKPOT" :
      multiplier === 5  ? "🔥 GROS GAIN" :
      multiplier === 4  ? "💎 SUPER GAIN" :
      multiplier === 3  ? "✨ BON GAIN" :
      "🎯 PETIT GAIN";

    return message.reply(
`🎰 ${spinText}

${label}
${msg}
+${winAmount}💲`
    );
  }
};