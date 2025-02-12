import React, { useState } from 'react';
import { Hexagon, Users, Brain, RotateCcw, Trophy } from 'lucide-react';
import questions from './data/questions.json';

type Player = {
  id: number;
  name: string;
  position: number;
  color: string;
};

type GameState = {
  currentPlayer: number;
  players: Player[];
  gameStarted: boolean;
  currentQuestion: any | null;
  showQuestion: boolean;
  winner: Player | null;
};

const WINNING_POSITION = 10;

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: 0,
    players: [],
    gameStarted: false,
    currentQuestion: null,
    showQuestion: false,
    winner: null
  });

  const [playerCount, setPlayerCount] = useState<number>(1);
  const [playerNames, setPlayerNames] = useState<string[]>(['']);
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill(''));
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const initializeGame = () => {
    const newPlayers = Array.from({ length: playerCount }, (_, index) => ({
      id: index,
      name: playerNames[index] || `Joueur ${index + 1}`,
      position: 0,
      color: colors[index]
    }));

    setGameState({
      ...gameState,
      players: newPlayers,
      gameStarted: true,
      winner: null
    });
  };

  const rollDice = () => {
    const randomQuestion = questions.questions[Math.floor(Math.random() * questions.questions.length)];
    
    setGameState({
      ...gameState,
      currentQuestion: randomQuestion,
      showQuestion: true
    });
  };

  const handleAnswer = (answer: string) => {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const isCorrect = answer === gameState.currentQuestion.correctAnswer;
    
    const updatedPlayers = gameState.players.map((player, idx) => {
      if (idx === gameState.currentPlayer) {
        const newPosition = isCorrect ? player.position + 1 : player.position;
        return {
          ...player,
          position: newPosition
        };
      }
      return player;
    });

    const winner = updatedPlayers.find(player => player.position >= WINNING_POSITION) || null;

    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentPlayer: (gameState.currentPlayer + 1) % playerCount,
      showQuestion: false,
      currentQuestion: null,
      winner
    });
  };

  const resetGame = () => {
    setGameState({
      currentPlayer: 0,
      players: [],
      gameStarted: false,
      currentQuestion: null,
      showQuestion: false,
      winner: null
    });
    setPlayerNames(Array(playerCount).fill(''));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2 flex items-center justify-center gap-2">
            <Hexagon className="w-8 h-8" />
            GéoMath Challenge
          </h1>
          <p className="text-gray-600">Apprenez la géométrie en jouant !</p>
        </div>

        {!gameState.gameStarted ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Configuration de la partie</h2>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 text-center">Nombre de joueurs</label>
              <select
                className="w-full max-w-xs mx-auto block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                value={playerCount}
                onChange={(e) => handlePlayerCountChange(Number(e.target.value))}
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num} joueur{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4 mb-6 max-w-sm mx-auto">
              {Array.from({ length: playerCount }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[index] }} />
                  <input
                    type="text"
                    placeholder={`Nom du joueur ${index + 1}`}
                    value={playerNames[index]}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  />
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-600 mb-6 text-center">
              Objectif : Atteindre {WINNING_POSITION} bonnes réponses pour gagner !
            </div>
            
            <div className="text-center">
              <button
                onClick={initializeGame}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Commencer la partie
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {gameState.winner ? (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center mb-4">
                    <Trophy className="w-16 h-16 text-yellow-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    🎉 Félicitations {gameState.winner.name} ! 🎉
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Vous avez gagné avec {gameState.winner.position} bonnes réponses !
                  </p>
                  <button
                    onClick={resetGame}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Nouvelle partie
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Tour de {gameState.players[gameState.currentPlayer].name}
                    </h2>
                    <button
                      onClick={resetGame}
                      className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Recommencer
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {gameState.players.map((player) => (
                      <div
                        key={player.id}
                        className={`p-4 rounded-lg ${
                          gameState.currentPlayer === player.id ? 'ring-2 ring-indigo-500' : ''
                        }`}
                        style={{ backgroundColor: player.color + '20' }}
                      >
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm">
                          Score: {player.position} / {WINNING_POSITION}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!gameState.showQuestion ? (
                    <button
                      onClick={rollDice}
                      className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Brain className="w-5 h-5" />
                      Répondre à une question
                    </button>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">{gameState.currentQuestion.question}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gameState.currentQuestion.options.map((option: string) => (
                          <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            className="bg-white border border-gray-200 p-4 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;