import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceBot } from './voice-bot';

describe('VoiceBot', () => {
  let component: VoiceBot;
  let fixture: ComponentFixture<VoiceBot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceBot],
    }).compileComponents();

    fixture = TestBed.createComponent(VoiceBot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
