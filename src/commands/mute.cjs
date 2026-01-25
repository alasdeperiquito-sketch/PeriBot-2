const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Silencia a un usuario temporalmente')
        .addUserOption(option => option.setName('usuario').setDescription('Usuario a silenciar').setRequired(true))
        .addIntegerOption(option => option.setName('tiempo').setDescription('Minutos de silencio').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const user = interaction.options.getMember('usuario');
        const minutes = interaction.options.getInteger('tiempo');

        try {
            await user.timeout(minutes * 60 * 1000);
            await interaction.reply(`🔇 **${user.user.tag}** ha sido silenciado por ${minutes} minutos.`);
        } catch (e) {
            await interaction.reply({ content: 'No pude silenciar al usuario.', ephemeral: true });
        }
    },
};
