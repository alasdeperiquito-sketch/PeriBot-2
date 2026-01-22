const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Muestra información de un usuario')
        .addUserOption(opt => opt.setName('objetivo').setDescription('El usuario a consultar')),
    async execute(interaction) {
        const user = interaction.options.getUser('objetivo') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);

        const embed = new EmbedBuilder()
            .setTitle(`Información de ${user.username}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: '🆔 ID', value: user.id, inline: true },
                { name: '📅 Se unió a Discord', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '📥 Se unió al servidor', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true }
            )
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
