const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder().setName('bal').setDescription('Mira cuánto alpiste tienes'),
    async execute(interaction) {
        const money = await db.get(`money_${interaction.guild.id}_${interaction.user.id}`) || 0;
        const level = await db.get(`lvl_${interaction.guild.id}_${interaction.user.id}`) || 0;

        const embed = new EmbedBuilder()
            .setTitle(`Cartera de ${interaction.user.username}`)
            .addFields(
                { name: '💰 Alpiste', value: `${money} unidades`, inline: true },
                { name: '⭐ Nivel', value: `${level}`, inline: true }
            )
            .setColor('Gold');
        await interaction.reply({ embeds: [embed] });
    },
};
