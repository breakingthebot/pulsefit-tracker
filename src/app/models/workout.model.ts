/*
 * models/workout.model.ts
 * Defines workout activity log entries and daily goal metrics interfaces.
 * Created: 2026-07-21
 */

export type ActivityType = 'Run' | 'Cycle' | 'Walk' | 'Gym' | 'Yoga' | 'Custom';

export interface WorkoutSession {
  id: string;
  activityType: ActivityType;
  customActivityName?: string;
  durationMinutes: number;
  caloriesBurned: number;
  notes?: string;
  timestamp: string; // ISO string format
}

export interface DailyGoalMetrics {
  stepsCount: number;
  stepsGoal: number;
  activeMinutes: number;
  activeMinutesGoal: number;
  caloriesBurned: number; // Sum of default resting BMR + active workout burns
  caloriesBurnedGoal: number;
  waterIntakeMl: number;
  waterGoalMl: number;
}
