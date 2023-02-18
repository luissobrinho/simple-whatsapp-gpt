const { Client, LocalAuth} = require('whatsapp-web.js');
const { Configuration, OpenAIApi } = require("openai");
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "whatsapp-gpt" })
});

const configuration = new Configuration({
    apiKey: '{TOKEN-GTP}',
});
const openai = new OpenAIApi(configuration);

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', (session) => {
    console.log('Client is authenticated!');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message) => {
    if(message.body.toLowerCase().startsWith('{TRIGGER}')) {
        console.log(`Message: ${message.body.slice(5)}`)
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: message.body.slice(5),
            max_tokens: 4000,
        });
        console.log(`Response GTP ${response.data.id}`);
        for (const choice of response.data.choices) {
            await message.reply(choice.text);
        }
    }
});

void client.initialize();
