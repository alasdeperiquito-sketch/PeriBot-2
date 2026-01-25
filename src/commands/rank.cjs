const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder().setName('rank').setDescription('Mira tu progreso de nivel'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const userId = interaction.user.id;
        const xp = await db.get(`xp_${guildId}_${userId}`) || 0;
        const lvl = await db.get(`lvl_${guildId}_${userId}`) || 0;
        const nextLvlXp = (lvl + 1) * 500;

        const embed = new EmbedBuilder()
            .setTitle(`Progreso de ${interaction.user.username}`)
            .setDescription(`**Nivel:** ${lvl}\n**XP:** ${xp} / ${nextLvlXp}`)
            .setColor('LuminousVividPink')
            .setFooter({ text: '¡Sigue enviando mensajes para subir!' });

        await interaction.reply({ embeds: [embed] });
    },
};
