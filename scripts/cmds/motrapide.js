module.exports = {
  config: {
    name: "motrapide",
    version: "3.0",
    author: "Evariste x Stack's",
    role: 0,
    shortDescription: "⚡ BIGO - Mot rapide",
    longDescription: "Trouve un mot valide selon une lettre donnée en 30 secondes.",
    category: "games",
    guide: {
      fr: "{pn}"
    }
  },

  onStart: async function ({ message, event }) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lettre = alphabet[Math.floor(Math.random() * alphabet.length)];

    const mots = [
      "avion","arbre","animal","argent","banane","bateau","bouteille",
      "chat","chien","chaise","clavier","drapeau","dragon","école","énergie",
      "forêt","fromage","guitare","garage","hôpital","hiver","internet","image",
      "journal","jouet","kangourou","lampe","livre","maison","montagne",
      "navire","orange","ordinateur","pomme","poisson","question","robot",
      "route","soleil","stylo","table","téléphone","univers","voiture",
      "village","wagon","xylophone","yaourt","zèbre",
      "abeille","abricot","acier","adresse","adulte","balcon","batterie","bijou",
      "biscuit","boulanger","cabane","café","camion","canard","carte","danse",
      "danger","décision","dentiste","dessin","écharpe","écriture","éléphant",
      "émotion","endroit","famille","fantôme","fermier","festival","feuille",
      "gâteau","génie","geste","glace","graine","habitude","haricot","héros",
      "histoire","honneur","idée","île","impact","indice","insecte","jambe",
      "jardin","jeu","justice","jungle","kiwi","kiosque","lait","lecture",
      "légume","lumière","lundi","magie","maillot","marché","mémoire","message",
      "nature","neige","niveau","noir","nombre","objet","océan","offre","ombre",
      "outil","papier","parfum","parole","peinture","plage","qualité","quartier",
      "radio","raison","recette","regard","rivière","saison","salade","science",
      "secret","service","talent","tapis","tempête","théâtre","travail","unique",
      "usine","utile","valeur","vent","vérité","vitesse","voyage","weekend",
      "xénon","yeux","zéro","zone"
    ];

    const motsValides = mots.filter(m => m[0].toUpperCase() === lettre);

    global.motRapide = global.motRapide || {};
    global.motRapide[event.threadID] = {
      lettre,
      active: true,
      motsValides,
      timeout: null
    };

    // ⏱ TIMER 30s
    global.motRapide[event.threadID].timeout = setTimeout(() => {
      if (global.motRapide[event.threadID]?.active) {
        global.motRapide[event.threadID].active = false;

        message.reply(`╭──⏱ 𝐓𝐄𝐌𝐏𝐒 𝐄𝐂𝐎𝐔𝐋𝐄
│ Personne n'a trouvé de mot
│ Lettre : ${lettre}
╰───────────────`);
      }
    }, 30000);

    return message.reply(`╭──⚡ 𝐁𝐈𝐆𝐎 - 𝐌𝐎𝐓 𝐑𝐀𝐏𝐈𝐃𝐄
│ Lettre : ${lettre}
│
│ ⏱ Temps : 30 secondes
│ 💰 Gain : 100 $
╰───────────────`);
  },

  onChat: async function ({ message, event, usersData, api }) {
    const threadID = event.threadID;
    const content = event.body?.toLowerCase().trim();

    if (!global.motRapide || !global.motRapide[threadID] || !global.motRapide[threadID].active) return;

    const game = global.motRapide[threadID];
    if (!content) return;

    if (!game.motsValides.includes(content)) return;

    // Stop timer
    clearTimeout(game.timeout);
    game.active = false;

    const gain = 100;
    const userID = event.senderID;
    const money = await usersData.get(userID, "money") || 0;
    await usersData.set(userID, money + gain, "money");

    const userInfo = await api.getUserInfo(userID);
    const name = userInfo[userID]?.name || "Joueur";

    const winPhrases = [
      "⚡ RAPIDE ! Tu les as tous écrasés.",
      "🔥 DOMINATION ! Personne n'a suivi.",
      "💥 FIRST BLOOD ! Victoire instant.",
      "👑 ROI DU CLAVIER ! Trop rapide.",
      "🚀 SPEED MASTER ! Impossible à battre."
    ];

    const phrase = winPhrases[Math.floor(Math.random() * winPhrases.length)];

    return message.reply(`╭──🏆 𝐁𝐈𝐆𝐎 - 𝐕𝐈𝐂𝐓𝐎𝐈𝐑𝐄
│ 👤 ${name}
│ Mot : "${content}"
│ Gain : +${gain} $
│
│ ${phrase}
╰───────────────`);
  }
};
