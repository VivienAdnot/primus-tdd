import { startHttpServer, startWsServer } from './server';
import { route } from './routing';

const port = 8018;

const httpServer = startHttpServer(port);
startWsServer(httpServer, route);
