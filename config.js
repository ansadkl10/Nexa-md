require("dotenv").config({ path: __dirname + "/config.env" });

module.exports = {
  prefix: process.env.PREFIX || ".",
  botName: process.env.BOT_NAME || "Nexa-md",
  ownerName: process.env.OWNER_NAME || "Owner",
  ownerNumber: process.env.OWNER_NUMBER || "1234567890",
  sudoNumbers: process.env.SUDO ? process.env.SUDO.split(",").map(n => n.trim()) : [],
  sessionPath: __dirname + "/auth_info",
  mode: process.env.MODE || "public",
  version: "1.0.0",
};
