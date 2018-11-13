const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');


const bots = [];

let config = {
    interval: null,
    channelId: null,
    message: null,
    image: null,
    tokens: []
};

setup();

function setupBots() {
    createBots();
    setSpam();
    loginBots();
}

function createBots() {

    for (let i = 0; i < config.tokens.length; i++) {
        bots.push(new Discord.Client());
    }

}

function setSpam() {
    for (let i = 0; i < bots.length; i++) {
        bots[i].on('ready', () => {
            const channel = bots[i].channels.get(config.channelId);
            setInterval(() => {
                if (config.image !== null) {
                    channel.send({
                        files: [`images/${config.image}`]
                    });
                } else if (config.message !== null) {
                    channel.send(config.message);
                }
            }, config.interval);
        });
    }
}

function loginBots() {
    for (let i = 0; i < bots.length; i++) {
        bots[i].login(config.tokens[i]);
    }
}

function setup() {
    const istream = readline.createInterface({
        input: fs.createReadStream('config.txt')
    });

    istream.on('line', (line) => {
        if (line.length !== 0) {
            if (line[0] !== '*') {
                if (line.includes('TOKEN')) {
                    config.tokens.push(line.split('=')[1]);
                }

                if (line.includes('MESSAGE_INTERVAL')) {
                    config.interval = line.split('=')[1];
                }

                if (line.includes('CHANNEL_ID')) {
                    config.channelId = line.split('=')[1];
                }

                if (line.includes('IMAGE_NAME')) {
                    config.image = line.split('=')[1];
                }

                if (line.includes('MESSAGE_CONTENT')) {
                    config.message = line.split('=')[1];
                }
            }
        }
    }).on('close', () => {
        setupBots();
        console.log(config);
    });
}
