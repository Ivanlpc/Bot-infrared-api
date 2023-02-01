const REST = require("@discordjs/rest");
const Routes = require("discord-api-types/v10");
const config = require("../config.json");

client.once('ready', async (client) => {

    
        if (client.getRestCommands().length > 0) {
            const rest = new REST({
                version: '10'
            }).setToken(config.TOKEN);
            const CLIENT_ID = client.user?.id
            if (CLIENT_ID) {
                try {
                    await rest.put(
                        Routes.applicationCommands(CLIENT_ID), {
                        body: client.getRestCommands()
                        }
                    );

                    console.log('All commands has been registered');

                } catch (error) {
                    if (error) console.error(error);
                }

            }
        }
        console.log(`Logged as ${client.user?.tag}`);
        client.user.setActivity('/help', { type: ActivityType.Playing })
    
})

