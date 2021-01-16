# Socket IO Example

Example usage of the Socket IO library (https://socket.io/). Rooms documentation: https://socket.io/docs/v3/rooms/

## Running example

1. Initialize front end:

cd client
npm install -g http-server
http-server . -p 3000

2. Initialize back end:

cd server
npm install
npm test

3. With 4 different browser tabs, log in with the following credentials

matt        123

danni       123

joe         123
  
dad         123

4. Have two users click game 1, and two users click game 2

5. On any tab, press the arrow keys to move the user. Only users in each respective game should see player movement

## Key parts

The important snippets of code are here:

Back end: 
In this snippet you can see the server listens for a connection event from the front end socket.io library. On connection, the query string is read for which room should be joined with the join function. The server then listens for any events that are sent from this client and sends them to all other clients in their respective room.

```
io.on('connection', (socket) => { 
  console.log('Adding client to room ' + socket.handshake.query['room']);
    socket.join(socket.handshake.query['room']);

    socket.on('event', (data) => {
        players[socket.handshake.query['room']][data.username] = [data.x, data.y];
        io.sockets.to(socket.handshake.query['room']).emit('event', players[socket.handshake.query['room']]);
    });
});
```

Front end:
In  this snippet, the initial connection is requested, passing the room specified by the user's button press. The front end then listens for events from the server and re-renders the players when an event is received. On keypress, the position is changed and the information is sent to the server

```
socket = io.connect('http://localhost:8080',{ query: 'room=' + e.target.id });
socket.on('event', function(data){
    players = data;
    renderPlayers();
});
            
window.addEventListener('keydown', function(e){
        if (e.keyCode === 37) {
            y += 10;
        } else if (e.keyCode === 38) {
            x -= 10;
        } else if (e.keyCode === 39) {
            y -= 10;
        } else if (e.keyCode === 40) {
            x += 10;
        } else {
            return;
        }

      socket.emit('event', {username: user.username, x: x, y: y});
    });
```


