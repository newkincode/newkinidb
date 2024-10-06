const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('setting')
	.setNameLocalizations({
		ko: '설정',
	})
	.setDescription('Setting!')
	.setDescriptionLocalizations({
		ko: '설정을 하자!',
	})
	.addSubcommand(logger =>
		logger
			.setName('logger')
			.setNameLocalizations({
				ko: '로거',
			})
			.setDescription('Setting for Logger!')
			.setDescriptionLocalizations({
				ko: '설정. 근데 이제 로거를 곁들인.',
			})
	);

// 설정된 명령어를 모듈로 내보냅니다.
module.exports = {
	data,
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'logger') {
			const channels = interaction.guild.channels.cache.filter(channel => channel.isText());

			const row = new ActionRowBuilder();

			channels.forEach(channel => {
				row.addComponents(
					new ButtonBuilder()
						.setCustomId(`set_logger_${channel.id}`)
						.setLabel(channel.name)
						.setStyle(ButtonStyle.Primary)
				);
			});

			await interaction.reply({ content: '채널을 선택하세요:', components: [row] });
		}
	}
};

// 버튼 클릭 이벤트 처리기
module.exports.handleButtonInteraction = async (interaction) => {
	if (interaction.customId.startsWith('set_logger_')) {
		const channelId = interaction.customId.split('_')[2]; // Extract the channel ID from custom ID
		const channel = interaction.guild.channels.cache.get(channelId);

		if (!channel || !channel.isText()) {
			await interaction.reply('이것은 채널이 아닙니다.'); // Handle invalid channel case
			return;
		}

		// 여기에서 선택한 채널로 로거를 설정하는 처리를 추가하세요
		await interaction.reply(`로거 채널 선택 완료: ${channel.toString()}`); // Respond with the channel mention
	} else {
		await interaction.reply('404 Not Found');
	}
};
