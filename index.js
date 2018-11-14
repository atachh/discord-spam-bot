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

const setup = (callback) => {
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
        callback();
    });
}


const setupBot = () => {
    createBots(config.tokens.length);
    setSpam();
    loginBots();
}


setup(setupBot);

const createBots = (amount) => {
    if (amount === 0) return;
    bots.push(new Discord.Client());
    return createBots(amount - 1);
}

const setSpam = () => {
    bots.forEach(bot => {
        bot.on('ready', () => {
            const channel = bot.channels.get(config.channelId);

            setInterval(() => {
                if (config.image !== '') {
                    channel.send({
                        files: [`images/${config.image}`]
                    });
                } else if (config.message !== '') {
                    channel.send(config.message);
                } else return;
            }, config.interval);
        })
    });
}

const loginBots = () => {
    let counter = 0;

    bots.forEach(bot => {
        bot.login(config.tokens[counter]);
        counter++;
    });
}
