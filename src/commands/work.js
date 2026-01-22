const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder().setName('work').setDescription('Trabaja un rato para ganar alpiste'),
    async execute(interaction) {
        const randomMoney = Math.floor(Math.random() * 100) + 50;
        await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, randomMoney);

        const trabajos = ['limpiando jaulas', 'buscando semillas', 'repartiendo cartas', 'cantando en la plaza'];
        const trabajo = trabajos[Math.floor(Math.random() * trabajos.length)];

        await interaction.reply(`👨‍🌾 Has estado **${trabajo}** y ganaste **${randomMoney}** de alpiste.`);
    },
};
