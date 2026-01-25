const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Solo actuar si es un botón y es el nuestro
        if (!interaction.isButton() || interaction.customId !== 'crear_hilo_peri') return;

        try {
            // Verificamos si el mensaje ya tiene un hilo
            if (interaction.message.thread) {
                return interaction.reply({ content: `¡Ya hay un hilo aquí! -> <#${interaction.message.thread.id}>`, ephemeral: true });
            }

            // Crear el hilo directamente
            const thread = await interaction.message.startThread({
                name: `Charla con Peri - ${interaction.user.username}`,
                autoArchiveDuration: 60,
            });

            // Respondemos una sola vez
            await interaction.reply({ content: `🧵 ¡Hilo creado! <#${thread.id}>`, ephemeral: true });
            await thread.send(`¡Hola <@${interaction.user.id}>! Mencióname aquí para que recuerde lo que decimos.`);
            
        } catch (error) {
            console.error("Error hilos:", error);
            if (!interaction.replied) {
                await interaction.reply({ content: "❌ Necesito permiso de 'Gestionar Hilos'.", ephemeral: true });
            }
        }
    },
};
