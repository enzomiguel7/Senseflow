import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermosComponent } from './termos.component';
import { By } from '@angular/platform-browser';

describe('TermosComponent', () => {
  let component: TermosComponent;
  let fixture: ComponentFixture<TermosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermosComponent]  // Como é standalone, importamos direto
    }).compileComponents();

    fixture = TestBed.createComponent(TermosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit accepted event when accept() is called', () => {
    spyOn(component.accepted, 'emit');

    component.accept();

    expect(component.accepted.emit).toHaveBeenCalled();
  });

  it('should emit closed event when close() is called', () => {
    spyOn(component.closed, 'emit');

    component.close();

    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should emit accepted event via button click', () => {
    // Supondo que você tenha um botão para aceitar no template com (click)="accept()"
    const button = fixture.debugElement.query(By.css('.accept-button'));
    spyOn(component.accepted, 'emit');

    button.triggerEventHandler('click', null);

    expect(component.accepted.emit).toHaveBeenCalled();
  });

  it('should emit closed event via button click', () => {
    // Supondo que você tenha um botão para fechar no template com (click)="close()"
    const button = fixture.debugElement.query(By.css('.close-button'));
    spyOn(component.closed, 'emit');

    button.triggerEventHandler('click', null);

    expect(component.closed.emit).toHaveBeenCalled();
  });
});
