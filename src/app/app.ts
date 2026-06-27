import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VoiceBot } from './components/voice-bot/voice-bot';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,VoiceBot],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('voicebot-ui');
}
