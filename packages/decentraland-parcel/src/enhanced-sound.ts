// Enhanced Sound System for AIGestion Virtual Office
import { AudioSource, engine } from '@dcl/sdk/ecs'

export class SoundSystem {
  private audioSources: Map<string, any> = new Map()
  private masterVolume: number = 0.5

  // Initialize sound system
  initialize() {
    console.log('🔊 Sound System Initializing...')

    // Create ambient background sound
    this.createAmbientSound()

    // Create interaction sounds
    this.createInteractionSounds()

    console.log('🔊 Sound System Ready!')
  }

  // Create ambient background sound
  private createAmbientSound() {
    const ambientSource = engine.addEntity()
    AudioSource.create(ambientSource, {
      playing: true,
      loop: true,
      volume: this.masterVolume * 0.3,
      audioClipUrl: 'sounds/ambient-quantum.mp3'
    })

    this.audioSources.set('ambient', ambientSource)
  }

  // Create interaction sound effects
  private createInteractionSounds() {
    // Click sound
    const clickSource = engine.addEntity()
    AudioSource.create(clickSource, {
      playing: false,
      loop: false,
      volume: this.masterVolume * 0.8,
      audioClipUrl: 'sounds/interface-click.mp3'
    })

    this.audioSources.set('click', clickSource)

    // Alert sound
    const alertSource = engine.addEntity()
    AudioSource.create(alertSource, {
      playing: false,
      loop: false,
      volume: this.masterVolume * 0.9,
      audioClipUrl: 'sounds/alert-chime.mp3'
    })

    this.audioSources.set('alert', alertSource)

    // Power up sound
    const powerUpSource = engine.addEntity()
    AudioSource.create(powerUpSource, {
      playing: false,
      loop: false,
      volume: this.masterVolume * 0.7,
      audioClipUrl: 'sounds/power-up.mp3'
    })

    this.audioSources.set('powerup', powerUpSource)
  }

  // Play specific sound
  playSound(soundName: string) {
    const source = this.audioSources.get(soundName)
    if (source) {
      const audioSource = AudioSource.getMutable(source)
      audioSource.playing = true

      // Reset non-looping sounds after playing
      if (!audioSource.loop) {
        setTimeout(() => {
          audioSource.playing = false
        }, 1000)
      }
    }
  }

  // Stop specific sound
  stopSound(soundName: string) {
    const source = this.audioSources.get(soundName)
    if (source) {
      AudioSource.getMutable(source).playing = false
    }
  }

  // Set master volume
  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume))

    // Update all audio sources
    this.audioSources.forEach((source, name) => {
      const audioSource = AudioSource.getMutable(source)
      if (name === 'ambient') {
        audioSource.volume = this.masterVolume * 0.3
      } else {
        audioSource.volume = this.masterVolume * 0.8
      }
    })
  }

  // Play interaction sound based on type
  playInteractionSound(type: 'click' | 'alert' | 'powerup' | 'error') {
    switch (type) {
      case 'click':
        this.playSound('click')
        break
      case 'alert':
        this.playSound('alert')
        break
      case 'powerup':
        this.playSound('powerup')
        break
      case 'error':
        // Could add error sound here
        this.playSound('alert')
        break
    }
  }

  // Cleanup sound system
  cleanup() {
    this.audioSources.forEach(source => {
      engine.removeEntity(source)
    })
    this.audioSources.clear()
  }
}

// Export singleton instance
export const soundSystem = new SoundSystem()
