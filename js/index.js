"use strict";

//Gra użytkownika z "komputerem" w "Kamień, papier, nożyczki".

var rockButton = document.getElementById('rock-button');
var paperButton = document.getElementById('paper-button');
var scissorsButton = document.getElementById('scissors-button');
var output = document.getElementById('output');

var playerScoreElement = document.getElementById('player-score');
var computerScoreElement = document.getElementById('computer-score');
var playerScore = 0;
var computerScore = 0;

var game = false;
var roundNumber = 0;
var roundCounter = 0;
var newGameButton = document.getElementById('new-game-button');
var infoOutput = document.getElementById('info-output');

//Funkcja wyświetlająca komunikaty w polu pod przyciskiem "Nowa gra"
var infoLog = function(message) {
  infoOutput.innerHTML = message + '<br>';
};

//Funkcja reagująca na zdarzenie kliknięcia na przycisk "Nowa gra". Funkcja wyświetla okienko do wprowadzenia ilości rund w rozgrywkach i przeprowadza walidację danych wprowadzonych przez użytkownika.
newGameButton.addEventListener('click', function(event) {
  roundNumber = window.prompt('Podaj liczbę rund w rozgrywkach');
  
  if (!roundNumber || isNaN(roundNumber) || roundNumber == null) {
    roundNumber = 0;
    infoLog('Niepoprawna ilość rund');
  }
  else {
    infoLog('Ilość rund w rozgrywkach: ' + roundNumber);
    game = true;
  }
});

//Funkcja wyświetlająca komunikaty dotyczące przebiegu gry w okienku pod przyciskami "KAMIEŃ", "PAPIER", "NOŻYCZKI".
var gameLog = function(message) {
  output.insertAdjacentHTML('afterbegin', message + '<br>');
};

//Funkcja zwracająca losową liczbę całkowitą z przedziału <1;3>
var random = function() {
  return Math.floor(Math.random() * 3 + 1);
};

//Funckja zwracająca nazwę dla liczby z przedziału <1;3>
var choiceToString = function(choice) {
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
var updateScore = function() {
  playerScoreElement.innerHTML = playerScore;
  computerScoreElement.innerHTML = computerScore;
}

//Funkcja sprawdzająca status gry - czy rozegrano podaną ilość rund. W przypadku osiągnięcia wymaganej ilości rund wyświetla komunikat o wyniku rozgrywek oraz zeruje wartości zmiennych do nowej rozgrywki.
var checkGameStatus = function() {
  if(roundCounter == roundNumber) {
    var message;
    if(playerScore > computerScore) {
      message = 'GRATULACJE. WYGRAŁEŚ ROZGRYWKI!<br>';
    }
    else if(playerScore < computerScore) {
      message = 'KOMPUTER WYGRAŁ ROZGRYWKI!<br>';
    }
    else {
      message = 'ROZGRYWKI ZAKOŃCZONE REMISEM<br>';
    }
    gameLog(message);
    
    roundCounter = 0;
    roundNumber = 0;
    playerScore = 0;
    computerScore = 0;
    return false;
  }
  else {return true;}
};

//Funkcja zwracająca informację odnośnie wygranej lub przegranej użytkownika i odpowiednio zwiększająca punktację.
var winner = function(playerNumber) {
  if(playerNumber == 0) { //Wygrał "Komputer"
    computerScore++;
    return 'PRZEGRAŁEŚ: ';
  }
  else { //Wygrał użytkownik
    playerScore++;
    return 'WYGRAŁEŚ: ';        
  }
};

//Silnik gry
var playerMove = function(playerChoice, event) {
  if(!game) {
    gameLog('Aby rozpocząć nową rozgrywkę naciśnij przycisk \"Nowa gra\"');
  }
  else {
    var computerChoice = random();
    var message;

    if (playerChoice == computerChoice) {
      message = 'REMIS: ';
    }
    else if (playerChoice == 1) {
      if (computerChoice == 2) {
        message = winner(0); //Wygrał "Komputer"
      }
      else if (computerChoice == 3) {
        message = winner(1); //Wygrał użytkownik
      }
    }    
    else if (playerChoice == 2) {
      if (computerChoice == 1) {
        message = winner(1);
      }
      else if (computerChoice == 3) {
        message = winner(0);
      }
    }
    else if (playerChoice == 3) {
      if (computerChoice == 1) {
        message = winner(0);
      }
      else if (computerChoice == 2) {
        message = winner(1);
      }
    } 

    message += 'ty wybrałeś ' + choiceToString(playerChoice) + ', komputer wybrał ' + choiceToString(computerChoice);
    //output.innerHTML = message;
    gameLog(message);
    updateScore();
    roundCounter++;
    game = checkGameStatus();
  }
};

//Funkcja zwracająca liczbę całkowitą z przedziału <1;3>, odpowiadającą przyciskowi naciśniętemu przez użytkownika. 1 - KAMIEŃ, 2- PAPIER, 3 - NOŻYCZKI.
var buttonPressed = function() {
  if(this === rockButton) {
    playerMove(1);
  }
  else if(this === paperButton) {
    playerMove(2);
  }
  else if(this === scissorsButton) {
    playerMove(3);
  }
};

rockButton.addEventListener('click', buttonPressed);
paperButton.addEventListener('click', buttonPressed);
scissorsButton.addEventListener('click', buttonPressed);