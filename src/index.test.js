import startWsServer from './server';

const port = 8018;

const connect = (wsServer) => {

    const socket = new wsServer.Socket(`http://localhost:${port}`);

    return new Promise((resolve) => {

        socket.on('open', () => {

            socket.write('OK');

            // wait for server to be called;
            global.setTimeout(() => {

                resolve();

            }, 0);

        });

    });

};

test('connection', () => {

    const onData = jest.fn();

    const wsServer = startWsServer(port, onData);

    return connect(wsServer)
    .then(() => expect(onData.mock.calls[0][0]).toBe('OK'));

});
