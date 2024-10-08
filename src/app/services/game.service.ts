// service that handles the core logic of the game, includes the current state of the board, the current player, checking for the winner, and the bot moves

import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { GameStateService } from './game-state-service.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private boardSubject = new BehaviorSubject<string[]>(Array(9).fill(''));
  board$ = this.boardSubject.asObservable();

  private winnerSubject = new BehaviorSubject<string | null>(null);
  winner$ = this.winnerSubject.asObservable();

  private currentPlayerSubject = new BehaviorSubject<'X' | 'O'>('X');
  currentPlayer$ = this.currentPlayerSubject.asObservable();

  private board: string[] = Array(9).fill('');
  private winner: string | null = null;

  constructor(private gameStateService: GameStateService) {}

  getCurrentPlayer(): 'X' | 'O' {
    return this.currentPlayerSubject.value;
  }

  getWinner(): string | null {
    return this.winner;
  }

  resetGame() {
    this.board = Array(9).fill('');
    this.currentPlayerSubject.next('X');
    this.winner = null;
    this.boardSubject.next(this.board);
    this.winnerSubject.next(this.winner);

    console.log('Game reset:', this.board);//after reset

  
  }

  makeMove(index: number) {
    console.log(`Attempting move at index ${index}`);// logs the index where the player tries to make a move
    if (!this.board[index] && !this.winner) {
      this.board[index] = this.currentPlayerSubject.value;
      console.log('Board after move:', this.board); // after the move
      this.checkWinner();

      if (!this.winner) {
        const newPlayer = this.currentPlayerSubject.value === 'X' ? 'O' : 'X';
        this.currentPlayerSubject.next(newPlayer);
        this.boardSubject.next(this.board);
        this.winnerSubject.next(this.winner);
        console.log(`Current player changed to ${newPlayer}`); // new player turn
        
     
        if (newPlayer === 'O') {
          this.makeBotMove();
        }
      }
    }
  }

  private makeBotMove() {
    this.gameStateService.isBotEnabled$.pipe(take(1)).subscribe(isBotEnabled => { 
      console.log('Is bot enabled:', isBotEnabled);
      if (isBotEnabled) {
        this.gameStateService.difficulty$.pipe(take(1)).subscribe(difficulty => { 
          console.log('Bot difficulty:', difficulty); //current bot difficulty
          const availableMoves = this.board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null) as number[];
          console.log('Available moves for bot:', availableMoves);
  
          setTimeout(() => {
            if (difficulty === 'easy') {
              if (availableMoves.length > 0) {
                const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                console.log('Bot making move:', randomMove);
                this.makeMove(randomMove); 
              }
            } else if (difficulty === 'medium') {
              const winningMove = this.findWinningMove('O');
              if (winningMove !== null) {
                console.log('Bot making winning move:', winningMove);
                this.makeMove(winningMove);
              } else {
                const blockingMove = this.findWinningMove('X');
                if (blockingMove !== null) {
                  console.log('Bot making blocking move:', blockingMove);
                  this.makeMove(blockingMove);
                } else {
                  if (availableMoves.length > 0) {
                    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                    console.log('Bot making random move:', randomMove);
                    this.makeMove(randomMove);
                  }
                }
              }
            }
          }, 500);
        });
      }
    });
  }
  

  private findWinningMove(player: 'X' | 'O'): number | null {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (this.board[a] === player && this.board[b] === player && this.board[c] === '') {
        return c;
      } else if (this.board[b] === player && this.board[c] === player && this.board[a] === '') {
        return a;
      } else if (this.board[a] === player && this.board[c] === player && this.board[b] === '') {
        return b;
      }
    }
    return null;
  }

  private checkWinner() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        this.winner = this.board[a];
        this.winnerSubject.next(this.winner);  
        console.log('Winner found:', this.winner);
        return; 
      }
    }

    if (!this.winner && this.board.every(cell => cell !== '')) {
      this.winner = 'Draw';
      this.winnerSubject.next(this.winner);  
      console.log('Game ended in a draw');
    }
  }
}
