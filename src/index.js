import http from 'http';
import Primus from 'primus'

const port = 8018;

var server = http.createServer();
server.listen(port, () => { `server is listening to ${port}`});

const primus = new Primus(server, { transformer: 'sockjs'});

primus.on('connection', (spark) => {

    spark.on('data', (data) => {

        console.log('socket server received', data);

    });

});

const socket = new primus.Socket(`http://localhost:${port}`);

socket.on('open', () => {

    console.log('connection established');
    socket.write('write test');

});