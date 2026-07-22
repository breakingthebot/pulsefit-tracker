/*
 * tab1/tab1.page.spec.ts
 * Tests Tab1Page progress rings calculations, water widget actions, and steps simulation logs.
 * Created: 2026-07-21
 */

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Tab1Page } from './tab1.page';
import { FitnessService } from '../services/fitness.service';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let service: FitnessService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Tab1Page],
      providers: [
        provideAnimationsAsync(),
        FitnessService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    service = TestBed.inject(FitnessService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create Tab1 page component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should calculate percentages correctly', () => {
    fixture.detectChanges();
    const pct = component.getPercentage(1500, 3000);
    expect(pct).toBe(50);

    const zeroGoal = component.getPercentage(100, 0);
    expect(zeroGoal).toBe(0);

    const overflow = component.getPercentage(5000, 4000);
    expect(overflow).toBe(100);
  });

  it('should compute circular stroke dashoffset correctly', () => {
    fixture.detectChanges();
    // 50% progress -> stroke offset should be half of circumference (125.6)
    const offset = component.getStrokeOffset(50, 100, 251.2);
    expect(offset).toBeCloseTo(125.6, 1);
  });

  it('should call FitnessService.addSteps when simulateSteps is clicked', () => {
    fixture.detectChanges();
    spyOn(service, 'addSteps');
    component.simulateSteps(5000);

    expect(service.addSteps).toHaveBeenCalledWith(5000);
  });

  it('should call FitnessService.addWater when logWater is clicked', () => {
    fixture.detectChanges();
    spyOn(service, 'addWater');
    component.logWater(250);

    expect(service.addWater).toHaveBeenCalledWith(250);
  });

  it('should render daily metrics and steps indicators in template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('.brand-title')?.textContent).toContain('PulseFit');
    expect(compiled.querySelector('.steps-color')).toBeTruthy();
  });
});
