const fs = require('fs');
const path = './usedUsers.json';

let usedUsers = {};
if (fs.existsSync(path)) {
  usedUsers = JSON.parse(fs.readFileSync(path, 'utf8'));
}

module.exports.config = {
  name: "chance",
  version: "1.0.0",
  description: "Découvre ta chance ou ta malchance ! Limité à 1 fois / 24h",
  commandCategory: "fun",
  usages: "chance",
  cooldowns: 86400
};

module.exports.onStart = async function({ api, event }) {
  const userID = event.senderID;
  const threadID = event.threadID;
  const now = Date.now();

  // Vérifie la limite 24h
  if (usedUsers[userID] && now - usedUsers[userID] < 24 * 60 * 60 * 1000) {
    return api.sendMessage(`⚠️ Vous avez déjà utilisé "CHANCE" aujourd'hui ! ⏳`, threadID);
  }

  // Envoie message initial
  const tempMessage = await api.sendMessage("⌛ Traitement en cours…", threadID);

  // Tirage chance / malchance
  const isLucky = Math.random() < 0.5;

  const texteChance = [
    "🔥 Waouh ! 100% de chance aujourd'hui, profite à fond !",
    "🎯 Aujourd'hui tout te sourit, chance maximale !"
    // … ajoute les autres phrases
  ];

  const texteMalchance = [
    "💀 Dommage, aujourd'hui tu n'as pas de chance...",
    "😞 Aujourd'hui, la malchance est avec toi..."
    // … ajoute les autres phrases
  ];

  const tirageTexte = isLucky 
    ? texteChance[Math.floor(Math.random() * texteChance.length)]
    : texteMalchance[Math.floor(Math.random() * texteMalchance.length)];

  // Récupérer le vrai nom via API si possible
  let name = "Reuf";
  try {
    const userInfo = await api.getUserInfo(userID);
    name = userInfo[userID].name || "Reuf";
  } catch(e) {
    // fallback
    name = "Reuf";
  }

  const encadrement = `
╔══════════════════════╗
║       🎲 CHANCE ◉‿◉       ║
╠══════════════════════╣
║ Utilisateur: ${name}     
║ ${tirageTexte}
╚══════════════════════╝
`;

  // Éditer le message initial
  await api.editMessage(tempMessage.messageID, encadrement);

  // Marquer utilisateur comme utilisé
  usedUsers[userID] = now;
  fs.writeFileSync(path, JSON.stringify(usedUsers, null, 2));

  // Supprimer le message après 5 minutes (300000 ms)
  setTimeout(() => {
    api.deleteMessage(tempMessage.messageID);
  }, 300000);
};
