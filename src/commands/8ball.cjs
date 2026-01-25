const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Pregúntale algo al destino')
        .addStringOption(opt => opt.setName('pregunta').setDescription('Tu pregunta').setRequired(true)),
    async execute(interaction) {
        const respuestas = ['Sí', 'No', 'Tal vez', 'Pregunta más tarde', 'Definitivamente sí', 'Ni lo sueñes'];
        const r = respuestas[Math.floor(Math.random() * respuestas.length)];
        await interaction.reply(`🎱 | ${interaction.user.username} preguntó: *${interaction.options.getString('pregunta')}*\n**Respuesta:** ${r}`);
    },
};
