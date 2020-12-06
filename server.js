'use strict';

const grpc        = require('grpc');
const logger      = require('./libs/logger');
const PROTO_PATH  = __dirname + '/idl/message.proto';
const protoLoader = require('@grpc/proto-loader');
const query       = require('./middleware');
const event       = require('./event');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);

const proto = grpc.loadPackageDefinition(packageDefinition).message;

const server = new grpc.Server();

server.addService(proto.Message.service, { query, event });

server.bind('0.0.0.0:5588', grpc.ServerCredentials.createInsecure());

server.start();

