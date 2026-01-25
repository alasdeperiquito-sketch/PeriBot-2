const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Crea una encuesta de Sí o No')
        .addStringOption(opt => opt.setName('pregunta').setDescription('¿Qué quieres preguntar?').setRequired(true)),
    async execute(interaction) {
        const pregunta = interaction.options.getString('pregunta');
        const embed = new EmbedBuilder()
            .setTitle('📊 Encuesta')
            .setDescription(pregunta)
            .setFooter({ text: `Preguntado por ${interaction.user.username}` })
            .setColor('Yellow');

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        await message.react('✅');
        await message.react('❌');
    },
};
