/*
 * tab2/tab2.page.spec.ts
 * Tests Tab2Page form validations, conditional custom names, and list deletions.
 * Created: 2026-07-22
 */

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Tab2Page } from './tab2.page';
import { FitnessService } from '../services/fitness.service';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let service: FitnessService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Tab2Page],
      providers: [
        provideAnimationsAsync(),
        FitnessService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    service = TestBed.inject(FitnessService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create Tab2 page component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls with defaults', () => {
    expect(component.workoutForm).toBeDefined();
    expect(component.workoutForm.get('activityType')?.value).toBe('Run');
    expect(component.workoutForm.get('durationMinutes')?.value).toBeNull();
  });

  it('should invalidate form if fields are empty or invalid range', () => {
    const form = component.workoutForm;
    form.patchValue({
      activityType: 'Run',
      durationMinutes: -10, // Invalid min
      caloriesBurned: 100
    });
    expect(form.invalid).toBeTrue();

    form.patchValue({
      durationMinutes: 45,
      caloriesBurned: 6000 // Invalid max
    });
    expect(form.invalid).toBeTrue();
  });

  it('should require customActivityName when activityType is Custom', () => {
    const form = component.workoutForm;
    form.patchValue({
      activityType: 'Custom',
      durationMinutes: 30,
      caloriesBurned: 200,
      customActivityName: '' // Empty
    });
    expect(form.invalid).toBeTrue();

    form.patchValue({
      customActivityName: 'Skiing'
    });
    expect(form.valid).toBeTrue();
  });

  it('should call FitnessService.addWorkout and reset form on valid onSubmit', () => {
    spyOn(service, 'addWorkout');
    const form = component.workoutForm;
    
    form.patchValue({
      activityType: 'Gym',
      durationMinutes: 60,
      caloriesBurned: 450,
      notes: 'Power lifting routine'
    });

    component.onSubmit();

    expect(service.addWorkout).toHaveBeenCalledWith({
      activityType: 'Gym',
      durationMinutes: 60,
      caloriesBurned: 450,
      notes: 'Power lifting routine',
      customActivityName: undefined
    });

    expect(form.get('durationMinutes')?.value).toBeNull();
    expect(form.get('activityType')?.value).toBe('Run');
  });

  it('should dispatch deleteWorkout calls to FitnessService', () => {
    spyOn(service, 'deleteWorkout');
    component.deleteWorkout('WORKOUT-123');

    expect(service.deleteWorkout).toHaveBeenCalledWith('WORKOUT-123');
  });
});
