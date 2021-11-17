import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatpostComponent } from './catpost.component';

describe('CatpostComponent', () => {
  let component: CatpostComponent;
  let fixture: ComponentFixture<CatpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatpostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
