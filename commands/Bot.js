const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../config.json');
const ExtraFunctions = require('../classes/ExtraFunctions.js');
const Bot = require("../classes/Bot");

console.log("\u001b[32m", "[✔] Loaded Bot Permissions command", "\u001b[0m");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(config.commands.bot.name)
        .setDescription(config.commands.bot.description)
        .addSubcommand(subcommand =>
            subcommand
                .setName(config.commands.bot.subcommands.add.name)
                .setDescription(config.commands.bot.subcommands.add.description)
                .addUserOption(option => option.setName('discord').setDescription(config.commands.bot.subcommands.add.discord).setRequired(true))
                .addIntegerOption(option => option.setName('rank').setDescription(config.commands.bot.subcommands.add.rank).setRequired(false)
                    .addChoices(
                        { name: 'Admin', value: 1 },
                        { name: 'User', value: 0 }
                    )))
        .addSubcommand(subcommand =>
            subcommand
                .setName(config.commands.bot.subcommands.remove.name)
                .setDescription(config.commands.bot.subcommands.remove.description)
                .addUserOption(option => option.setName('discord').setDescription(config.commands.bot.subcommands.remove.discord).setRequired(true))),

    async execute(interaction, client) {
        let ef = new ExtraFunctions();
        ef.checkPerms(interaction.user.id).then((status) => {
            
            let userID = interaction.options.getUser('discord');
            let rank = interaction.options.getInteger('rank');
            let b = new Bot();
            if (status.rank > 0) {
               
                    // Bot add command
                    if (interaction.options.getSubcommand() === config.commands.bot.subcommands.add.name) {
                       
                        b.getUser(userID.id).then((user) => {
                            if (user.exists) {
                                interaction.reply({
                                    content: config.error.hasPerms,
                                    ephemeral: true
                                });
                            } else {
                               
                                b.addUser(userID.id, `${userID.username}#${userID.discriminator}`, rank ? rank : 0).then((status) => {
                                    
                                    if (status.inserted) {
                                        let embed = new MessageEmbed()
                                            .setTitle(config.embeds.bot.add.title)
                                            .setDescription(config.embeds.bot.add.description)
                                            .setColor(config.embeds.bot.add.color)
                                            .addFields(
                                                { name: "Discord", value: `<@!${userID.id}>` }
                                            )
                                            .setFooter({ iconUrl: config.embeds.footer.iconUrl, text: config.embeds.footer.text });
                                        interaction.reply({
                                            embeds: [embed]
                                        });
                                    } else {
                                        interaction.reply({ content: config.error.DB_error });
                                    }
                                }).catch((err) => {
                                    console.log(err);
                                    interaction.reply({ content: config.error.DB_error });
                                })
                            }
                        })
                        // Bot remove command
                    } else {
                        b.removeUser(userID.id).then((status) => {
                            if (status.deleted) {
                                let embed = new MessageEmbed()
                                    .setColor(config.embeds.bot.remove.color)
                                    .setTitle(config.embeds.bot.remove.title)
                                    .setDescription(config.embeds.bot.remove.description)
                                    .addFields(
                                        { name: "Discord", value: `<@!${userID.id}>` }
                                    )
                                    .setFooter({ iconUrl: config.embeds.footer.iconUrl, text: config.embeds.footer.text });
                                interaction.reply({
                                    embeds: [embed]
                                });
                            } else {
                                interaction.reply({
                                    content: config.error.no_user,
                                    ephemeral: true
                                });
                            }
                        }).catch(err => {
                            console.log(err);
                            interaction.reply({ content: config.error.DB_error });
                        })
                    }
            } else {
                interaction.reply({
                    content: config.error.noPermission,
                    ephemeral: true
                })
            }
        }).catch(err => {
            console.log(err);
            interaction.reply({ content: config.error.DB_error });
        })
    }
}