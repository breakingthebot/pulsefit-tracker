/*
 * tab1/tab1.page.ts
 * Logic for daily dashboard logs dashboard showing circular active progress, water widgets, and goals settings.
 * Connects to: services/fitness.service.ts
 * Created: 2026-07-21
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  IonBadge,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  footstepsOutline, 
  timeOutline, 
  flameOutline, 
  waterOutline, 
  addOutline, 
  removeOutline, 
  refreshOutline,
  settingsOutline
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
    ReactiveFormsModule,
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
    IonBadge,
    IonModal,
    IonItem,
    IonLabel,
    IonInput,
    IonButtons
  ]
})
export class Tab1Page {
  private fitnessService = inject(FitnessService);
  private fb = inject(FormBuilder);

  dailyMetrics$: Observable<DailyGoalMetrics> = this.fitnessService.dailyMetrics$;
  todayDate: string = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  goalsForm!: FormGroup;
  isSettingsOpen = false;

  constructor() {
    addIcons({ 
      footstepsOutline, 
      timeOutline, 
      flameOutline, 
      waterOutline, 
      addOutline, 
      removeOutline, 
      refreshOutline,
      settingsOutline
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

  openSettings(metrics: DailyGoalMetrics): void {
    this.goalsForm = this.fb.group({
      stepsGoal: [metrics.stepsGoal, [Validators.required, Validators.min(1000), Validators.max(50000)]],
      activeMinutesGoal: [metrics.activeMinutesGoal, [Validators.required, Validators.min(5), Validators.max(360)]],
      caloriesBurnedGoal: [metrics.caloriesBurnedGoal, [Validators.required, Validators.min(500), Validators.max(10000)]],
      waterGoalMl: [metrics.waterGoalMl, [Validators.required, Validators.min(500), Validators.max(10000)]]
    });
    this.isSettingsOpen = true;
  }

  saveSettings(): void {
    if (this.goalsForm.invalid) {
      return;
    }
    this.fitnessService.updateGoals(this.goalsForm.value);
    this.isSettingsOpen = false;
  }
}
