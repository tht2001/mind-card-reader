// Audio Manager for Mind Card Reader
class AudioManager {
    constructor() {
        this.bgMusic = null;
        this.soundEffects = {};
        this.isMuted = localStorage.getItem('audio-muted') === 'true';
        this.volume = parseFloat(localStorage.getItem('audio-volume') || '0.3');
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            // 创建背景音乐 - 使用神秘的氛围音乐
            this.bgMusic = new Audio();
            this.bgMusic.src = 'https://www.soundjay.com/misc/sounds/magic-wand-10.wav'; // 备用音源
            this.bgMusic.loop = true;
            this.bgMusic.volume = this.volume * 0.5; // 背景音乐音量稍低
            
            // 创建音效
            this.soundEffects = {
                cardFlip: this.createAudioElement('https://www.soundjay.com/misc/sounds/flip-card-1.wav'),
                magicSpell: this.createAudioElement('https://www.soundjay.com/misc/sounds/magic-spell-1.wav'),
                reveal: this.createAudioElement('https://www.soundjay.com/misc/sounds/magical-reveal.wav'),
                click: this.createAudioElement('https://www.soundjay.com/misc/sounds/button-click.wav')
            };

            // 设置音量
            this.updateVolume();
            
            this.initialized = true;
            console.log('Audio Manager initialized');
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }

    createAudioElement(src) {
        const audio = new Audio();
        audio.src = src;
        audio.volume = this.volume;
        return audio;
    }

    async playBackgroundMusic() {
        if (!this.initialized) await this.init();
        
        if (this.bgMusic && !this.isMuted) {
            try {
                await this.bgMusic.play();
            } catch (error) {
                console.warn('Background music play failed:', error);
            }
        }
    }

    stopBackgroundMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
    }

    async playSound(soundName) {
        if (!this.initialized) await this.init();
        
        if (this.soundEffects[soundName] && !this.isMuted) {
            try {
                const sound = this.soundEffects[soundName];
                sound.currentTime = 0;
                await sound.play();
            } catch (error) {
                console.warn(`Sound effect ${soundName} play failed:`, error);
            }
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('audio-muted', this.isMuted.toString());
        
        if (this.isMuted) {
            this.stopBackgroundMusic();
        } else {
            this.playBackgroundMusic();
        }
        
        this.updateMuteButton();
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('audio-volume', this.volume.toString());
        this.updateVolume();
    }

    updateVolume() {
        if (this.bgMusic) {
            this.bgMusic.volume = this.volume * 0.5;
        }
        
        Object.values(this.soundEffects).forEach(sound => {
            if (sound) sound.volume = this.volume;
        });
    }

    updateMuteButton() {
        const muteBtn = document.getElementById('audio-toggle');
        if (muteBtn) {
            const icon = muteBtn.querySelector('i');
            const text = muteBtn.querySelector('.audio-text');
            
            if (this.isMuted) {
                icon.className = 'fas fa-volume-mute';
                text.textContent = '音效已关闭';
            } else {
                icon.className = 'fas fa-volume-up';
                text.textContent = '音效开启';
            }
        }
    }

    // 用户交互后自动开始播放（浏览器策略要求）
    enableAudioAfterInteraction() {
        const enableAudio = () => {
            this.playBackgroundMusic();
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
        };
        
        document.addEventListener('click', enableAudio);
        document.addEventListener('touchstart', enableAudio);
    }
}

// 创建全局音频管理器实例
window.audioManager = new AudioManager();

// 导出
export { AudioManager }; 