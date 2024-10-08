import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../services/game.service';
import { GameStateService } from '../services/game-state-service.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  board$ = new BehaviorSubject<string[]>(Array(9).fill(''));
  winner$ = new BehaviorSubject<string | null>(null);
  currentPlayer$ = new BehaviorSubject<'X' | 'O'>('X');
  isBotEnabled$ = new BehaviorSubject<boolean>(false);
  difficulty$ = new BehaviorSubject<'easy' | 'medium'>('easy');

  constructor(
    private gameService: GameService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    this.gameService.board$.subscribe(board => {
      console.log('Board updated:', board);
      this.board$.next(board);
    });
    
    this.gameService.winner$.subscribe(winner => {
      console.log('Winner updated:', winner);
      this.winner$.next(winner);
    });
    
    this.gameService.currentPlayer$.subscribe(player => {
      console.log('Current player updated:', player);
      this.currentPlayer$.next(player);
    });
    
    this.gameStateService.isBotEnabled$.subscribe(enabled => {
      console.log('Bot enabled:', enabled);
      this.isBotEnabled$.next(enabled);
    });
    
    this.gameStateService.difficulty$.subscribe(diff => {
      console.log('Difficulty updated:', diff);
      this.difficulty$.next(diff);
    });
  }

  getCurrentPlayer() {
    const player = this.gameService.getCurrentPlayer();
    console.log('Getting current player:', player);
    return player;
  }

  getWinner() {
    const winner = this.gameService.getWinner();
    console.log('Getting winner:', winner);
    return winner;
  }

  resetGame() {
    console.log('Resetting game');
    this.gameService.resetGame();
  }

  makeMove(index: number) {
    console.log('Making move at index:', index);
    this.gameService.makeMove(index);
  }

  onBotEnabledChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    console.log('Bot enabled changed to:', isChecked);
    this.gameStateService.setBotEnabled(isChecked);
  }

  onDifficultyChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const difficulty = select.value as 'easy' | 'medium';
    console.log('Difficulty changed to:', difficulty);
    this.gameStateService.setDifficulty(difficulty);


  }

  
}
