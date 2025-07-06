// Audio Manager for Mind Card Reader
class AudioManager {
    constructor() {
        this.isMuted = localStorage.getItem('audio-muted') === 'true';
        this.volume = parseFloat(localStorage.getItem('audio-volume') || '0.3');
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('audio-muted', this.isMuted.toString());
        
        if (this.isMuted) {
            if (window.audioSynthesizer) {
                window.audioSynthesizer.stopAll();
            }
        } else {
            if (window.audioSynthesizer) {
                window.audioSynthesizer.startMysticalAmbient();
            }
        }
        
        this.updateMuteButton();
        console.log('Audio muted:', this.isMuted);
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('audio-volume', this.volume.toString());
        
        if (window.audioSynthesizer) {
            window.audioSynthesizer.setVolume(this.volume);
        }
    }

    updateMuteButton() {
        const muteBtn = document.getElementById('audio-toggle');
        if (muteBtn) {
            const icon = muteBtn.querySelector('i');
            const text = muteBtn.querySelector('.audio-text');
            
            if (this.isMuted) {
                icon.className = 'fas fa-volume-mute mr-2';
                text.textContent = '音效已关闭';
            } else {
                icon.className = 'fas fa-volume-up mr-2';
                text.textContent = '音效开启';
            }
        }
    }

    playSound(soundName) {
        if (this.isMuted || !window.audioSynthesizer) return;
        
        switch(soundName) {
            case 'cardFlip':
                window.audioSynthesizer.playCardFlipSound();
                break;
            case 'magic':
                window.audioSynthesizer.playMagicSpellSound();
                break;
            case 'reveal':
                window.audioSynthesizer.playRevealSound();
                break;
        }
    }
}

// 直接挂载到window对象
window.audioManager = new AudioManager(); 