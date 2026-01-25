const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Tira un dado de 6 caras'),
    async execute(interaction) {
        const resultado = Math.floor(Math.random() * 6) + 1;
        await interaction.reply(`🎲 | Has sacado un **${resultado}**.`);
    },
};
