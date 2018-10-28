import startWsServer from './server';

const port = 8018;

const primusInstance = startWsServer(port, (data) => {

    console.log('index: socket server received', data);

});

const socket = new primusInstance.Socket(`http://localhost:${port}`);

socket.on('open', () => {

    console.log('connection established');
    socket.write('write test');

});