const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../config.json');
const ExtraFunctions = require('../classes/ExtraFunctions.js');
const API = require("../classes/API");
const MCSrvStatus = require('../classes/MCSrvStatus.js');

console.log("\u001b[32m", "[✔] Loaded Proxy-List command", "\u001b[0m");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(config.commands.proxylist.name)
        .setDescription(config.commands.proxylist.description),

    async execute(interaction, client) {
        let ef = new ExtraFunctions();
        ef.checkPerms(interaction.user.id).then((status) => {

            if (!status.hasPermission) {
                interaction.reply({ content: config.error.noPermission, ephemeral: true });
            } else {
                a = new API();

                a.getProxyList().then(async (response) => {

                    const selector = new MessageSelectMenu()
                        .setCustomId('selector')
                        .setPlaceholder(config.commands.proxylist["select-menu"])

                    response.data.forEach((server) => {
                        selector.addOptions([
                            {
                                label: server,
                                value: server
                            }
                        ])
                    })

                    const row = new MessageActionRow().addComponents(selector);

                    await interaction.reply({ components: [row] });

                    const filter = (interactionB) => {                                  //Pone un filtro para que sólamente pueda reaccionar el que hizo el comando
                        if (interactionB.user.id === interaction.user.id) return true;
                        return interactionB.reply({ content: config.error.reaction_error, ephemeral: true });
                    };
                    let collector = await interaction.channel.createMessageComponentCollector({       //Crea un collector que está pendiente de las reacciones de los botones
                        filter,
                        max: 1,
                        time: 10000

                    });
                    collector.on("end", async (SelectorInteraction) => {
                        try {
                            let id = SelectorInteraction.first().values[0];
                            a.getProxyInfo(id).then((info) => {
                                let mc = new MCSrvStatus();
                                mc.getServerInformation(info.data.domainNames[0]).then((server) => {
                                   
                                    let embed = new MessageEmbed()
                                        .setTitle(config.embeds.serverinfo.title)
                                        .setColor(config.embeds.serverinfo.color)
                                        .setFooter({ iconUrl: config.embeds.footer.iconUrl, text: config.embeds.footer.text })
                                        .setImage(`${config.STATUS_IMG_URL}${server.hostname}/${server.port}/banner.png`)

                                    if (server.online) {

                                        embed.setThumbnail(`${config.ICON_URL}${server.hostname}`)
                                            .setDescription(
                                                config.embeds.serverinfo.server + ": `" + server.hostname + "`\n" +
                                                config.embeds.serverinfo.ip + ": `" + server.ip + "`\n" +
                                                config.embeds.serverinfo.version + ": `" + server.version + "`\n" +
                                                config.embeds.serverinfo.online + ": `" + server.players.online + " / " + server.players.max + "`\n" +
                                                config.embeds.serverinfo.protected.name + ": `" + (server.protected ? config.embeds.serverinfo.protected.yes : config.embeds.serverinfo.protected.no) + "`")
                                            .setThumbnail(`${config.ICON_URL}${server.hostname}`)

                                    } else {

                                        embed.setThumbnail(config.embeds.serverinfo.offline_thumbnail)
                                            .setDescription(
                                                config.embeds.serverinfo.server + ": `" + server.hostname + "`\n" +
                                                config.embeds.serverinfo.ip + ": `" + server.ip + "`\n" +
                                                config.embeds.serverinfo.port + ": `" + server.port + "`");
                                    }
                                    interaction.editReply({ embeds: [embed], components: [] })
                                })

                            }).catch((err) => {
                                console.log(err);
                                interaction.editReply({ content: config.error.API_error, components: [] })
                            })
                        } catch (err) {
                            interaction.deleteReply();
                        }
                    })


                }).catch(err => { interaction.reply({ content: config.error.command_error_reply }); console.log(err) })
            }
        }).catch((err) => {
            console.log(err)
            interaction.reply({ content: config.error.command_error_reply, ephemeral: true });
        })

    }
}
