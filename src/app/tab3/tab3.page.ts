/*
 * tab3/tab3.page.ts
 * Logic for displaying weekly summaries, SVG calorie bar charts, and category splits.
 * Connects to: services/fitness.service.ts, models/workout.model.ts
 * Created: 2026-07-22
 */

import { Component, inject, OnInit } from '@angular/core';
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
  IonIcon,
  IonList
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  barChartOutline, 
  flameOutline, 
  pieChartOutline, 
  trendingUpOutline, 
  trophyOutline, 
  timeOutline, 
  fitnessOutline 
} from 'ionicons/icons';

import { FitnessService } from '../services/fitness.service';
import { WorkoutSession, ActivityType } from '../models/workout.model';
import { Subscription } from 'rxjs';

interface DailyBar {
  dayLabel: string;
  calories: number;
  height: number;
}

interface CategoryRatio {
  name: string;
  calories: number;
  percentage: number;
  colorClass: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
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
    IonIcon,
    IonList
  ]
})
export class Tab3Page implements OnInit {
  private fitnessService = inject(FitnessService);
  private sub = new Subscription();

  totalWorkouts: number = 0;
  totalDuration: number = 0;
  totalCalories: number = 0;

  weeklyBars: DailyBar[] = [];
  categoryRatios: CategoryRatio[] = [];

  constructor() {
    addIcons({ 
      barChartOutline, 
      flameOutline, 
      pieChartOutline, 
      trendingUpOutline, 
      trophyOutline, 
      timeOutline, 
      fitnessOutline 
    });
  }

  ngOnInit(): void {
    this.sub.add(
      this.fitnessService.workouts$.subscribe(workouts => {
        this.calculateMetrics(workouts);
        this.generateWeeklyChart(workouts);
        this.generateCategoryRatios(workouts);
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private calculateMetrics(workouts: WorkoutSession[]): void {
    this.totalWorkouts = workouts.length;
    this.totalDuration = workouts.reduce((sum, w) => sum + w.durationMinutes, 0);
    this.totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  }

  private generateWeeklyChart(workouts: WorkoutSession[]): void {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    
    // Generate dates for the last 7 days chronologically
    const last7Days: DailyBar[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayLabel = daysOfWeek[d.getDay()];
      
      // Sum calories for this date
      const dayCalories = workouts
        .filter(w => {
          const wDate = new Date(w.timestamp);
          return wDate.toDateString() === d.toDateString();
        })
        .reduce((sum, w) => sum + w.caloriesBurned, 0);
        
      last7Days.push({
        dayLabel,
        calories: dayCalories,
        height: 0
      });
    }

    // Scale heights relative to max value (max height = 80px in chart viewport)
    const maxCal = Math.max(...last7Days.map(d => d.calories), 300); // Baseline of 300 to avoid division by zero
    this.weeklyBars = last7Days.map(day => ({
      ...day,
      height: Math.round((day.calories / maxCal) * 80)
    }));
  }

  private generateCategoryRatios(workouts: WorkoutSession[]): void {
    const categories: { [key in ActivityType]?: number } = {};
    let totalWorkoutCal = 0;

    workouts.forEach(w => {
      categories[w.activityType] = (categories[w.activityType] || 0) + w.caloriesBurned;
      totalWorkoutCal += w.caloriesBurned;
    });

    const results: CategoryRatio[] = [];
    const colorMapping: { [key in ActivityType]: string } = {
      Run: 'run-color',
      Cycle: 'cycle-color',
      Walk: 'walk-color',
      Gym: 'gym-color',
      Yoga: 'yoga-color',
      Custom: 'custom-color'
    };

    (Object.keys(categories) as ActivityType[]).forEach(cat => {
      const cal = categories[cat] || 0;
      const pct = totalWorkoutCal > 0 ? Math.round((cal / totalWorkoutCal) * 100) : 0;
      results.push({
        name: cat,
        calories: cal,
        percentage: pct,
        colorClass: colorMapping[cat]
      });
    });

    // Sort by calorie burn descending
    this.categoryRatios = results.sort((a, b) => b.calories - a.calories);
  }
}
