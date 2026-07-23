/*
 * tab3/tab3.page.spec.ts
 * Tests Tab3Page data aggregations, SVG bar heights, and activity percentage splits.
 * Created: 2026-07-22
 */

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Tab3Page } from './tab3.page';
import { FitnessService } from '../services/fitness.service';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;
  let service: FitnessService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Tab3Page],
      providers: [
        provideAnimationsAsync(),
        FitnessService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab3Page);
    component = fixture.componentInstance;
    service = TestBed.inject(FitnessService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create Tab3 page component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should aggregate metrics from workouts history list', () => {
    fixture.detectChanges();
    // Default pre-populated mock data has 2 workouts:
    // Run (30m, 350 kcal) and Yoga (20m, 120 kcal)
    expect(component.totalWorkouts).toBe(2);
    expect(component.totalDuration).toBe(50);
    expect(component.totalCalories).toBe(470);
  });

  it('should generate weekly calorie bars', () => {
    fixture.detectChanges();
    expect(component.weeklyBars.length).toBe(7);
    
    // Check if at least today's bar contains calories
    const todayBar = component.weeklyBars[6]; // Today is the last day in chron list
    expect(todayBar.calories).toBeGreaterThanOrEqual(350);
    expect(todayBar.height).toBeGreaterThan(0);
  });

  it('should generate category ratios and sort them descending', () => {
    fixture.detectChanges();
    expect(component.categoryRatios.length).toBe(2); // Run and Yoga
    
    const firstRatio = component.categoryRatios[0];
    expect(firstRatio.name).toBe('Run'); // 350 kcal > 120 kcal
    expect(firstRatio.percentage).toBe(74); // 350 / 470 = ~74%
  });

  it('should render SVG containers and labels in template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('.weekly-svg-chart')).toBeTruthy();
    expect(compiled.querySelectorAll('.chart-bar').length).toBe(7);
    expect(compiled.querySelector('.custom-progress-track')).toBeTruthy();
  });
});
