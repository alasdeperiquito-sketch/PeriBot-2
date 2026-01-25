import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Helper for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function startBot() {
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

  (client as any).commands = new Collection();
  (client as any).snipes = new Map();

  // Use process.cwd() to reliably find src folder from root
  const commandsPath = path.join(process.cwd(), 'src/commands');
  const eventsPath = path.join(process.cwd(), 'src/events');

  // Load Commands
  if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cjs'));
    console.log('--- Cargando Comandos ---');
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      // Dynamic import for CJS in ESM
      import(filePath).then(module => {
        const command = module.default || module;
        if (command && command.data && command.data.name) {
          (client as any).commands.set(command.data.name, command);
          console.log(`✅ Comando listo: ${command.data.name}`);
        } else {
          console.log(`❌ ERROR en el archivo: ${file} (Ignorado)`);
        }
      }).catch(err => console.error(`Error loading command ${file}:`, err));
    }
  } else {
    console.warn(`Warning: Commands path not found at ${commandsPath}`);
  }

  // Load Events
  if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.cjs'));
    console.log('--- Cargando Eventos ---');
    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      import(filePath).then(module => {
        const event = module.default || module;
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`✅ Evento cargado: ${event.name}`);
      }).catch(err => console.error(`Error loading event ${file}:`, err));
    }
  }

  // Ready Event
  client.on('ready', async () => {
    if (!client.user) return;
    console.log(`🚀 PeriBot activado como ${client.user.tag}`);
    client.user.setActivity('vigilar el servidor 🦜', { type: 3 });

    try {
      const localCommands = (client as any).commands.map((cmd: any) => cmd.data.toJSON());
      // Wait a bit for commands to load since dynamic imports are async
      setTimeout(async () => {
         // This simple sync logic might need refinement for production but works for startup
         console.log(`Commands loaded: ${localCommands.length}`);
         // Note: For production, better to have a dedicated deploy-commands script
      }, 5000);

    } catch (error) {
      console.error('❌ Error setup:', error);
    }
  });

  // Interaction Handler
  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = (client as any).commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Hubo un error.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Hubo un error.', ephemeral: true });
      }
    }
  });

  const token = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN;
  if (!token) {
    console.warn("⚠️ No DISCORD_BOT_TOKEN found in env. Bot will not start.");
  } else {
    client.login(token).catch(err => console.error("Bot login failed:", err));
  }
}
