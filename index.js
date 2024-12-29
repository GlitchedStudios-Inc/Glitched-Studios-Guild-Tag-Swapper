const { Client } = require('discord.js-selfbot-v13');
const axios = require('axios');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const token = config.token; 
let INTERVAL = config.interval;
const GUILDS = config.guilds;
const DISCORD_API_URL = "https://discord.com/api/v9/users/@me/clan";
const allowedUserId = config.allowedUserId;

const client = new Client();

let guildRotationTask = null;
let switchCount = 0; 
const startTime = Date.now(); 

async function changeIdentity(guildName, guildId) {
    const headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    };

    const payload = {
        "identity_guild_id": guildId,
        "identity_enabled": true
    };

    try {
        const response = await axios.put(DISCORD_API_URL, payload, { headers });
        if (response.status === 200) {
            console.log(`Successfully changed to ${guildName}`);
            switchCount++;
        } else {
            console.log(`Failed to change to ${guildName}. Status Code: ${response.status}, Response: ${response.data}`);
        }
    } catch (error) {
        console.error(`Error while changing to ${guildName}: ${error}`);
    }
}

async function rotateGuilds() {
    while (true) {
        for (const [guildName, guildId] of Object.entries(GUILDS)) {
            await changeIdentity(guildName, guildId);
            await new Promise(resolve => setTimeout(resolve, INTERVAL));
        }
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Made By Glitched Da Kitty Cat(glitchedtahcat on discord`);
    console.log(`Thanks To PokiByte And Scarlett For Helping`);
    console.log(`Please don't skid it because think about it theres a paid python one but this a free better one`);
    guildRotationTask = rotateGuilds();
});

client.on('messageCreate', async (message) => {
    if (message.author.id !== allowedUserId) {
        return;
    }

    if (message.content.startsWith('gs.start')) {
        if (!guildRotationTask) {
            guildRotationTask = rotateGuilds();
            message.channel.send("Started");
        } else {
            message.channel.send("Already Running");
        }
    }

    if (message.content.startsWith('gs.stop')) {
        if (guildRotationTask) {
            guildRotationTask = null;
            message.channel.send("Stopped");
        } else {
            message.channel.send("Already Stopped");
        }
    }

    if (message.content.startsWith('gs.delay')) {
        const delay = parseFloat(message.content.split(' ')[1]);
        if (delay > 0.3) {
            INTERVAL = delay * 1000;

            config.interval = INTERVAL;
            fs.writeFileSync('config.json', JSON.stringify(config, null, 4));

            message.channel.send(`Guild rotation delay changed to ${INTERVAL / 1000} seconds.`);
        } else {
            message.channel.send("Delay must be a positive number greater than 0.3 please");
        }
    }

    if (message.content.startsWith('gs.status')) {
        const elapsedTime = Date.now() - startTime;
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
        const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

        message.channel.send(`Running Time: ${days}d ${hours}h ${minutes}m ${seconds}s\nGuild Switches: ${switchCount}`);
    }
});

client.login(token).catch(err => {
    console.error('Failed to login:', err);
});
