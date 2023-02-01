const fs = require('fs');
const Discord = require('discord.js')

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { Client, Intents, Collection } = require('discord.js');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventsFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

const config = require("./config.json");

// Crea el objeto cliente
module.exports = client = new Client({
    intents: [Intents.FLAGS.GUILDS]
});
const commands = [];
client.cooldowns = new Discord.Collection();
client.COOLDOWN_SECONDS = 3600;
const TEST_GUILD_ID = config.GUILD_ID

// Crear una colección de comandos 
client.commands = new Collection();

for (const file of eventsFiles) {
	let { event } = require(`./events/${file}`);
	console.log("\u001b[32m", `[✔] Loaded  Event`, "\u001b[0m")
}

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
console.log("\u001b[32m", `[✔] Loaded ${command.data.name} command`, "\u001b[0m");

}



client.login(config.TOKEN)
