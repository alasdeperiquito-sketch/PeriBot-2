const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Obtén el enlace para invitar a PeriBot'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('¡Invita a PeriBot a tu servidor!')
            .setDescription('Haz clic en el botón de abajo para añadirme y empezar a configurar el dashboard.')
            .setColor('Blue');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invitar Bot')
                .setURL(`https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`)
                .setStyle(ButtonStyle.Link)
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
