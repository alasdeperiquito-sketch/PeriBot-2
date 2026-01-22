const express = require('express');
const app = express();

function keepAlive() {
    app.get('/', (req, res) => {
        res.send(`
            <html>
                <head>
                    <title>PeriBot Dashboard</title>
                    <style>
                        body { background-color: #2c2f33; color: white; font-family: sans-serif; text-align: center; padding-top: 50px; }
                        .btn { background-color: #7289da; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; }
                        .btn:hover { background-color: #5b70be; }
                        img { border-radius: 50%; width: 150px; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <img src="https://cdn.discordapp.com/embed/avatars/0.png" alt="PeriBot">
                    <h1>🦜 PeriBot Dashboard</h1>
                    <p>¡El bot está volando y listo para charlar!</p>
                    <br><br>
                    <a class="btn" href="https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands">
                        ➕ Invitar a PeriBot
                    </a>
                </body>
            </html>
        `);
    });

    app.listen(3000, () => {
        console.log('🌐 Dashboard web abierto en: http://localhost:3000');
    });
}

module.exports = keepAlive;
