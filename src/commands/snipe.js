const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('snipe').setDescription('Muestra el último mensaje borrado en este canal'),
    async execute(interaction) {
        const msg = interaction.client.snipes?.get(interaction.channel.id);
        if (!msg) return interaction.reply({ content: 'No hay nada que recuperar aquí.', ephemeral: true });

        const embed = new EmbedBuilder()
            .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
            .setDescription(msg.content || '[Sin texto]')
            .setColor('Random')
            .setTimestamp();

        if (msg.image) embed.setImage(msg.image);

        await interaction.reply({ embeds: [embed] });
    },
};
