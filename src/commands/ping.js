const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Revisa la velocidad del bot'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pingenando...', fetchReply: true, ephemeral: true });
        const ping = sent.createdTimestamp - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Latencia del Bot', value: `${ping}ms`, inline: true },
                { name: 'Latencia de la API', value: `${interaction.client.ws.ping}ms`, inline: true }
            )
            .setColor('Purple');
        await interaction.editReply({ content: null, embeds: [embed] });
    },
};
