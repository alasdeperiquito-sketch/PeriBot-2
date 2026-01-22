const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('Configura el sistema de tickets')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('📩 Soporte Técnico')
            .setDescription('Haz clic en el botón de abajo para abrir un ticket y hablar con el Staff.')
            .setColor('Blue');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('open_ticket').setLabel('Abrir Ticket').setStyle(ButtonStyle.Primary).setEmoji('📩')
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
