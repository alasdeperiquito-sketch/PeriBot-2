const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Reporta un mal comportamiento a los moderadores')
        .addUserOption(option => option.setName('usuario').setDescription('Usuario reportado').setRequired(true))
        .addStringOption(option => option.setName('motivo').setDescription('¿Qué hizo?').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo');
        
        // Aquí puedes poner la ID de tu canal de reportes para el Staff
        const reportChannel = interaction.guild.channels.cache.find(c => c.name === 'reportes' || c.name === 'staff-logs');

        const embed = new EmbedBuilder()
            .setTitle('⚠️ Nuevo Reporte')
            .addFields(
                { name: 'Reportado por', value: interaction.user.tag, inline: true },
                { name: 'Usuario reportado', value: user.tag, inline: true },
                { name: 'Motivo', value: reason }
            )
            .setColor('Red')
            .setTimestamp();

        if (reportChannel) {
            await reportChannel.send({ embeds: [embed] });
            await interaction.reply({ content: '✅ Tu reporte ha sido enviado al equipo de moderación.', ephemeral: true });
        } else {
            await interaction.reply({ content: '❌ No se encontró un canal llamado `reportes`. Crea uno para que esto funcione.', ephemeral: true });
        }
    },
};
