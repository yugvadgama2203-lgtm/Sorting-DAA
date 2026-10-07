/* ==========================================================================
   SortLab Interactive Sorting Challenge Game Module
   ========================================================================== */

class SortingGame {
  constructor() {
    this.array = [];
    this.selectedIndex = null;
    this.swapsCount = 0;
    this.score = 0;
    this.startTime = null;
    this.timerInterval = null;
    this.isPlaying = false;

    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('game-bars-wrapper');
    this.swapsLabel = document.getElementById('game-swaps');
    this.scoreLabel = document.getElementById('game-score');
    this.timerLabel = document.getElementById('game-timer');
    this.successCard = document.getElementById('game-success-message');
    this.startBtn = document.getElementById('start-game-btn');

    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.startNewGame());
    }
  }

  startNewGame() {
    this.array = [];
    const size = 7;
    while (this.array.length < size) {
      const val = Math.floor(Math.random() * 85) + 15;
      if (!this.array.includes(val)) this.array.push(val);
    }

    this.selectedIndex = null;
    this.swapsCount = 0;
    this.isPlaying = true;
    this.startTime = performance.now();

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);

    if (this.successCard) this.successCard.classList.add('hidden');
    if (this.swapsLabel) this.swapsLabel.textContent = '0';
    if (this.timerLabel) this.timerLabel.textContent = '00:00';

    this.render();
  }

  updateTimer() {
    if (!this.isPlaying || !this.startTime) return;
    const elapsedSec = Math.floor((performance.now() - this.startTime) / 1000);
    const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
    const secs = String(elapsedSec % 60).padStart(2, '0');
    if (this.timerLabel) this.timerLabel.textContent = `${mins}:${secs}`;
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const maxVal = Math.max(...this.array, 100);

    this.array.forEach((val, idx) => {
      const barCard = document.createElement('div');
      barCard.className = 'game-bar-card';
      if (this.selectedIndex === idx) {
        barCard.classList.add('selected');
      }

      // Calculate proportional height
      const heightPx = Math.max(45, (val / maxVal) * 200);
      barCard.style.height = `${heightPx}px`;
      barCard.textContent = val;

      barCard.addEventListener('click', () => this.handleCardClick(idx));
      this.container.appendChild(barCard);
    });

    this.checkIfSorted();
  }

  handleCardClick(idx) {
    if (!this.isPlaying) return;

    if (this.selectedIndex === null) {
      this.selectedIndex = idx;
      if (window.soundSynth) window.soundSynth.playTone(this.array[idx]);
    } else if (this.selectedIndex === idx) {
      this.selectedIndex = null;
    } else {
      // Perform Swap
      const temp = this.array[this.selectedIndex];
      this.array[this.selectedIndex] = this.array[idx];
      this.array[idx] = temp;

      this.swapsCount++;
      if (this.swapsLabel) this.swapsLabel.textContent = this.swapsCount;
      if (window.soundSynth) window.soundSynth.playTone(this.array[idx]);

      this.selectedIndex = null;
    }

    this.render();
  }

  checkIfSorted() {
    const isSorted = this.array.every((val, i, arr) => i === 0 || arr[i - 1] <= val);

    if (isSorted && this.isPlaying) {
      this.isPlaying = false;
      if (this.timerInterval) clearInterval(this.timerInterval);

      const elapsedSec = Math.floor((performance.now() - this.startTime) / 1000);
      const points = Math.max(100, 1000 - elapsedSec * 10 - this.swapsCount * 25);
      this.score += points;

      if (this.scoreLabel) this.scoreLabel.textContent = this.score;

      // Mark all green
      document.querySelectorAll('.game-bar-card').forEach(card => card.classList.add('correct'));

      if (this.successCard) {
        this.successCard.classList.remove('hidden');
        const summary = document.getElementById('game-result-summary');
        if (summary) {
          summary.textContent = `You completed the challenge in ${elapsedSec}s with ${this.swapsCount} swaps! Earned +${points} points.`;
        }
      }

      if (window.soundSynth) {
        // Victory chime sound
        window.soundSynth.playTone(600, 5, 100, 0.15);
        setTimeout(() => window.soundSynth.playTone(800, 5, 100, 0.2), 150);
        setTimeout(() => window.soundSynth.playTone(1000, 5, 100, 0.3), 300);
      }
    }
  }
}

window.SortingGame = SortingGame;
