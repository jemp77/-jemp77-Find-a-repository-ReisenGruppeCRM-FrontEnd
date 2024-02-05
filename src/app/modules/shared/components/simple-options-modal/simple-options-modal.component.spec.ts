import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleOptionsModalComponent } from './simple-options-modal.component';

describe('SimpleOptionsModalComponent', () => {
  let component: SimpleOptionsModalComponent;
  let fixture: ComponentFixture<SimpleOptionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleOptionsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
