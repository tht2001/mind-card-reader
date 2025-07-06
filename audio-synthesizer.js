// Web Audio Synthesizer for mystical sounds
class AudioSynthesizer {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.oscillators = [];
        this.isPlaying = false;
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.1; // 低音量
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    // 创建神秘的氛围背景音乐
    async startMysticalAmbient() {
        if (!this.audioContext) await this.init();
        if (this.isPlaying) return;

        this.isPlaying = true;
        
        // 低频氛围音
        this.createDroneOscillator(55, 'sine', 0.02); // A1
        this.createDroneOscillator(82.4, 'sine', 0.015); // E2
        this.createDroneOscillator(110, 'triangle', 0.01); // A2
        
        // 随机的神秘音符
        this.scheduleMysticalNotes();
        
        // 添加白噪音效果
        this.createWhiteNoise(0.005);
    }

    createDroneOscillator(frequency, type, volume) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        gainNode.gain.value = volume;
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.start();
        this.oscillators.push({ oscillator, gainNode });
    }

    scheduleMysticalNotes() {
        const scheduleNote = () => {
            if (!this.isPlaying) return;
            
            // 神秘的音阶 (小调五声音阶)
            const mysticalScale = [220, 246.94, 293.66, 369.99, 415.3, 440, 493.88];
            const frequency = mysticalScale[Math.floor(Math.random() * mysticalScale.length)];
            
            this.playMysticalNote(frequency, 2 + Math.random() * 3);
            
            // 随机间隔 3-8 秒
            setTimeout(scheduleNote, 3000 + Math.random() * 5000);
        };
        
        scheduleNote();
    }

    playMysticalNote(frequency, duration) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'triangle';
        oscillator.frequency.value = frequency;
        
        // 低通滤波器增加神秘感
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 1;
        
        gainNode.gain.value = 0;
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        const now = this.audioContext.currentTime;
        
        // 淡入
        gainNode.gain.linearRampToValueAtTime(0.03, now + 0.5);
        // 保持
        gainNode.gain.linearRampToValueAtTime(0.03, now + duration - 0.5);
        // 淡出
        gainNode.gain.linearRampToValueAtTime(0, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    createWhiteNoise(volume) {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = this.audioContext.createBufferSource();
        const noiseGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        
        noiseGain.gain.value = volume;
        
        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        
        whiteNoise.start();
        this.oscillators.push({ oscillator: whiteNoise, gainNode: noiseGain });
    }

    // 纸牌翻转音效
    playCardFlipSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.value = 800;
        
        const now = this.audioContext.currentTime;
        gainNode.gain.value = 0.1;
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    // 魔法音效
    playMagicSpellSound() {
        if (!this.audioContext) return;
        
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator1.type = 'sine';
        oscillator2.type = 'triangle';
        
        const now = this.audioContext.currentTime;
        
        oscillator1.frequency.value = 440;
        oscillator2.frequency.value = 660;
        
        oscillator1.frequency.exponentialRampToValueAtTime(880, now + 0.5);
        oscillator2.frequency.exponentialRampToValueAtTime(1320, now + 0.5);
        
        gainNode.gain.value = 0.05;
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator1.start(now);
        oscillator2.start(now);
        oscillator1.stop(now + 0.5);
        oscillator2.stop(now + 0.5);
    }

    // 揭晓答案音效
    playRevealSound() {
        if (!this.audioContext) return;
        
        const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        const now = this.audioContext.currentTime;
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = freq;
            
            const startTime = now + index * 0.1;
            gainNode.gain.value = 0;
            gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, startTime + 0.3);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    stopAll() {
        this.isPlaying = false;
        this.oscillators.forEach(({ oscillator }) => {
            try {
                oscillator.stop();
            } catch (e) {
                // 忽略已停止的振荡器
            }
        });
        this.oscillators = [];
    }

    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = volume * 0.1;
        }
    }
}

// 导出
window.audioSynthesizer = new AudioSynthesizer();
export { AudioSynthesizer }; 