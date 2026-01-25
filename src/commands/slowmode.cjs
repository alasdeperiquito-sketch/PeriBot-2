const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Ajusta el modo lento del canal')
        .addIntegerOption(opt => opt.setName('segundos').setDescription('Segundos (0 para quitar)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const seg = interaction.options.getInteger('segundos');
        await interaction.channel.setRateLimitPerUser(seg);
        await interaction.reply(`⏲️ | Modo lento ajustado a **${seg}** segundos.`);
    },
};
