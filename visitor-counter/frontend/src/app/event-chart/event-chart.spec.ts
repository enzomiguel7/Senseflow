import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChart } from './event-chart';

describe('EventChart', () => {
  let component: EventChart;
  let fixture: ComponentFixture<EventChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
