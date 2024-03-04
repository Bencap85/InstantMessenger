const { MongoClient } = require('mongodb');

const connect = () => {

    const uri = process.env.URI;
    const client = new MongoClient(uri);
    client.connect().then(() => {
        console.log("Connected")
    });

    return client;
}


module.exports = { connect };