const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sugerencia')
        .setDescription('Envía una sugerencia para el servidor')
        .addStringOption(opt => opt.setName('idea').setDescription('Escribe tu sugerencia').setRequired(true)),
    async execute(interaction) {
        const idea = interaction.options.getString('idea');
        const canal = interaction.guild.channels.cache.find(c => c.name === 'sugerencias');

        if (!canal) return interaction.reply({ content: '❌ No encontré un canal llamado `sugerencias`.', ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle('💡 Nueva Sugerencia')
            .setDescription(idea)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setColor('Yellow')
            .setTimestamp();

        const msg = await canal.send({ embeds: [embed] });
        await msg.react('✅');
        await msg.react('❌');

        await interaction.reply({ content: '✅ ¡Sugerencia enviada!', ephemeral: true });
    },
};
