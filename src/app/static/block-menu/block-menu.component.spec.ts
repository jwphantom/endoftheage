import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockMenuComponent } from './block-menu.component';

describe('BlockMenuComponent', () => {
  let component: BlockMenuComponent;
  let fixture: ComponentFixture<BlockMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
