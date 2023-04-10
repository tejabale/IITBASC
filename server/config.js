const fs = require('fs');

const obj =  JSON.parse(fs.readFileSync("./config.txt" , 'utf8'));

const client = {
    user: obj.client.user,
    host: obj.client.host,
    database: obj.client.database,
    password: obj.client.password,
    port: obj.client.port,
}

module.exports = {
    client
}