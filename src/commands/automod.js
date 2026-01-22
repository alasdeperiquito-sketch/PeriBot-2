const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Plantea una pregunta y decide si abrir un hilo para la respuesta')
        .addStringOption(option => 
            option.setName('pregunta')
                .setDescription('Tu pregunta para la IA')
                .setRequired(true)),
    async execute(interaction) {
        const pregunta = interaction.options.getString('pregunta');

        const embed = new EmbedBuilder()
            .setTitle('❓ Nueva Consulta a la IA')
            .setDescription(`**Pregunta:** ${pregunta}\n\n¿Quieres abrir un hilo para recibir la respuesta de PeriBot?`)
            .setColor('Blue')
            .setFooter({ text: `Solicitado por ${interaction.user.username}` });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`confirm_ask_${interaction.user.id}`) // Guardamos el ID para que solo él pueda darle
                .setLabel('Abrir Hilo y Responder')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🧵')
        );

        // Guardamos la pregunta en el embed para leerla luego
        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
