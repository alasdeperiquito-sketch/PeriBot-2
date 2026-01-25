const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Mira el avatar de alguien')
        .addUserOption(opt => opt.setName('usuario').setDescription('De quién quieres ver el avatar')),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const embed = new EmbedBuilder()
            .setTitle(`Avatar de ${user.username}`)
            .setImage(user.displayAvatarURL({ size: 1024 }))
            .setColor('Random');
        await interaction.reply({ embeds: [embed] });
    },
};
