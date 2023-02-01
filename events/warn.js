const fs = require("fs");
const botVersion = require('../package.json');

client.on('warn', async (message) => {
    console.log(message);
    let errorMsg = `\n\n[${new Date().toLocaleString()}] [WARN] [v${botVersion.version}]\n${message}`;
    fs.appendFile("./logs.txt", errorMsg, (e) => { 
        if(e) console.log(e);
      });
})
