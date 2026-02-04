// bankData.js
const { existsSync, writeJsonSync, readJSONSync } = require("fs-extra");
const path = require("path");
const _ = require("lodash");

module.exports = async function (databaseType, bankModel) {
    const pathBankData = path.join(__dirname, "..", "data/bankData.json");
    let Bank = [];

    // Chargement initial (Similaire à usersData.js)
    if (databaseType === "json") {
        if (!existsSync(pathBankData)) writeJsonSync(pathBankData, [], { spaces: 2 });
        Bank = readJSONSync(pathBankData);
    }
    global.db.allBankData = Bank;

    return {
        get: async (userID) => {
            return global.db.allBankData.find(i => i.userID == userID);
        },
        create: async (userID) => {
            const newData = {
                userID,
                balance: 0,
                savings: 0,
                vault: 0,
                loan: 0,
                loanDate: null,
                creditScore: 600,
                bankLevel: 1,
                premium: false,
                multiplier: 1,
                streak: 0,
                reputation: 0,
                lastInterest: Date.now(),
                transactions: [],
                achievements: [],
                stocks: {},
                crypto: {},
                realEstate: [],
                businesses: [],
                vehicles: [],
                skills: { gambling: 0, trading: 0, business: 0, investing: 0 }
            };
            global.db.allBankData.push(newData);
            if (databaseType === "json") writeJsonSync(pathBankData, global.db.allBankData, { spaces: 2 });
            return newData;
        },
        set: async (userID, data) => {
            let index = global.db.allBankData.findIndex(i => i.userID == userID);
            if (index !== -1) {
                global.db.allBankData[index] = { ...global.db.allBankData[index], ...data };
                if (databaseType === "json") writeJsonSync(pathBankData, global.db.allBankData, { spaces: 2 });
                return global.db.allBankData[index];
            }
        }
    };
};
