const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageDelete,
    execute(message) {
        if (message.author?.bot) return;
        message.client.snipes = message.client.snipes || new Map();
        message.client.snipes.set(message.channel.id, {
            content: message.content,
            author: message.author,
            image: message.attachments.first()?.proxyURL
        });
    },
};
