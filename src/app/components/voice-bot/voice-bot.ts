import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoiceService } from '../../services/voice';

@Component({
  selector: 'app-voice-bot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voice-bot.html',
  styleUrls: ['./voice-bot.css']
})
export class VoiceBot {
  // Application state utilizing Angular Signals
  transcript = signal<string>('');
  botReply = signal<string>('');
  isListening = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  
  private recognition: any;

  constructor(private voiceService: VoiceService) {
    const { webkitSpeechRecognition, SpeechRecognition } = window as any;
    const SpeechApi = webkitSpeechRecognition || SpeechRecognition;

    if (SpeechApi) {
      this.recognition = new SpeechApi();
      this.recognition.continuous = false;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;

      this.recognition.onstart = () => this.isListening.set(true);
      this.recognition.onerror = () => this.isListening.set(false);
      this.recognition.onend = () => this.isListening.set(false);

      this.recognition.onresult = (event: any) => {
        const SpeechText = event.results[0][0].transcript;
        this.transcript.set(SpeechText);
        this.processVoiceData(SpeechText);
      };
    } else {
      console.warn('Speech Recognition API not supported in this browser engine.');
    }
  }

  toggleMicrophone(): void {
    if (!this.recognition) {
      alert('Speech synthesis / mic capture features are unavailable on this browser browser. Please switch to Google Chrome.');
      return;
    }

    if (this.isListening()) {
      this.recognition.stop();
    } else {
      this.transcript.set('');
      this.botReply.set('');
      this.recognition.start();
    }
  }

  private processVoiceData(text: string): void {
    this.isLoading.set(true);
    
    this.voiceService.sendTranscript(text).subscribe({
      next: (response) => {
        this.botReply.set(response.reply);
        this.isLoading.set(false);
        this.triggerTextToSpeech(response.reply);
      },
      error: (err) => {
        console.error('Backend pipeline fault encountered:', err);
        this.isLoading.set(false);
        this.botReply.set('Sorry, my server ran into an issue processing that. Please try again.');
        this.triggerTextToSpeech('Sorry, my server ran into an issue processing that.');
      }
    });
  }

  private triggerTextToSpeech(message: string): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Terminate existing playback queues instantly
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0; 
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }
}