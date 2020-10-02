const client = require('@sendgrid/mail');
require('dotenv').config()
console.log(__dirname);
client.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
    to: 'compsci335marking@gmail.com',
    from: 'compsci335marking@gmail.com',
    subject: 'meow',
    text: 'meow'
};
client.send(msg).catch(e => {
    console.log(e);
});