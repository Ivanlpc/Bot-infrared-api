const fs = require("fs");
const client = require("..");
const botVersion = require('../package.json');

client.on('error', async (error) => {
  console.log(error);
  console.log('\x1b[31m%s\x1b[0m', `[v${botVersion.version}] If you need any support, please create a ticket in our discord server and provide the logs.txt file\n\n`);

  let errorMsg = `\n\n[${new Date().toLocaleString()}] [ERROR] [v${botVersion.version}]\n${error.stack}`;
  fs.appendFile("./logs.txt", errorMsg, (e) => {
    if (e) console.log(e);
  });
});
