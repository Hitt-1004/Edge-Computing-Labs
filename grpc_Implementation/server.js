const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const axios = require('axios');

const packageDefinition = protoLoader.loadSync('./joke.proto');
const jokeProto = grpc.loadPackageDefinition(packageDefinition).joke;

function fetchJoke() {
    return axios.get('https://api.chucknorris.io/jokes/random')
        .then(response => response.data.value)
        .catch(error => {
            console.error('Error fetching joke:', error);
            return 'No joke available at the moment';
        });
}

function getJoke(call, callback) {
    fetchJoke()
        .then(joke => {
            callback(null, { joke });
        })
        .catch(error => {
            callback(error, null);
        });
}

const server = new grpc.Server();
server.addService(jokeProto.JokeService.service, { GetJoke: getJoke });

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server is running at 0.0.0.0:50051');
    server.start();
});
