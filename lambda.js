// Using Node.js `require()`
const MongoClient = require('mongodb').MongoClient;
const db = 'test';

exports.myHandler = async function (event, context) {
    console.log("value1 = " + event.key1);
    console.log("value2 = " + event.key2);
    console.log('remaining time =', context.getRemainingTimeInMillis());
    console.log('functionName =', context.functionName);
    console.log('AWSrequestID =', context.awsRequestId);
    console.log('logGroupName =', context.log_group_name);
    console.log('logStreamName =', context.log_stream_name);
    console.log('clientContext =', context.clientContext);
    console.log('environment =', process.env.MONGO_PATH);

    let collectionName = 'devices';

    let client = null;
    let collection = null;
    let result = null;
    try {
        client = await getClient();
        collection = await getCollection(client, db, collectionName);
        await insert(collection, [{type: "pad"}, {type: "phone"}]);
        result = await find(collection, {type: "computer"});
    } catch (e) {
        console.log('catch e', e);
        throw new Error(e);
    } finally {
        client.close();
    }

    return result;
};

function getClient() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.MONGO_PATH, function (err, client) {
            if (err) {
                console.log('err getClient', err);
                reject(err);
            } else {
                console.log('success getClient', client.s.url);
                resolve(client);
            }
        });
    });
}

function getCollection(client, db, collection) {
    const col = client.db(db).collection(collection);
    console.log('success getCollection', col.name);
    return col;
}

function insert(collection, data) {
    return new Promise((resolve, reject) => {
        collection.insertMany(data, function (err, result) {
            if (err) {
                console.log('err insert', err);
                reject(err);
            } else {
                console.log("insertMany the following records");
                console.log(result);
                resolve(result);
            }
        });
    });
}

function find(collection, data) {
    return new Promise((resolve, reject) => {
        collection.find(data).toArray(function (err, docs) {
            if (err) {
                console.log('err find', err);
                reject(err);
            } else {
                console.log("Found the following records");
                console.log(docs);
                resolve(docs);
            }
        });
    });
}