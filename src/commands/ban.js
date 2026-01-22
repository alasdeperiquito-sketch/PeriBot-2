const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banea a un usuario del servidor')
        .addUserOption(option => option.setName('usuario').setDescription('El usuario a banear').setRequired(true))
        .addStringOption(option => option.setName('razon').setDescription('Razón del baneo'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const user = interaction.options.getMember('usuario');
        const reason = interaction.options.getString('razon') || 'No se especificó una razón.';

        if (!user.bannable) return interaction.reply({ content: 'No puedo banear a este usuario (puede que tenga un rol superior).', ephemeral: true });

        await user.ban({ reason });
        await interaction.reply(`🔨 **${user.user.tag}** ha sido baneado. Razón: ${reason}`);
    },
};
