const { Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const OpenAI = require('openai');

// Inicializamos OpenAI con tu clave de los Secrets
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // 1. Filtros de seguridad iniciales
        if (message.author.bot || !message.guild) return;

        // 2. Verificar si el sistema está encendido (Comando /automod)
        const isEnabled = await db.get(`automod_${message.guild.id}`);
        if (isEnabled === false) return; 

        // 3. Los administradores e hilos de sistema son inmunes
        if (message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

        try {
            // 4. Llamada a la IA (GPT-4o-mini)
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { 
                        role: "system", 
                        content: "Eres un moderador estricto. Responde ÚNICAMENTE con la palabra 'RECHAZADO' si el mensaje contiene insultos graves, toxicidad extrema o acoso. Si el mensaje es aceptable, responde 'ACEPTADO'." 
                    },
                    { role: "user", content: message.content }
                ],
                max_tokens: 5,
                temperature: 0,
            });

            const decision = completion.choices[0].message.content.trim().toUpperCase();

            // 5. Acción si la IA rechaza el mensaje
            if (decision.includes('RECHAZADO')) {
                await message.delete();

                const warning = await message.channel.send(`⚠️ ${message.author}, PeriBot ha eliminado tu mensaje por contenido inapropiado.`);

                // Borrar el aviso del bot tras 5 segundos para mantener el chat limpio
                setTimeout(() => warning.delete().catch(() => null), 5000);

                // Enviar log al canal de staff si existe
                const logChannel = message.guild.channels.cache.find(c => c.name === 'staff-logs' || c.name === 'logs');
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setTitle('🛡️ Auto-Mod IA')
                        .setColor('Red')
                        .addFields(
                            { name: 'Usuario', value: `${message.author.tag}`, inline: true },
                            { name: 'Mensaje', value: message.content }
                        )
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] });
                }
            }
        } catch (error) {
            console.error("Error en el sistema de AutoMod IA:", error);
        }
    },
};
