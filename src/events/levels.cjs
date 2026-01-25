const { Events, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        const userId = message.author.id;
        const guildId = message.guild.id;
        const key = `xp_${guildId}_${userId}`;

        // Ganar entre 5 y 15 de XP por mensaje
        let xp = await db.get(key) || 0;
        let level = await db.get(`lvl_${guildId}_${userId}`) || 0;

        const xpGanado = Math.floor(Math.random() * 11) + 5;
        xp += xpGanado;

        // Fórmula simple: cada nivel pide 500 más de XP
        const xpNecesario = (level + 1) * 500;

        if (xp >= xpNecesario) {
            level++;
            xp = 0;
            await db.set(`lvl_${guildId}_${userId}`, level);
            message.channel.send(`🎊 ¡Felicidades ${message.author}! Has subido al **Nivel ${level}**. ¡Sigue charlando! 🦜`);
        }

        await db.set(key, xp);
    },
};
