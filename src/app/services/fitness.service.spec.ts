/*
 * services/fitness.service.spec.ts
 * Asserts fitness daily metrics updates, workout logs additions, and LocalStorage sync.
 * Created: 2026-07-21
 */

import { TestBed } from '@angular/core/testing';
import { FitnessService } from './fitness.service';
import { WorkoutSession } from '../models/workout.model';
import { take } from 'rxjs';

describe('FitnessService', () => {
  let service: FitnessService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitnessService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created and populate initial mock data', (done) => {
    expect(service).toBeTruthy();
    service.workouts$.pipe(take(1)).subscribe(workouts => {
      expect(workouts.length).toBe(2);
      expect(workouts[0].activityType).toBe('Run');
      done();
    });
  });

  it('should add steps and increment calories and active minutes', (done) => {
    service.resetDailyStats(); // Reset to zero BMR base
    service.addSteps(2000); // 2000 * 0.04 = 80 calories, 20 minutes

    service.dailyMetrics$.pipe(take(1)).subscribe(metrics => {
      expect(metrics.stepsCount).toBe(2000);
      expect(metrics.activeMinutes).toBe(20);
      expect(metrics.caloriesBurned).toBe(1880); // 1800 BMR + 80 steps
      done();
    });
  });

  it('should add water volume intake', (done) => {
    service.resetDailyStats();
    service.addWater(500);

    service.dailyMetrics$.pipe(take(1)).subscribe(metrics => {
      expect(metrics.waterIntakeMl).toBe(500);
      done();
    });
  });

  it('should add workout logs and recalculate daily stats', (done) => {
    service.resetDailyStats();
    const newSession: Omit<WorkoutSession, 'id' | 'timestamp'> = {
      activityType: 'Cycle',
      durationMinutes: 45,
      caloriesBurned: 400,
      notes: 'Evening velodrome cycle'
    };

    service.addWorkout(newSession);

    service.workouts$.pipe(take(1)).subscribe(workouts => {
      expect(workouts.length).toBe(3);
      expect(workouts[0].activityType).toBe('Cycle');
    });

    service.dailyMetrics$.pipe(take(1)).subscribe(metrics => {
      expect(metrics.activeMinutes).toBe(45);
      expect(metrics.caloriesBurned).toBe(2200); // 1800 BMR + 400 cycle
      done();
    });
  });

  it('should delete workout session and adjust today stats downwards', (done) => {
    service.resetDailyStats();
    const initialSession: Omit<WorkoutSession, 'id' | 'timestamp'> = {
      activityType: 'Gym',
      durationMinutes: 60,
      caloriesBurned: 300
    };

    service.addWorkout(initialSession);

    // Get the added ID
    let addedId = '';
    service.workouts$.pipe(take(1)).subscribe(workouts => {
      addedId = workouts[0].id;
    });

    // Delete it
    service.deleteWorkout(addedId);

    // Assert workouts list is back to mock data size (2)
    service.workouts$.pipe(take(1)).subscribe(workouts => {
      expect(workouts.length).toBe(2);
    });

    // Assert stats are decremented
    service.dailyMetrics$.pipe(take(1)).subscribe(metrics => {
      expect(metrics.activeMinutes).toBe(0);
      expect(metrics.caloriesBurned).toBe(1800);
      done();
    });
  });
});
