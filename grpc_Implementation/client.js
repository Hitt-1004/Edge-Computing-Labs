const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('./joke.proto');
const jokeProto = grpc.loadPackageDefinition(packageDefinition).joke;

const client = new jokeProto.JokeService('localhost:50051', grpc.credentials.createInsecure());

function getJoke() {
    client.GetJoke({}, (err, response) => {
        if (err) {
            console.error('Error fetching joke:', err);
        } else {
            console.log('Joke:', response.joke);
        }
    });
}

getJoke();
