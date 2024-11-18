// Default volume values
const DEFAULT_SFX_VOLUME = 0.5;
const DEFAULT_MUSIC_VOLUME = 0.5;

// Local storage keys
const SFX_VOLUME_KEY = 'sfx-volume';
const MUSIC_VOLUME_KEY = 'music-volume';

class AudioManager {
  private static instance: AudioManager;
  private sfxVolume: number;
  private musicVolume: number;
  private musicElements: HTMLAudioElement[] = [];

  private constructor() {
    // Initialize volumes from localStorage or use defaults
    this.sfxVolume = parseFloat(localStorage.getItem(SFX_VOLUME_KEY) || DEFAULT_SFX_VOLUME.toString());
    this.musicVolume = parseFloat(localStorage.getItem(MUSIC_VOLUME_KEY) || DEFAULT_MUSIC_VOLUME.toString());
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // Play a sound effect with the current SFX volume
  public playSFX(src: string): HTMLAudioElement {
    const audio = new Audio(src);
    audio.volume = this.sfxVolume;
    audio.play();
    return audio;
  }

  // Play music with the current music volume and track it for volume updates
  public playMusic(src: string): HTMLAudioElement {
    const audio = new Audio(src);
    console.log("volume", this.musicVolume, "playing music");
    audio.volume = this.musicVolume;
    audio.loop = true; // Most background music loops
    this.musicElements.push(audio);
    audio.play();
    return audio;
  }

  // Stop and cleanup a music element
  public stopMusic(audio: HTMLAudioElement | null): void {
    if (!audio) return;
    
    audio.pause();
    audio.currentTime = 0;
    const index = this.musicElements.indexOf(audio);
    if (index > -1) {
      this.musicElements.splice(index, 1);
    }
  }

  // Set SFX volume and save to localStorage
  public setSFXVolume(volume: number): void {
    this.sfxVolume = volume;
    localStorage.setItem(SFX_VOLUME_KEY, volume.toString());
  }

  // Set music volume, update all playing music, and save to localStorage
  public setMusicVolume(volume: number): void {
    this.musicVolume = volume;
    localStorage.setItem(MUSIC_VOLUME_KEY, volume.toString());
    
    // Update volume for all playing music
    this.musicElements.forEach(audio => {
      audio.volume = volume;
    });
  }

  // Get current SFX volume
  public getSFXVolume(): number {
    return this.sfxVolume;
  }

  // Get current music volume
  public getMusicVolume(): number {
    return this.musicVolume;
  }

  // Remove a music element from tracking when it's done
  public removeMusicElement(audio: HTMLAudioElement): void {
    const index = this.musicElements.indexOf(audio);
    if (index > -1) {
      this.musicElements.splice(index, 1);
    }
  }
}

export default AudioManager.getInstance();
