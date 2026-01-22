const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsa a un usuario del servidor')
        .addUserOption(option => option.setName('usuario').setDescription('El usuario a expulsar').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const user = interaction.options.getMember('usuario');
        if (!user.kickable) return interaction.reply({ content: 'No puedo expulsar a este usuario.', ephemeral: true });

        await user.kick();
        await interaction.reply(`👢 **${user.user.tag}** ha sido expulsado.`);
    },
};
