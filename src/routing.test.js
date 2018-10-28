import Promise from 'bluebird';
import { startHttpServer, startWsServer } from './server';
import { route } from './routing';

const port = 8020;
let httpServer;
let wsServer;

const noop = () => {};

beforeEach(() => {

    httpServer = startHttpServer(port);
    wsServer = startWsServer(httpServer, route);

});

afterEach(() => {

    wsServer.close();
    httpServer.close();

});

const connect = (_user, fullname, onMessage = noop) => {

    const socket = new wsServer.Socket(`http://localhost:${port}?_user=${_user}&name=${fullname}&client=web`);

    return new Promise((resolve) => {

        socket.on('open', () => {

            resolve(socket);

        });

        socket.on('data', onMessage);

    });

};

test('connection', () => {

    const user1 = {
        id: 1,
        fullname: 'vivien'
    };

    const user2 = {
        id: 2,
        fullname: 'cedric'
    };

    let socket2Result;

    const socket2OnMessage = (message) => {

        console.log('client 2 received message', message.type);
        socket2Result = message;

    };

    return Promise.all([
        connect(user1.id, user1.fullname),
        connect(user2.id, user2.fullname, socket2OnMessage)
    ])
    .then((sockets) => {

        const [socket1] = sockets;

        const sdpOffer = {
            type: 'SDP_OFFER',
            payload: {
                sdpOffer: `sdp-offer:${user1.id}`,
                _room: 12345,
                useGateway: false,
                _target: user2.id,
                _initiator: user1.id
            }
        };

        socket1.write(sdpOffer);
        console.log('client 1 sent message', sdpOffer.type);

        //a little tempo to allow data transfer between sockets
        return Promise.delay(100);

    })
    .then(() => {

        expect(socket2Result).toBeDefined();
        expect(socket2Result.type).toBe('SDP_OFFER');

    });

});
