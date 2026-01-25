const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Borra una cantidad de mensajes')
        .addIntegerOption(opt => opt.setName('cantidad').setDescription('Número de mensajes (1-100)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const cantidad = interaction.options.getInteger('cantidad');
        if (cantidad < 1 || cantidad > 100) return interaction.reply({ content: 'Dime un número entre 1 y 100.', ephemeral: true });

        await interaction.channel.bulkDelete(cantidad, true);
        await interaction.reply({ content: `🧹 Se han borrado ${cantidad} mensajes.`, ephemeral: true });
    },
};
