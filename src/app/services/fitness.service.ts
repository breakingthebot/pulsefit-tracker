/*
 * services/fitness.service.ts
 * Manages daily goal metrics and workout session history with LocalStorage persistence.
 * Connects to: models/workout.model.ts
 * Created: 2026-07-21
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WorkoutSession, DailyGoalMetrics, ActivityType } from '../models/workout.model';

const STORAGE_WORKOUTS_KEY = 'FITNESS_WORKOUT_SESSIONS';
const STORAGE_DAILY_KEY = 'FITNESS_DAILY_METRICS';

@Injectable({
  providedIn: 'root'
})
export class FitnessService {
  private workoutsSubject = new BehaviorSubject<WorkoutSession[]>([]);
  private dailyMetricsSubject = new BehaviorSubject<DailyGoalMetrics>(this.getDefaultDailyMetrics());

  workouts$: Observable<WorkoutSession[]> = this.workoutsSubject.asObservable();
  dailyMetrics$: Observable<DailyGoalMetrics> = this.dailyMetricsSubject.asObservable();

  constructor() {
    this.initializeState();
  }

  /* Core Daily Metric Modifiers */

  addSteps(steps: number): void {
    const current = this.dailyMetricsSubject.value;
    const addedCal = Math.round(steps * 0.04); // Approx 0.04 calories per step
    const addedMinutes = Math.round(steps / 100); // Approx 1 minute per 100 steps
    
    const updated: DailyGoalMetrics = {
      ...current,
      stepsCount: current.stepsCount + steps,
      caloriesBurned: current.caloriesBurned + addedCal,
      activeMinutes: current.activeMinutes + addedMinutes
    };
    
    this.updateDailyMetrics(updated);
  }

  addWater(ml: number): void {
    const current = this.dailyMetricsSubject.value;
    const updated: DailyGoalMetrics = {
      ...current,
      waterIntakeMl: Math.max(0, current.waterIntakeMl + ml)
    };
    this.updateDailyMetrics(updated);
  }

  /* Workout Sessions Actions */

  addWorkout(session: Omit<WorkoutSession, 'id' | 'timestamp'>): void {
    const newSession: WorkoutSession = {
      ...session,
      id: 'WORKOUT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date().toISOString()
    };

    const currentWorkouts = this.workoutsSubject.value;
    this.workoutsSubject.next([newSession, ...currentWorkouts]);
    this.saveWorkoutsToStorage();

    // Dynamically update daily goals metrics
    const currentDaily = this.dailyMetricsSubject.value;
    this.updateDailyMetrics({
      ...currentDaily,
      activeMinutes: currentDaily.activeMinutes + session.durationMinutes,
      caloriesBurned: currentDaily.caloriesBurned + session.caloriesBurned
    });
  }

  deleteWorkout(id: string): void {
    const currentWorkouts = this.workoutsSubject.value;
    const target = currentWorkouts.find(w => w.id === id);
    if (!target) return;

    const filtered = currentWorkouts.filter(w => w.id !== id);
    this.workoutsSubject.next(filtered);
    this.saveWorkoutsToStorage();

    // Adjust daily stats downwards based on deleted workout
    const currentDaily = this.dailyMetricsSubject.value;
    this.updateDailyMetrics({
      ...currentDaily,
      activeMinutes: Math.max(0, currentDaily.activeMinutes - target.durationMinutes),
      caloriesBurned: Math.max(0, currentDaily.caloriesBurned - target.caloriesBurned)
    });
  }

  resetDailyStats(): void {
    const defaults = this.getDefaultDailyMetrics();
    this.updateDailyMetrics(defaults);
  }

  /* Internal Helpers */

  private getDefaultDailyMetrics(): DailyGoalMetrics {
    return {
      stepsCount: 0,
      stepsGoal: 10000,
      activeMinutes: 0,
      activeMinutesGoal: 45,
      caloriesBurned: 1800, // Pre-population accounts for resting energy expenditure BMR
      caloriesBurnedGoal: 2400,
      waterIntakeMl: 0,
      waterGoalMl: 2500
    };
  }

  private initializeState(): void {
    const savedWorkouts = localStorage.getItem(STORAGE_WORKOUTS_KEY);
    const savedDaily = localStorage.getItem(STORAGE_DAILY_KEY);

    if (savedWorkouts) {
      try {
        this.workoutsSubject.next(JSON.parse(savedWorkouts));
      } catch (e) {
        console.error('Failed to parse workouts from storage:', e);
      }
    } else {
      // Pre-populate with beautiful sample entries for demonstration
      this.populateMockData();
    }

    if (savedDaily) {
      try {
        this.dailyMetricsSubject.next(JSON.parse(savedDaily));
      } catch (e) {
        console.error('Failed to parse daily metrics from storage:', e);
      }
    }
  }

  private populateMockData(): void {
    const mockSessions: WorkoutSession[] = [
      {
        id: 'WORKOUT-MOCK1',
        activityType: 'Run',
        durationMinutes: 30,
        caloriesBurned: 350,
        notes: 'Outdoor neighborhood jog. Felt energetic!',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
      },
      {
        id: 'WORKOUT-MOCK2',
        activityType: 'Yoga',
        durationMinutes: 20,
        caloriesBurned: 120,
        notes: 'Morning flexibility stretching session.',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString() // 24 hours ago
      }
    ];

    this.workoutsSubject.next(mockSessions);
    this.saveWorkoutsToStorage();

    // Adjust today's metrics by adding the first mock session
    const current = this.dailyMetricsSubject.value;
    const initialToday: DailyGoalMetrics = {
      ...current,
      stepsCount: 4200, // Pre-set mock steps
      activeMinutes: 30 + Math.round(4200 / 100), // Run minutes + step minutes
      caloriesBurned: 1800 + 350 + Math.round(4200 * 0.04)
    };
    this.updateDailyMetrics(initialToday);
  }

  private updateDailyMetrics(metrics: DailyGoalMetrics): void {
    this.dailyMetricsSubject.next(metrics);
    localStorage.setItem(STORAGE_DAILY_KEY, JSON.stringify(metrics));
  }

  private saveWorkoutsToStorage(): void {
    localStorage.setItem(STORAGE_WORKOUTS_KEY, JSON.stringify(this.workoutsSubject.value));
  }
}
