const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    // let url = 'mongodb://localhost:27017/node-complete';
    let url = 'mongodb+srv://firss:GmzEQpUk29FxCysi@cluster0-frrnr.mongodb.net/shop?retryWrites=true&w=majority';
    MongoClient.connect(url)
        .then(client => {
            console.log('Database Connected!');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;