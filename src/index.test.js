import { startHttpServer, startWsServer } from './server';

const port = 8018;
let httpServer;
let wsServer;
let socket;

let data = [];

beforeEach(() => {

    data = [];
    httpServer = startHttpServer(port);
    wsServer = startWsServer(httpServer, (dataReceived) => {

        console.log('server received', dataReceived);
        data.push(dataReceived);

    });

});

afterEach(() => {

    socket.destroy();
    wsServer.close();
    httpServer.close();

});

const connect = () => {

    socket = new wsServer.Socket(`http://localhost:${port}`);

    return new Promise((resolve) => {

        socket.on('open', () => {

            socket.write('OK');

            // wait for server to be called;
            global.setTimeout(() => {

                resolve();

            }, 100);

        });

    });

};

test('connection', () => {

    return connect()
    .then(() => expect(data.length).toBe(1));

});
