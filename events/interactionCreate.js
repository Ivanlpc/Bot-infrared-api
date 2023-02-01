const client = require("..");


client.on('interactionCreate', async (interaction) => {

    if (interaction.isChatInputCommand()) {
        let command = client.getCommand(interaction.commandName)
        if (!command) return;
        try {
            await command.execute(client, interaction);
        } catch (e) {
            console.log(e)
            interaction.reply({
                content: "Hubo un error al ejecutar el comando",
                ephemeral: true
            })
        }
    }

    
})