"use strict";

//Gra użytkownika z "komputerem" w "Kamień, papier, nożyczki".

(function () {
  var htmlElements = {
    output: document.getElementById('output'),

    playerScore: document.getElementById('player-score'),
    computerScore: document.getElementById('computer-score'),
    newGameButton: document.getElementById('new-game-button'),
    infoOutput: document.getElementById('info-output'),

    overlay: document.getElementById('modal-overlay'),
    modals: document.getElementsByClassName('modal'),

    submitButton: document.getElementById('submit-btn')
  };

  var params = {
    game: false,
    playerName: 'Użytkownik',
    roundNumber: 0,
    roundCounter: 0,
    playerScore: 0,
    computerScore: 0,
    progress: []
  };

  //Obsługa przycisków zamykających modale.
  var closeModalButtons = document.querySelectorAll('.modal .close');
  for(var i = 0; i < closeModalButtons.length; i++) {
    closeModalButtons[i].addEventListener('click', modalClose);
  }

  htmlElements.overlay.addEventListener('click', modalClose);
  for(var i = 0; i < htmlElements.modals.length; i++) {
    htmlElements.modals[i].addEventListener('click', function(event){
      event.stopPropagation();
    });
  }

  //Funkcja wyświetlająca komunikaty w polu pod przyciskiem "Nowa gra".
  function infoLog(message) {
    htmlElements.infoOutput.innerHTML = message + '<br>';
  };

  //Funkcja pokazująca modal o wybranym id i ukrywająca reszte modali.
  function modalShow(id) {
    htmlElements.overlay.classList.add('show');
    var modalIndex;
    for (var i = 0; i < htmlElements.modals.length; i++) {
      htmlElements.modals[i].classList.remove('show');
      if(htmlElements.modals[i].getAttribute('id') == id) {
        modalIndex = i;
      }
    }
    htmlElements.modals[modalIndex].classList.add('show');
  }

  //Funkcja zamykająca modale.
  function modalClose(event) {
    event.preventDefault();
    htmlElements.overlay.classList.remove('show');
  };

  //Funkcja reagująca na zdarzenie kliknięcia na przycisk "Nowa gra". Funkcja wyświetla okienko do wprowadzenia ilości rund w rozgrywkach i przeprowadza walidację danych wprowadzonych przez użytkownika.
  htmlElements.newGameButton.addEventListener('click', function(event) {
    //var roundNumber = window.prompt('Podaj liczbę rund w rozgrywkach');
    modalShow('modal-new-game');
  });

  htmlElements.submitButton.addEventListener('click', function(event) {
    modalClose(event);
    var name = document.getElementById("user-name").value;
    var roundNumber  = document.getElementById("round-num").value;  
    
    if (!roundNumber || isNaN(roundNumber) || roundNumber == null) {
      params.roundNumber = 0;
      infoLog('Niepoprawna ilość rund');
    }
    else {
      params.roundNumber = roundNumber;
      infoLog('Ilość rund w rozgrywkach: ' + params.roundNumber);
      if(name && name != null) {
        params.playerName = name;
        document.getElementById('player-name').innerHTML = name;
      }
      params.game = true;
    }
  });

  function newGame() {
    
  };

  //Funkcja wyświetlająca komunikaty dotyczące przebiegu gry w okienku pod przyciskami "KAMIEŃ", "PAPIER", "NOŻYCZKI".
  function gameLog(message) {
    //htmlElements.output.insertAdjacentHTML('afterbegin', message + '<br>');
    htmlElements.output.innerHTML = message;
  };

  //Funkcja zwracająca losową liczbę całkowitą z przedziału <1;3>
  function random() {
    return Math.floor(Math.random() * 3 + 1);
  };

  //Funckja zwracająca nazwę dla liczby z przedziału <1;3>
  function choiceToString(choice) {
    if(choice == 1) {
      return 'KAMIEŃ';
    }
    else if(choice == 2) {
      return 'PAPIER';
    }
    else if(choice == 3) {
      return 'NOŻYCZKI';
    }
  };

  //Funkcja aktualizująca wyniki w tabeli wyników
  function updateScore() {
    htmlElements.playerScore.innerHTML = params.playerScore;
    htmlElements.computerScore.innerHTML = params.computerScore;
  }

  //Funkcja sprawdzająca status gry - czy rozegrano podaną ilość rund. W przypadku osiągnięcia wymaganej ilości rund wyświetla komunikat o wyniku rozgrywek oraz zeruje wartości zmiennych do nowej rozgrywki.
  function checkGameStatus() {
    if(params.roundCounter == params.roundNumber) {
      var message;
      if(params.playerScore > params.computerScore) {
        message = 'GRATULACJE. wygrałeś rozgrywki!';
      }
      else if(params.playerScore < params.computerScore) {
        message = 'KOMPUTER wygrał rozgrywki!';
      }
      else {
        message = 'Rozgrywki zakończone remisem';
      }
      gameLog(message);
      message +='<table><tr><th>Nr rundy</th><th>' + params.playerName + '</th><th>Komputer</th><th>Zwycięzca</th><th>Wynik</th></tr>';

      for (var i = 0; i < params.progress.length; i++) {
        message += '<tr>';
        for(var key in params.progress[i]) {
          if(key != 'roundScore') {
            message += '<td>' + params.progress[i][key] + '</td>';
          }
          else {
            message += '<td>' + params.progress[i][key][0] + ':' + params.progress[i][key][1] + '</td>';
          }
        }
        message += '</tr>';
      }

      message += '</table>'

      document.querySelector('#modal-end-game .content p').innerHTML = message;      
      modalShow('modal-end-game');
      
      params.roundCounter = 0;
      params.roundNumber = 0;
      params.playerScore = 0;
      params.computerScore = 0;
      return false;
    }
    else {
      return true;
    }
  };

  //Funkcja zwracająca tekst z nazwą zwycięzcy, w celu zamieszczenia go w tabeli wyników.
  function whoWon(winner) {
    if(winner == 0) { //Wygrał "Komputer"
        return 'Komputer';
      }
      else if(winner == 1) { //Wygrał użytkownik
        return params.playerName;        
      }
      else if (winner == -1) {
        return 'Remis';
      }
  }

  //Silnik gry
  function playerMove(playerChoice, event) {
    if(!params.game) {
      gameLog('Aby rozpocząć nową rozgrywkę naciśnij przycisk \"Nowa gra\"');
    }
    else {
      var computerChoice = random();
      var message;
      var winner;

      if (playerChoice == computerChoice) {
        winner = -1;        
      }
      else if (playerChoice == 1) {
        if (computerChoice == 2) {
          winner = 0; //Wygrał "Komputer"
        }
        else if (computerChoice == 3) {
          winner = 1;  //Wygrał użytkownik
        }
      }    
      else if (playerChoice == 2) {
        if (computerChoice == 1) {
          winner = 1;
        }
        else if (computerChoice == 3) {
          winner = 0;
        }
      }
      else if (playerChoice == 3) {
        if (computerChoice == 1) {
          winner = 0;
        }
        else if (computerChoice == 2) {
          winner = 1;
        }
      } 

      if(winner == 0) { //Wygrał "Komputer"
        params.computerScore++;
        message = 'PRZEGRAŁEŚ: ';
      }
      else if(winner == 1) { //Wygrał użytkownik
        params.playerScore++;
        message = 'WYGRAŁEŚ: ';        
      }
      else if (winner == -1) {
        message = 'REMIS: ';
      }

      message += params.playerName + ' wybrał ' + choiceToString(playerChoice) + ', komputer wybrał ' + choiceToString(computerChoice);
      gameLog(message);
      updateScore();
      params.progress[params.roundCounter] = {
        'roundNumber': params.roundCounter+1, 
        'playerMove': choiceToString(playerChoice),
        'computerMove': choiceToString(computerChoice),
        'winner': whoWon(winner),
        'roundScore': [params.playerScore, params.computerScore]
      };
      params.roundCounter++;
      params.game = checkGameStatus();
    }
  };

  //Funkcja zwracająca liczbę całkowitą z przedziału <1;3>, odpowiadającą przyciskowi naciśniętemu przez użytkownika. 1 - KAMIEŃ, 2- PAPIER, 3 - NOŻYCZKI.
  function buttonPressed(playerChoice, event) {
    return function () {
      if(playerChoice == 'rock') {
      playerMove(1);
      }
      else if(playerChoice == 'paper') {
        playerMove(2);
      }
      else if(playerChoice == 'scissors') {
        playerMove(3);
      }
    }
  }

  //Pętla dodająca callbacki dla przycisków.
  var playerMoveElements = document.querySelectorAll('.player-move');
  for(var i = 0; i < playerMoveElements.length; i++) {
    var dataMove = playerMoveElements[i].getAttribute('data-move');
    playerMoveElements[i].addEventListener('click', buttonPressed(dataMove));
  }

})();