import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoTranslationComponent } from './bo-translation.component';

describe('BoTranslationComponent', () => {
  let component: BoTranslationComponent;
  let fixture: ComponentFixture<BoTranslationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoTranslationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
