const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choose')
        .setDescription('Peri elige entre varias opciones')
        .addStringOption(opt => opt.setName('opciones').setDescription('Separa las opciones por comas (ej: Pizza, Sushi, Tacos)').setRequired(true)),
    async execute(interaction) {
        const opciones = interaction.options.getString('opciones').split(',');
        const elegida = opciones[Math.floor(Math.random() * opciones.length)].trim();
        await interaction.reply(`🤔 | He elegido: **${elegida}**`);
    },
};
