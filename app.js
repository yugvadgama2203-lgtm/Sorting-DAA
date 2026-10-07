/* ==========================================================================
   SortLab Main Application Orchestrator
   Handles Array Sorting & DAA Graph Algorithms (Dijkstra, Prim's, Kruskal's)
   Dual Race Arena supports side-by-side Sorting & Graph algorithm benchmarking
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const mainVisualizer = new VisualizerEngine('main-canvas');
  const raceEngine1 = new VisualizerEngine('race-canvas-1');
  const raceEngine2 = new VisualizerEngine('race-canvas-2');
  const game = new SortingGame();

  let currentArray = [];

  // =========================================================================
  // Tab Navigation
  // =========================================================================
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      navBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetTab).classList.add('active');

      setTimeout(() => {
        mainVisualizer.resizeCanvas();
        raceEngine1.resizeCanvas();
        raceEngine2.resizeCanvas();
      }, 50);

      if (targetTab === 'game-mode' && game.array.length === 0) {
        game.startNewGame();
      }
    });
  });

  // =========================================================================
  // Array Generator Utilities
  // =========================================================================
  function generateArray(size, type = 'random') {
    let arr = [];
    if (type === 'random') {
      for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 92) + 8);
      }
    } else if (type === 'nearly-sorted') {
      for (let i = 0; i < size; i++) {
        arr.push(Math.floor((i + 1) * (90 / size)) + 10);
      }
      const swapsCount = Math.max(1, Math.floor(size * 0.1));
      for (let s = 0; s < swapsCount; s++) {
        const i1 = Math.floor(Math.random() * size);
        const i2 = Math.floor(Math.random() * size);
        [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
      }
    } else if (type === 'reversed') {
      for (let i = size; i >= 1; i--) {
        arr.push(Math.floor(i * (90 / size)) + 10);
      }
    } else if (type === 'few-unique') {
      const values = [20, 45, 70, 95];
      for (let i = 0; i < size; i++) {
        arr.push(values[Math.floor(Math.random() * values.length)]);
      }
    } else if (type === 'pyramid') {
      const half = Math.floor(size / 2);
      for (let i = 0; i < half; i++) {
        arr.push(Math.floor((i + 1) * (90 / half)) + 10);
      }
      for (let i = size - half; i >= 1; i--) {
        arr.push(Math.floor(i * (90 / half)) + 10);
      }
    }
    return arr;
  }

  // =========================================================================
  // Single Visualizer Controls
  // =========================================================================
  const algoSelect = document.getElementById('algorithm-select');
  const sizeSlider = document.getElementById('array-size-slider');
  const sizeVal = document.getElementById('array-size-val');
  const speedSlider = document.getElementById('speed-slider');
  const speedVal = document.getElementById('speed-val');
  const typeSelect = document.getElementById('array-type-select');

  const arraySizeGroup = document.getElementById('array-size-group');
  const arrayTypeGroup = document.getElementById('array-type-group');

  const generateBtn = document.getElementById('generate-btn');
  const playBtn = document.getElementById('play-btn');
  const stepPrevBtn = document.getElementById('step-prev-btn');
  const stepNextBtn = document.getElementById('step-next-btn');
  const resetBtn = document.getElementById('reset-btn');

  function isGraphAlgo(key) {
    return ['dijkstra', 'prims', 'kruskal'].includes(key);
  }

  function initSingleVisualizer() {
    const algoKey = algoSelect.value;
    const isGraph = isGraphAlgo(algoKey);

    if (isGraph) {
      if (arraySizeGroup) arraySizeGroup.style.display = 'none';
      if (arrayTypeGroup) arrayTypeGroup.style.display = 'none';
      document.getElementById('pointer-legend').style.display = 'none';
    } else {
      if (arraySizeGroup) arraySizeGroup.style.display = 'flex';
      if (arrayTypeGroup) arrayTypeGroup.style.display = 'flex';
      document.getElementById('pointer-legend').style.display = 'flex';

      const size = parseInt(sizeSlider.value);
      const type = typeSelect.value;
      currentArray = generateArray(size, type);
      mainVisualizer.setArray(currentArray);
    }

    setupAlgorithmSteps();
    updateAlgorithmBadge();
  }

  function setupAlgorithmSteps() {
    const algoKey = algoSelect.value;
    renderPseudocode(algoKey);

    let generatorFunc;
    let isGraph = isGraphAlgo(algoKey);

    switch (algoKey) {
      case 'bubble': generatorFunc = Algorithms.bubbleSort; break;
      case 'selection': generatorFunc = Algorithms.selectionSort; break;
      case 'insertion': generatorFunc = Algorithms.insertionSort; break;
      case 'quick': generatorFunc = Algorithms.quickSort; break;
      case 'merge': generatorFunc = Algorithms.mergeSort; break;
      case 'heap': generatorFunc = Algorithms.heapSort; break;
      case 'dijkstra': generatorFunc = Algorithms.dijkstra; break;
      case 'prims': generatorFunc = Algorithms.prims; break;
      case 'kruskal': generatorFunc = Algorithms.kruskal; break;
      default: generatorFunc = Algorithms.quickSort;
    }

    if (isGraph) {
      mainVisualizer.loadSteps(generatorFunc(getDefaultGraph()));
    } else {
      mainVisualizer.loadSteps(generatorFunc(currentArray));
    }
  }

  function updateAlgorithmBadge() {
    const algoKey = algoSelect.value;
    const info = TheoryData[algoKey] || TheoryData.quick;
    const badge = document.getElementById('current-algo-badge');
    if (badge) {
      badge.querySelector('.algo-title').textContent = info.name;
      badge.querySelector('.algo-complexity').textContent = info.complexity;
    }
  }

  mainVisualizer.onStepCallback = (step, currentIdx, totalSteps, elapsedMs) => {
    document.getElementById('metric-comparisons').textContent = step.comparisons || 0;
    document.getElementById('metric-swaps').textContent = step.swaps || 0;
    document.getElementById('metric-time').textContent = `${elapsedMs} ms`;
    document.getElementById('metric-steps').textContent = `${currentIdx + 1} / ${totalSteps}`;

    highlightCodeLine(step.line);
    const explainer = document.getElementById('step-explanation');
    if (explainer) explainer.textContent = step.explanation || 'Processing algorithm step...';
  };

  mainVisualizer.onCompleteCallback = () => {
    playBtn.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Replay';
  };

  // Listeners
  generateBtn.addEventListener('click', () => {
    mainVisualizer.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Execution';
    initSingleVisualizer();
  });

  algoSelect.addEventListener('change', () => {
    mainVisualizer.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Execution';
    initSingleVisualizer();
  });

  sizeSlider.addEventListener('input', (e) => {
    sizeVal.textContent = e.target.value;
    mainVisualizer.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Execution';
    initSingleVisualizer();
  });

  speedSlider.addEventListener('input', (e) => {
    speedVal.textContent = `${e.target.value}x`;
    mainVisualizer.setSpeed(e.target.value);
  });

  typeSelect.addEventListener('change', () => {
    mainVisualizer.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Execution';
    initSingleVisualizer();
  });

  playBtn.addEventListener('click', () => {
    if (mainVisualizer.isPlaying) {
      mainVisualizer.pause();
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
    } else {
      mainVisualizer.play();
      playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
    }
  });

  stepNextBtn.addEventListener('click', () => {
    mainVisualizer.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
    mainVisualizer.stepForward();
  });

  stepPrevBtn.addEventListener('click', () => {
    mainVisualizer.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
    mainVisualizer.stepBackward();
  });

  resetBtn.addEventListener('click', () => {
    mainVisualizer.reset();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Execution';
    document.getElementById('metric-comparisons').textContent = '0';
    document.getElementById('metric-swaps').textContent = '0';
    document.getElementById('metric-time').textContent = '0 ms';
  });

  // Custom Input Modal logic
  const customModal = document.getElementById('custom-modal');
  const customBtn = document.getElementById('custom-input-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const applyCustomBtn = document.getElementById('apply-custom-btn');
  const customInputText = document.getElementById('custom-array-input');
  const modalError = document.getElementById('modal-error');

  customBtn.addEventListener('click', () => customModal.classList.remove('hidden'));
  closeModalBtn.addEventListener('click', () => customModal.classList.add('hidden'));

  applyCustomBtn.addEventListener('click', () => {
    const valStr = customInputText.value.trim();
    if (!valStr) return;

    const parsed = valStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0 && n <= 100);
    if (parsed.length < 3) {
      modalError.classList.remove('hidden');
      return;
    }

    modalError.classList.add('hidden');
    customModal.classList.add('hidden');

    currentArray = parsed;
    mainVisualizer.setArray(currentArray);
    setupAlgorithmSteps();
  });

  // =========================================================================
  // Dual Race Arena Engine Sync (Supports Sorting & Graph Algorithms)
  // =========================================================================
  const raceAlgo1Select = document.getElementById('race-algo-1');
  const raceAlgo2Select = document.getElementById('race-algo-2');
  const raceSizeSlider = document.getElementById('race-size-slider');
  const raceSizeVal = document.getElementById('race-size-val');
  const raceSpeedSlider = document.getElementById('race-speed-slider');
  const raceSpeedVal = document.getElementById('race-speed-val');
  const raceStartBtn = document.getElementById('race-start-btn');
  const raceResetBtn = document.getElementById('race-reset-btn');

  let winnerFound = false;

  function initRaceArena() {
    winnerFound = false;
    document.getElementById('winner-badge-1').classList.remove('visible');
    document.getElementById('winner-badge-2').classList.remove('visible');

    const size = parseInt(raceSizeSlider.value);
    const sharedArray = generateArray(size, 'random');

    const algoKey1 = raceAlgo1Select.value;
    const algoKey2 = raceAlgo2Select.value;

    document.getElementById('racer-1-name').textContent = TheoryData[algoKey1].name;
    document.getElementById('racer-2-name').textContent = TheoryData[algoKey2].name;

    if (!isGraphAlgo(algoKey1)) raceEngine1.setArray(sharedArray);
    if (!isGraphAlgo(algoKey2)) raceEngine2.setArray(sharedArray);

    raceEngine1.loadSteps(getGenerator(algoKey1, sharedArray));
    raceEngine2.loadSteps(getGenerator(algoKey2, sharedArray));

    raceEngine1.setSpeed(raceSpeedSlider.value);
    raceEngine2.setSpeed(raceSpeedSlider.value);

    raceEngine1.onStepCallback = (step, idx, total, elapsed) => {
      document.getElementById('race-1-comp').textContent = step.comparisons || 0;
      document.getElementById('race-1-swaps').textContent = step.swaps || 0;
      document.getElementById('race-1-time').textContent = `${elapsed} ms`;
    };

    raceEngine1.onCompleteCallback = () => {
      if (!winnerFound) {
        winnerFound = true;
        document.getElementById('winner-badge-1').classList.add('visible');
      }
    };

    raceEngine2.onStepCallback = (step, idx, total, elapsed) => {
      document.getElementById('race-2-comp').textContent = step.comparisons || 0;
      document.getElementById('race-2-swaps').textContent = step.swaps || 0;
      document.getElementById('race-2-time').textContent = `${elapsed} ms`;
    };

    raceEngine2.onCompleteCallback = () => {
      if (!winnerFound) {
        winnerFound = true;
        document.getElementById('winner-badge-2').classList.add('visible');
      }
    };
  }

  function getGenerator(key, arr) {
    switch (key) {
      case 'bubble': return Algorithms.bubbleSort(arr);
      case 'selection': return Algorithms.selectionSort(arr);
      case 'insertion': return Algorithms.insertionSort(arr);
      case 'quick': return Algorithms.quickSort(arr);
      case 'merge': return Algorithms.mergeSort(arr);
      case 'heap': return Algorithms.heapSort(arr);
      case 'dijkstra': return Algorithms.dijkstra(getDefaultGraph());
      case 'prims': return Algorithms.prims(getDefaultGraph());
      case 'kruskal': return Algorithms.kruskal(getDefaultGraph());
      default: return Algorithms.quickSort(arr);
    }
  }

  raceSizeSlider.addEventListener('input', (e) => {
    raceSizeVal.textContent = e.target.value;
    initRaceArena();
  });

  raceSpeedSlider.addEventListener('input', (e) => {
    raceSpeedVal.textContent = `${e.target.value}x`;
    raceEngine1.setSpeed(e.target.value);
    raceEngine2.setSpeed(e.target.value);
  });

  raceAlgo1Select.addEventListener('change', initRaceArena);
  raceAlgo2Select.addEventListener('change', initRaceArena);

  raceStartBtn.addEventListener('click', () => {
    winnerFound = false;
    document.getElementById('winner-badge-1').classList.remove('visible');
    document.getElementById('winner-badge-2').classList.remove('visible');
    raceEngine1.play();
    raceEngine2.play();
  });

  raceResetBtn.addEventListener('click', () => {
    raceEngine1.reset();
    raceEngine2.reset();
    initRaceArena();
  });

  // Global Sound Controls & Hotkeys
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const volumeSlider = document.getElementById('volume-slider');

  soundToggleBtn.addEventListener('click', () => {
    const isEnabled = window.soundSynth.toggleSound();
    soundToggleBtn.classList.toggle('muted', !isEnabled);
    soundToggleBtn.querySelector('i').className = isEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
  });

  volumeSlider.addEventListener('input', (e) => {
    window.soundSynth.setVolume(e.target.value);
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.code === 'Space') {
      e.preventDefault();
      playBtn.click();
    } else if (e.code === 'ArrowRight') {
      stepNextBtn.click();
    } else if (e.code === 'ArrowLeft') {
      stepPrevBtn.click();
    } else if (e.code === 'KeyR') {
      resetBtn.click();
    } else if (e.code === 'KeyM') {
      soundToggleBtn.click();
    }
  });

  initSingleVisualizer();
  initRaceArena();
});
