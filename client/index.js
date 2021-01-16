window.addEventListener('load', function(){
    let user, players, socket;
    let x = 100;
    let y = 100;

  document.getElementById('login-button').addEventListener('click', function(){
    var formData = new FormData();

    formData.append('username', document.getElementById('username-field').value);
    formData.append('password', document.getElementById('password-field').value);

    var request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:3001/login');
    request.send(formData);  

    request.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('lobby').style.display = 'block';
        user = JSON.parse(this.responseText);
      }
    };
  });

    var gameButtons = document.getElementsByClassName('join-game');

    for(var i = 0; i < gameButtons.length; i++){
        gameButtons[i].addEventListener('click', function(e){
            document.getElementById('lobby').style.display = 'none';
            document.getElementById('game').style.display = 'block';

            socket = io.connect('http://localhost:8080',{ query: 'room=' + e.target.id });
            socket.on('event', function(data){
                players = data;
                renderPlayers();
            });

            socket.emit('event', {username: user.username, x: x, y: y});
        });
    }

    function renderPlayers(){
        let boardElement = document.getElementById('game');
        boardElement.innerHTML = '';

        Object.keys(players).forEach(function(player){
            let playerElement = document.createElement('div');
            playerElement.innerText = player;
            playerElement.className = 'player';
            playerElement.style.top = players[player][0] + 'px';
            playerElement.style.left = players[player][1] + 'px';
            boardElement.append(playerElement);
        });
    }

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

    window.addEventListener('keyup', function(){
    
    });
});
