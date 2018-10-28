import http from 'http';
import Primus from 'primus';

const startWsServer = (port, onData) => {

    const server = http.createServer();
    server.listen(port, () => {

        console.log('server is listening to', port);

    });

    const primus = new Primus(server, { transformer: 'sockjs' });

    primus.on('connection', (spark) => {

        spark.on('data', onData);

    });

    return primus;

};

export default startWsServer;
