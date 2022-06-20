const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../config.json');
const MCSrvStatus = require('../classes/MCSrvStatus');

console.log("\u001b[32m", "[✔] Loaded Server-Info command", "\u001b[0m");

module.exports = {

    data: new SlashCommandBuilder()
        .setName(config.commands.serverinfo.name)
        .setDescription(config.commands.serverinfo.description)
        .addStringOption(option => option.setName('ip').setDescription(config.commands.serverinfo.ip).setRequired(true)),

    async execute(interaction, client) {
        let mc = new MCSrvStatus();
        mc.getServerInformation(interaction.options.getString('ip')).then(async response => {
            let embed = new MessageEmbed()
                .setTitle(config.embeds.serverinfo.title)
                .setColor(config.embeds.serverinfo.color)
                .setFooter({ iconUrl: config.embeds.footer.iconUrl, text: config.embeds.footer.text })
                .setImage(`${config.STATUS_IMG_URL}${response.hostname}/${response.port}/banner.png`)

            if (response.online) {

                embed.setThumbnail(`${config.ICON_URL}${response.hostname}`)
                    .setDescription(
                        config.embeds.serverinfo.server + ": `"+ response.hostname +"`\n" + 
                    config.embeds.serverinfo.ip + ": `" + response.ip + "`\n" +
                    config.embeds.serverinfo.version + ": `" + response.version + "`\n" +
                    config.embeds.serverinfo.online + ": `" + response.players.online + " / " + response.players.max + "`\n" +
                    config.embeds.serverinfo.protected.name + ": `" + (response.protected ? config.embeds.serverinfo.protected.yes : config.embeds.serverinfo.protected.no) + "`")
                    .setThumbnail(`${config.ICON_URL}${response.hostname}`)

            } else {

                embed.setThumbnail(config.embeds.serverinfo.offline_thumbnail)
                    .setDescription(
                config.embeds.serverinfo.server+ ": `" + response.hostname + "`\n" + 
                config.embeds.serverinfo.ip + ": `" + response.ip + "`\n" +
                config.embeds.serverinfo.port + ": `" + response.port + "`");
            }

            await interaction.reply({ embeds: [embed] })

        })
    }

}