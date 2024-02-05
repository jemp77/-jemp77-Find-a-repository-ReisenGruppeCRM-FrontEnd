import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScratchGameComponent } from './scratch-game.component';

describe('ScratchGameComponent', () => {
  let component: ScratchGameComponent;
  let fixture: ComponentFixture<ScratchGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScratchGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScratchGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
