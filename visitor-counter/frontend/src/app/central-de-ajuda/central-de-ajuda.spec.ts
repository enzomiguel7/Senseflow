import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralDeAjuda } from './central-de-ajuda';

describe('CentralDeAjuda', () => {
  let component: CentralDeAjuda;
  let fixture: ComponentFixture<CentralDeAjuda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentralDeAjuda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentralDeAjuda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
