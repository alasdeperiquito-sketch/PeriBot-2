const { SlashCommandBuilder, ChannelType } = require('discord.js');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Pregúntale algo a PeriBot y abrirá un hilo')
        .addStringOption(option => 
            option.setName('pregunta')
                .setDescription('Tu pregunta para la IA')
                .setRequired(true)),
    async execute(interaction) {
        const pregunta = interaction.options.getString('pregunta');

        // 1. ACEPTAR LA INTERACCIÓN AL INSTANTE (Evita el error de los 3 segundos)
        // ephemeral: true hace que el "Pensando..." solo lo vea quien puso el comando
        await interaction.deferReply({ ephemeral: true });

        try {
            // 2. Crear el hilo (esto es rápido porque tienes permisos de admin)
            const thread = await interaction.channel.threads.create({
                name: `🦜 Consulta: ${pregunta.substring(0, 25)}...`,
                autoArchiveDuration: 60,
                type: ChannelType.PublicThread,
                reason: 'Consulta a PeriBot IA',
            });

            // 3. Informar al usuario que el hilo ya se creó mientras la IA piensa
            await interaction.editReply({ content: `✅ ¡Hilo creado! Respondiendo en ${thread}...` });

            // 4. Llamada a la IA (aquí puede tardar lo que quiera)
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Eres PeriBot, un asistente periquito muy sabio pero divertido. Respondes de forma concisa." },
                    { role: "user", content: pregunta }
                ],
            });

            const respuestaIA = completion.choices[0].message.content;

            // 5. Enviar la respuesta final dentro del hilo
            await thread.send(`**Pregunta de ${interaction.user}:** ${pregunta}\n\n**Respuesta:** ${respuestaIA}`);

        } catch (error) {
            console.error("Error en el comando /ask:", error);
            // Si algo falla, editamos el mensaje de "Pensando" para avisar
            await interaction.editReply({ content: "❌ Hubo un problema al crear el hilo o conectar con la IA." });
        }
    },
};
