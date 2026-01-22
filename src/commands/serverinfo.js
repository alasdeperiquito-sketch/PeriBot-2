const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('serverinfo').setDescription('Muestra info del servidor'),
    async execute(interaction) {
        const { guild } = interaction;
        const embed = new EmbedBuilder()
            .setTitle(guild.name)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: '👑 Dueño', value: `<@${guild.ownerId}>`, inline: true },
                { name: '👥 Miembros', value: `${guild.memberCount}`, inline: true },
                { name: '📅 Creado', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true }
            )
            .setColor('Green');
        await interaction.reply({ embeds: [embed] });
    },
};
