const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const { token } = require('./setting/config.json');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
], 
partials: [Partials.Message, Partials.Channel, Partials.Reaction] 
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// ----[logger]---- //
client.on('messageDelete', message => {

    if (message.author && message.author.bot) {
        return; // 봇의 메시지는 무시
    }

    const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channelId}/${message.id}`;

    const embed = new EmbedBuilder()
        .setColor(0xc42f2f)
        .setTitle('Message Delete')
        .setDescription("<@" + message.author.id + ">")
        .addFields(
            { name: 'Channel', value: "<#" + message.channelId + ">" },
            { name: 'Message', value: message.content },
            { name: 'Message Link', value: messageLink }
        );

    client.channels.cache.get('1292466747819036685').send({ embeds: [embed] });
})

client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
    if (newMessage.author && newMessage.author.bot) {
        return; // 봇의 메시지는 무시
    }

    const messageLink = `https://discord.com/channels/${newMessage.guild.id}/${newMessage.channelId}/${newMessage.id}`;

    const embed = new EmbedBuilder()
        .setColor(0xf5d142)
        .setTitle('Message Edit')
        .setDescription("<@" + newMessage.author.id + ">")
        .addFields(
            { name: 'Channel', value: "<#" + newMessage.channelId + ">" },
            { name: 'Message', value: oldMessage.content + " -> " + newMessage.content },
            { name: 'Message Link', value: messageLink }
        );

    client.channels.cache.get('1292466747819036685').send({ embeds: [embed] });
});



// Log in to Discord with your client's token
client.login(token);
