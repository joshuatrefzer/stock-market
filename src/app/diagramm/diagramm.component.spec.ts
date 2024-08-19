import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagrammComponent } from './diagramm.component';

describe('DiagrammComponent', () => {
  let component: DiagrammComponent;
  let fixture: ComponentFixture<DiagrammComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagrammComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiagrammComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
