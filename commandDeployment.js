const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./setting/config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] ${filePath} 파일이 "data" 또는 "execute" 속성이 없습니다.`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`등록할 애플리케이션 명령어의 수: ${commands.length}`);

		const data = await rest.put(
			Routes.applicationCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`성공적으로 ${data.length}개의 애플리케이션 명령어가 등록되었습니다.`);
	} catch (error) {
		console.error('등록 중 오류 발생:', error);
	}
})();
