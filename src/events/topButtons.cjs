const { Events } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'top_alpiste' && interaction.customId !== 'top_niveles') return;

        const tipo = interaction.customId === 'top_alpiste' ? 'money' : 'lvl';
        const guildId = interaction.guild.id;

        const all = await db.all();
        const filtered = all
            .filter(item => item.id.startsWith(`${tipo}_${guildId}`))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        const lista = filtered.map((item, index) => {
            const userId = item.id.split('_')[2];
            return `**${index + 1}.** <@${userId}> - ${item.value} ${tipo === 'money' ? '💰' : '⭐'}`;
        }).join('\n') || 'No hay datos todavía.';

        const newEmbed = interaction.message.embeds[0].toJSON();
        newEmbed.title = tipo === 'money' ? '🏆 Ranking de Alpiste' : '🏆 Ranking de Niveles';
        newEmbed.description = lista;
        newEmbed.color = tipo === 'money' ? 0xFFD700 : 0xFF00FF;

        await interaction.update({ embeds: [newEmbed] });
    },
};
