//  service that manages the state of the game,whether the bot is enabled and what the bot's difficulty level is

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private isBotEnabledSubject = new BehaviorSubject<boolean>(false);
  isBotEnabled$ = this.isBotEnabledSubject.asObservable();

  private difficultySubject = new BehaviorSubject<'easy' | 'medium'>('easy');
  difficulty$ = this.difficultySubject.asObservable();

  setBotEnabled(isEnabled: boolean) {
    this.isBotEnabledSubject.next(isEnabled);
  }

  setDifficulty(difficulty: 'easy' | 'medium') {
    this.difficultySubject.next(difficulty);
  }
}


