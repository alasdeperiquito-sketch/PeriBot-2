const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
require('dotenv').config();
const keepAlive = require('./server');

// Iniciar servidor para 24/7
keepAlive();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();
client.snipes = new Map();

// --- CARGADOR DE COMANDOS ---
const commandsPath = path.join(__dirname, 'src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('--- Cargando Comandos ---');
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (command && command.data && command.data.name) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Comando listo: ${command.data.name}`);
    } else {
        console.log(`❌ ERROR en el archivo: ${file} (Ignorado)`);
    }
}

// --- CARGADOR DE EVENTOS ---
const eventsPath = path.join(__dirname, 'src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

console.log('--- Cargando Eventos ---');
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ Evento cargado: ${event.name}`);
}

// --- SISTEMA ANTI-DUPLICADOS EN READY ---
client.on('ready', async () => {
    console.log(`🚀 PeriBot activado como ${client.user.tag}`);
    client.user.setActivity('vigilar el servidor 🦜', { type: 3 });

    try {
        const localCommands = client.commands.map(cmd => cmd.data.toJSON());
        const currentCommands = await client.application.commands.fetch();

        // Si el número de comandos es distinto, sincronizamos para evitar duplicados
        if (currentCommands.size !== localCommands.length) {
            console.log('🔄 Sincronizando comandos con Discord...');
            await client.application.commands.set(localCommands);
            console.log('✅ Comandos sincronizados correctamente.');
        } else {
            console.log('✅ Los comandos ya están sincronizados.');
        }
    } catch (error) {
        console.error('❌ Error sincronizando comandos:', error);
    }
});

// Manejador de interacciones
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Hubo un error.', ephemeral: true });
    }
});

// LOGIN USANDO TU SECRET CORRECTO
client.login(process.env.DISCORD_BOT_TOKEN);
