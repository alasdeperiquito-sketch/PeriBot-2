const { Events, ChannelType } = require('discord.js');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton() || !interaction.customId.startsWith('confirm_ask_')) return;

        const autorId = interaction.customId.split('_')[2];

        // Opcional: Solo el que preguntó puede darle al botón
        if (interaction.user.id !== autorId) {
            return interaction.reply({ content: "❌ Solo la persona que hizo la pregunta puede abrir este hilo.", ephemeral: true });
        }

        // 1. Defer para ganar tiempo
        await interaction.deferUpdate(); // Esto quita el estado de "Cargando" del botón

        try {
            // Extraer la pregunta del embed original
            const embed = interaction.message.embeds[0];
            const pregunta = embed.description.split('\n\n')[0].replace('**Pregunta:** ', '');

            // 2. Crear el hilo
            const thread = await interaction.channel.threads.create({
                name: `🦜 Respuesta: ${pregunta.substring(0, 20)}...`,
                autoArchiveDuration: 60,
                type: ChannelType.PublicThread,
            });

            // 3. Deshabilitar el botón original para que no le den dos veces
            await interaction.editReply({ components: [] });

            // 4. Llamada a la IA
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: pregunta }],
            });

            const respuestaIA = completion.choices[0].message.content;

            // 5. Enviar al hilo
            await thread.send(`**Pregunta:** ${pregunta}\n\n**PeriBot dice:** ${respuestaIA}`);
            await thread.join();

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Error al procesar la IA.", ephemeral: true });
        }
    },
};
