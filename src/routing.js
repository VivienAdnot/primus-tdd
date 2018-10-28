import { omit } from 'lodash';

export let sockets = [];

export const registerSpark = (spark) => {

    const { _user } = spark.query;
    const { id: _spark } = spark;

    if (sockets[_user] === undefined) {

        sockets[_user] = {};

    }

    sockets[_user][_spark] = spark;

};

export const unregisterSpark = (spark) => {

    const { _user } = spark.query;
    const _spark = spark.id;

    if (Object.keys(sockets[_user]).length > 1) {

        sockets[_user] = omit(sockets[_user], _spark);

    } else {

        sockets = omit(sockets, _user);

    }

};

// unicast
export const sendUnicast = (_destination, message) => {

    Object.keys(sockets[_destination])
    .forEach(key => sockets[_destination][key].write(message));

};

export const forwardPayloadToTarget = (data) => {

    const newPayload = {
        type: data.type,
        payload: {
            ...data.payload,
            _target: data.payload._initiator,
            _initiator: data.payload._target
        }
    };

    sendUnicast(data.payload._target, newPayload);

};

export const route = (data) => {

    forwardPayloadToTarget(data);

};
