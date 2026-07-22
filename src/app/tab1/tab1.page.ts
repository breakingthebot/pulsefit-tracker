/*
 * tab1/tab1.page.ts
 * Logic for daily dashboard logs dashboard showing circular active progress and water widgets.
 * Connects to: services/fitness.service.ts
 * Created: 2026-07-21
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  footstepsOutline, 
  timeOutline, 
  flameOutline, 
  waterOutline, 
  addOutline, 
  removeOutline, 
  refreshOutline 
} from 'ionicons/icons';

import { FitnessService } from '../services/fitness.service';
import { DailyGoalMetrics } from '../models/workout.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonBadge
  ]
})
export class Tab1Page {
  private fitnessService = inject(FitnessService);
  dailyMetrics$: Observable<DailyGoalMetrics> = this.fitnessService.dailyMetrics$;
  todayDate: string = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  constructor() {
    addIcons({ 
      footstepsOutline, 
      timeOutline, 
      flameOutline, 
      waterOutline, 
      addOutline, 
      removeOutline, 
      refreshOutline 
    });
  }

  getPercentage(current: number, goal: number): number {
    if (!goal) return 0;
    return Math.min(100, Math.round((current / goal) * 100));
  }

  getStrokeOffset(current: number, goal: number, circumference: number = 251.2): number {
    const pct = this.getPercentage(current, goal);
    return circumference - (pct / 100) * circumference;
  }

  logWater(ml: number): void {
    this.fitnessService.addWater(ml);
  }

  simulateSteps(steps: number): void {
    this.fitnessService.addSteps(steps);
  }

  resetStats(): void {
    this.fitnessService.resetDailyStats();
  }
}
