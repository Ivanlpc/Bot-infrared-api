const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../config.json');
const ExtraFunctions = require('../classes/ExtraFunctions.js');
const API = require("../classes/API");

console.log("\u001b[32m", "[✔] Loaded Proxy-List command", "\u001b[0m");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(config.commands.proxylist.name)
        .setDescription(config.commands.proxylist.description),

    async execute(interaction, client) {
        let ef = new ExtraFunctions();
        ef.checkPerms(interaction.user.id).then((status) => {

            if (!status.hasPermission) {
                interaction.reply({ content: config.error.noPermission, ephemeral:true });
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
                                
                                let domainNames = "";

                                info.data.domainNames.forEach((element) => {
                                    domainNames += element + "\n";
                                });
                                const embed = new MessageEmbed()
                                    .setTitle(id)
                                    .setColor(config.embeds['proxy-list'].color)
                                    .setFooter({ iconUrl: config.embeds.footer.iconUrl, text: config.embeds.footer.text })
                                    .addFields(
                                        { name: config.embeds['proxy-list'].fields.domainNames, value: domainNames }
                                    )
                                interaction.editReply({ embeds: [embed], components: [] })
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
