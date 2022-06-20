const fs = require('fs');
const Discord = require('discord.js')

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { Client, Intents, Collection } = require('discord.js');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const config = require("./config.json");

// Crea el objeto cliente
const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
});
const commands = [];
client.cooldowns = new Discord.Collection();
client.COOLDOWN_SECONDS = 3600;
const TEST_GUILD_ID = config.GUILD_ID

// Crear una colección de comandos 
client.commands = new Collection();

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {

    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(config.TOKEN);
    (async () => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID), {
                body: commands
            },
            );

            console.log('All commands has been registered');

        } catch (error) {
            if (error) console.error(error);
        }
    })();
    console.log(`Logged as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction, client);
    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({ content: config.error.command_error_reply, ephemeral: true });
    }
});

client.login(config.TOKEN)
