/*
 * tab2/tab2.page.ts
 * Form controller for logging workouts and viewing history list.
 * Connects to: services/fitness.service.ts, models/workout.model.ts
 * Created: 2026-07-22
 */

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
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
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonNote
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  addOutline, 
  trashOutline, 
  timeOutline, 
  flameOutline, 
  documentTextOutline, 
  walkOutline, 
  bicycleOutline, 
  barbellOutline, 
  fitnessOutline, 
  pulseOutline, 
  bodyOutline, 
  calendarOutline
} from 'ionicons/icons';

import { FitnessService } from '../services/fitness.service';
import { WorkoutSession, ActivityType } from '../models/workout.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
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
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonList,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonNote
  ]
})
export class Tab2Page implements OnInit {
  private fb = inject(FormBuilder);
  private fitnessService = inject(FitnessService);

  workoutForm!: FormGroup;
  workouts$: Observable<WorkoutSession[]> = this.fitnessService.workouts$;

  activityTypes: ActivityType[] = ['Run', 'Cycle', 'Walk', 'Gym', 'Yoga', 'Custom'];

  constructor() {
    addIcons({ 
      addOutline, 
      trashOutline, 
      timeOutline, 
      flameOutline, 
      documentTextOutline, 
      walkOutline, 
      bicycleOutline, 
      barbellOutline, 
      fitnessOutline, 
      pulseOutline, 
      bodyOutline, 
      calendarOutline
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.workoutForm = this.fb.group({
      activityType: ['Run', Validators.required],
      customActivityName: [''],
      durationMinutes: [null, [Validators.required, Validators.min(1), Validators.max(480)]],
      caloriesBurned: [null, [Validators.required, Validators.min(1), Validators.max(5000)]],
      notes: ['']
    });

    // Handle conditional validation for Custom name
    this.workoutForm.get('activityType')?.valueChanges.subscribe(value => {
      const customNameControl = this.workoutForm.get('customActivityName');
      if (value === 'Custom') {
        customNameControl?.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(30)]);
      } else {
        customNameControl?.clearValidators();
      }
      customNameControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.workoutForm.invalid) {
      return;
    }

    const value = this.workoutForm.value;
    const workoutData: Omit<WorkoutSession, 'id' | 'timestamp'> = {
      activityType: value.activityType,
      durationMinutes: Number(value.durationMinutes),
      caloriesBurned: Number(value.caloriesBurned),
      notes: value.notes || undefined,
      customActivityName: value.activityType === 'Custom' ? value.customActivityName : undefined
    };

    this.fitnessService.addWorkout(workoutData);
    this.workoutForm.reset({
      activityType: 'Run',
      customActivityName: '',
      durationMinutes: null,
      caloriesBurned: null,
      notes: ''
    });
  }

  deleteWorkout(id: string): void {
    this.fitnessService.deleteWorkout(id);
  }

  getActivityIcon(type: ActivityType): string {
    switch (type) {
      case 'Run': return 'walk-outline';
      case 'Cycle': return 'bicycle-outline';
      case 'Walk': return 'body-outline';
      case 'Gym': return 'barbell-outline';
      case 'Yoga': return 'fitness-outline';
      default: return 'pulse-outline';
    }
  }

  formatDate(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
