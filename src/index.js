const https = require('https');
const util = require('util');

function short(obj) {
  return `${util.inspect(obj, true, 3, false)}`.replace(/\n/gi, '').slice(0, 80);  
}
/*
const server = https.createServer((arg1, arg2, arg3) => {
  console.log(`\n*** createServer()`);
  console.log(short(arg1)); // request
  console.log(short(arg2)); // response
  console.log(short(arg3)); // undefined
});
*/
const server = https.createServer();
console.log(short(server));

// exception: Error
// head:      Buffer
// request:   https.IncomingMessage
// response:  https.ServerResponse
// socket:    net.Scoket -> stream.Duplex

let connected = 0;

server.on('checkContinue', (request, response) => {
  console.log(`\n*** server on checkContinue`);
  console.log(request);
  console.log(response);  
});

server.on('checkExpectation', (request, response) => {
  console.log(`\n*** server on checkExpectation`);
  console.log(request);
  console.log(response);  
});

server.on('clientError', (exception, socket) => {
  console.log(`\n*** server on clientError`);
  console.log(short(exception));
  console.log(short(socket));  
});

server.on('close', () => {
  console.log(`\n*** server on close`);
});

server.on('connect', (request, socket, head) => {
  console.log(`\n*** server on connect`);
  console.log(short(request));
  console.log(short(socket));
  console.log(short(head));
});

server.on('connection', (socket) => {
  socket.on('close', (hadError) => {
    console.log(`\n*** socket on close`);
    connected = 0;
    console.error(`connected: ${connected}`);
  });
  /*
  This event will never show up here because it's 
  already connected when passed to the function. 
  
  socket.on('connect', () => {
    console.log(`\n*** socket on connect`);
    connected++;
    console.error(`connected: ${connected}`);
  });
  */
  connected++;
  console.error(`connected: ${connected}`);
  console.log(`\n\n*** server on connection`);
  console.log(short(socket));
});

server.on('headersTimeout', () => {
  console.log(`\n*** server on headersTimeout`);
});

server.on('request', (request, response) => {
  const now = new Date().toISOString();
  response.on('close', () => {
    console.log(`\n*** response on close`);
  });
  response.on('finish', () => {
    console.log(`\n*** response on finish`);
  });
  console.error(`connected: ${connected}`);
  let prefix = (connected === 1) ? '' : '\n';
  console.log(`${prefix}\n*** server on request at ${now}`);
  console.log(short(request));
  console.log(short(response));
  connected++;
  response.write(`Hello at ${now}`);
  response.end();
});
          
server.on('upgrade', (request, socket, head) => {
  console.log(`\n*** server on upgrade`);
  console.log(request);
  console.log(socket);
  console.log(head);
});

server.listen({ host: 'localhost', port: 8000 });
