const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Dale un abrazo a alguien')
        .addUserOption(opt => opt.setName('usuario').setDescription('¿A quién quieres abrazar?').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const embed = new EmbedBuilder()
            .setDescription(`🤗 **${interaction.user.username}** le dio un gran abrazo a **${user.username}**`)
            .setColor('LuminousVividPink')
            .setImage('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2o0eXp6Znd6Znd6Znd6Znd6Znd6Znd6Znd6Znd6Znd6Znd6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/u9BxQbM5bxAH6/giphy.gif');
        await interaction.reply({ embeds: [embed] });
    },
};
