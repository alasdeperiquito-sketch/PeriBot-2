const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Mira quién manda en el servidor'),
    async execute(interaction) {
        const guildId = interaction.guild.id;

        // Función para obtener los datos
        const getTop = async (tipo) => {
            const all = await db.all();
            const filtered = all
                .filter(item => item.id.startsWith(`${tipo}_${guildId}`))
                .sort((a, b) => b.value - a.value)
                .slice(0, 10);

            let lista = filtered.map((item, index) => {
                const userId = item.id.split('_')[2];
                return `**${index + 1}.** <@${userId}> - ${item.value} ${tipo === 'money' ? '💰' : '⭐'}`;
            }).join('\n') || 'No hay datos todavía.';

            return new EmbedBuilder()
                .setTitle(tipo === 'money' ? '🏆 Ranking de Alpiste' : '🏆 Ranking de Niveles')
                .setDescription(lista)
                .setColor(tipo === 'money' ? 'Gold' : 'LuminousVividPink');
        };

        const embed = await getTop('money');
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('top_alpiste').setLabel('Ver Alpiste').setStyle(ButtonStyle.Success).setEmoji('💰'),
            new ButtonBuilder().setCustomId('top_niveles').setLabel('Ver Niveles').setStyle(ButtonStyle.Primary).setEmoji('⭐')
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
