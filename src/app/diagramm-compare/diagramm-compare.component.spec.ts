import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagrammCompareComponent } from './diagramm-compare.component';

describe('DiagrammCompareComponent', () => {
  let component: DiagrammCompareComponent;
  let fixture: ComponentFixture<DiagrammCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagrammCompareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiagrammCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
