module.exports = {
  config: {
    name: "bigo",
    version: "1.4",
    author: "Evariste x Stack's",
    role: 0,
    shortDescription: "🎲 BIGO - Tente de tripler ton cash",
    longDescription: "Parie ton argent et tente de le tripler avec une chance de 50%.",
    category: "games",
    guide: {
      fr: "{pn} <montant>"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const userID = event.senderID;
    const montant = parseInt(args[0]);

    if (isNaN(montant) || montant <= 0) {
      return message.reply(`╭──❌ 𝐄𝐑𝐑𝐄𝐔𝐑
│ Montant invalide
│ ➤ Utilise : bigo <montant>
╰───────────────`);
    }

    const solde = await usersData.get(userID, "money") || 0;

    if (solde < montant) {
      return message.reply(`╭──💸 𝐒𝐎𝐋𝐃𝐄 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐒𝐀𝐍𝐓
│ Ton argent : ${solde} $
│ Pari demandé : ${montant} $
╰───────────────`);
    }

    await usersData.set(userID, solde - montant, "money");

    const chance = Math.floor(Math.random() * 100) + 1;

    const winPhrases = [
      "💥 HEADSHOT ! T'as détruit le système.",
      "🔥 DOMINATION ! Rien ne peut t'arrêter.",
      "⚡ CRITIQUE ! Coup parfait.",
      "👑 KING MOVE ! Tu contrôles le jeu.",
      "💣 BOOM ! Ennemi éliminé direct."
    ];

    const losePhrases = [
      "💀 HEADSHOT REÇU ! T'es tombé net.",
      "🥀 ÉLIMINÉ... fallait réfléchir.",
      "⚰️ GAME OVER ! Mauvais move.",
      "🩸 TROP LENT... tu t'es fait avoir.",
      "😵 CRASH TOTAL ! Plus rien."
    ];

    let msg = `╭──🎲 𝐁𝐈𝐆𝐎
│ Mise : ${montant} $
│ Dé : ${chance}/100
├───────────────`;

    if (chance <= 50) {
      const gain = montant * 3;
      const nouveauSolde = await usersData.get(userID, "money") || 0;
      await usersData.set(userID, nouveauSolde + gain, "money");

      const phrase = winPhrases[Math.floor(Math.random() * winPhrases.length)];

      msg += `
│ 🎉 𝐕𝐈𝐂𝐓𝐎𝐈𝐑𝐄 !
│ Gain : +${gain} $
│ ${phrase}
╰───────────────`;
    } else {
      const phrase = losePhrases[Math.floor(Math.random() * losePhrases.length)];

      msg += `
│ 💀 𝐃𝐄𝐅𝐀𝐈𝐓𝐄...
│ Perte : -${montant} $
│ ${phrase}
╰───────────────`;
    }

    return message.reply(msg);
  }
};
