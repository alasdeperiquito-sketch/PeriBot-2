const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Apuesta tu alpiste en la máquina tragaperras')
        .addIntegerOption(opt => opt.setName('apuesta').setDescription('Cantidad a apostar').setRequired(true)),
    async execute(interaction) {
        const apuesta = interaction.options.getInteger('apuesta');
        const balance = await db.get(`money_${interaction.guild.id}_${interaction.user.id}`) || 0;

        if (apuesta > balance || apuesta <= 0) return interaction.reply('❌ No tienes tanto alpiste o la apuesta es inválida.');

        const slots = ['🍎', '🍐', '🍋', '💎', '🔔'];
        const res = [slots[Math.floor(Math.random() * slots.length)], slots[Math.floor(Math.random() * slots.length)], slots[Math.floor(Math.random() * slots.length)]];

        if (res[0] === res[1] && res[1] === res[2]) {
            await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, apuesta * 3);
            await interaction.reply(`🎰 | ${res.join(' ')} | **¡JACKPOT!** Ganaste ${apuesta * 3} de alpiste.`);
        } else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
            await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, apuesta);
            await interaction.reply(`🎰 | ${res.join(' ')} | **¡Pareja!** Recuperas tu apuesta.`);
        } else {
            await db.sub(`money_${interaction.guild.id}_${interaction.user.id}`, apuesta);
            await interaction.reply(`🎰 | ${res.join(' ')} | **Perdiste.** Mejor suerte la próxima vez.`);
        }
    },
};
