import http from 'http';
import Primus from 'primus';
import { registerSpark, unregisterSpark } from './routing';

export const startHttpServer = (port) => {

    const server = http.createServer();
    server.listen(port, () => {

        console.log('http server is listening to', port);

    });

    return server;

};

export const startWsServer = (httpServer, onData) => {

    const primus = new Primus(httpServer, { transformer: 'sockjs' });

    primus.on('connection', (spark) => {

        registerSpark(spark);
        spark.on('data', onData);

    });

    primus.on('disconnection', (spark) => {

        unregisterSpark(spark);

    });

    return primus;

};
