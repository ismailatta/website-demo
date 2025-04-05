document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navButtons = document.querySelectorAll('.nav-button');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // ✅ Stop Pomodoro Timer when navigating
            stopTimer();

            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get the target page
            const targetPage = this.dataset.page;

            // Handle navigation (you can toggle visibility here)
            console.log(`Navigating to ${targetPage}`);
        });
    });

    // Make sure Pomodoro button is active by default
    document.querySelector('.nav-button[data-page="pomodoro"]').classList.add('active');

    // DOM Elements
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const progressRing = document.querySelector('.progress-ring__progress');
    const startStopBtn = document.getElementById('startStopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const modeIndicator = document.getElementById('modeIndicator');
    const brainStatus = document.getElementById('brainStatus');
    const brainVisualization = document.getElementById('brainVisualization');

    // Input Elements
    const workHoursInput = document.getElementById('work-hours');
    const workMinutesInput = document.getElementById('work-minutes');
    const workSecondsInput = document.getElementById('work-seconds');
    const breakHoursInput = document.getElementById('break-hours');
    const breakMinutesInput = document.getElementById('break-minutes');
    const breakSecondsInput = document.getElementById('break-seconds');

    // Variables
    let totalSeconds = 0;
    let remainingTime = 0;
    let interval;
    let isRunning = false;
    let isFocusMode = true;
    let lastUpdateTime = 0;
    const circleLength = 754;

    function saveTimerState() {
        const timerState = {
            isRunning,
            isFocusMode,
            totalSeconds,
            remainingTime,
            lastUpdateTime: isRunning ? Date.now() : 0,
            workTime: {
                hours: workHoursInput.value,
                minutes: workMinutesInput.value,
                seconds: workSecondsInput.value
            },
            breakTime: {
                hours: breakHoursInput.value,
                minutes: breakMinutesInput.value,
                seconds: breakSecondsInput.value
            }
        };
        localStorage.setItem('pomodoroTimerState', JSON.stringify(timerState));
    }

    function loadTimerState() {
        const savedState = localStorage.getItem('pomodoroTimerState');
        if (savedState) {
            const state = JSON.parse(savedState);

            workHoursInput.value = state.workTime.hours;
            workMinutesInput.value = state.workTime.minutes;
            workSecondsInput.value = state.workTime.seconds;
            breakHoursInput.value = state.breakTime.hours;
            breakMinutesInput.value = state.breakTime.minutes;
            breakSecondsInput.value = state.breakTime.seconds;

            isRunning = state.isRunning;
            isFocusMode = state.isFocusMode;
            totalSeconds = state.totalSeconds;
            remainingTime = state.remainingTime;
            lastUpdateTime = state.lastUpdateTime;

            if (lastUpdateTime > 0) {
                const timeElapsed = Math.floor((Date.now() - lastUpdateTime) / 1000);
                remainingTime = Math.max(0, remainingTime - timeElapsed);
            
                if (remainingTime <= 0) {
                    handleTimerCompletion();
                } else {
                    if (isRunning) {
                        updateTimerDisplay();
                        updateModeDisplay();
                        updateBrainVisualization();
                        startTimer(); // ✅ Auto-continue
                    } else {
                        updateTimerDisplay();
                        updateModeDisplay();
                        updateBrainVisualization();
                    }
                }
            }
            

            updateTimerDisplay();
            updateModeDisplay();
            updateBrainVisualization();
        } else {
            initializeTimer();
        }
    }

    function handleTimerCompletion() {
        if (isRunning) {
            toggleMode();
            if (isRunning) {
                lastUpdateTime = Date.now();
            }
        }
    }

    function initializeTimer() {
        stopTimer();
        isFocusMode = true;
        updateModeDisplay();
        updateBrainVisualization();
        calculateTotalTime();
    }

    function calculateTotalTime() {
        if (isFocusMode) {
            totalSeconds =
                parseInt(workHoursInput.value) * 3600 +
                parseInt(workMinutesInput.value) * 60 +
                parseInt(workSecondsInput.value);
        } else {
            totalSeconds =
                parseInt(breakHoursInput.value) * 3600 +
                parseInt(breakMinutesInput.value) * 60 +
                parseInt(breakSecondsInput.value);
        }
        remainingTime = totalSeconds;
        updateTimerDisplay();
        saveTimerState();
    }

    function updateTimerDisplay() {
        let hours = Math.floor(remainingTime / 3600);
        let minutes = Math.floor((remainingTime % 3600) / 60);
        let seconds = remainingTime % 60;

        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');

        let progress = (remainingTime / totalSeconds) * circleLength;
        progressRing.style.strokeDashoffset = progress;
    }

    function updateTimer() {
        remainingTime = Math.max(0, remainingTime - 1);
        lastUpdateTime = Date.now();
        updateTimerDisplay();

        if (remainingTime <= 0) {
            handleTimerCompletion();
        }

        saveTimerState();
    }

    function toggleMode() {
        isFocusMode = !isFocusMode;
        updateModeDisplay();
        updateBrainVisualization();
        calculateTotalTime();

        if (isRunning) {
            lastUpdateTime = Date.now();
            saveTimerState();
        }
    }

    function updateModeDisplay() {
        if (isFocusMode) {
            modeIndicator.textContent = 'Focus Time';
            brainStatus.textContent = 'Concentrating';
            document.body.classList.remove('break-mode');
            document.body.classList.add('focus-mode');
            startStopBtn.textContent = isRunning ? 'Pause Focus' : 'Start Focus';
        } else {
            modeIndicator.textContent = 'Break Time';
            brainStatus.textContent = 'Relaxing';
            document.body.classList.remove('focus-mode');
            document.body.classList.add('break-mode');
            startStopBtn.textContent = isRunning ? 'Pause Break' : 'Start Break';
        }
    }

    function updateBrainVisualization() {
        if (isFocusMode) {
            brainVisualization.classList.remove('break-animation');
            brainVisualization.classList.add('focus-animation');
        } else {
            brainVisualization.classList.remove('focus-animation');
            brainVisualization.classList.add('break-animation');
        }
    }

    function startTimer() {
        if (totalSeconds === 0) {
            calculateTotalTime();
        }

        if (remainingTime === 0) {
            remainingTime = totalSeconds;
        }

        if (!isRunning) {
            interval = setInterval(updateTimer, 1000);
            isRunning = true;
            lastUpdateTime = Date.now();
            updateModeDisplay();
            saveTimerState();
        }
    }

    function stopTimer() {
        if (isRunning) {
            clearInterval(interval);
            isRunning = false;
            lastUpdateTime = 0;
            updateModeDisplay();
            saveTimerState();
        }
    }

    function resetTimer() {
        stopTimer();
        isFocusMode = true;
        calculateTotalTime();
        updateModeDisplay();
        updateBrainVisualization();
    }

    startStopBtn.addEventListener('click', function () {
        if (isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    resetBtn.addEventListener('click', resetTimer);

    [workHoursInput, workMinutesInput, workSecondsInput,
        breakHoursInput, breakMinutesInput, breakSecondsInput].forEach(input => {
        input.addEventListener('change', function () {
            if (this.value < 0) this.value = 0;
            if (this.id.includes('hours') && this.value > 23) this.value = 23;
            if ((this.id.includes('minutes') || this.id.includes('seconds')) && this.value > 59) this.value = 59;

            if (!isRunning) {
                calculateTotalTime();
            }
            saveTimerState();
        });
    });

    loadTimerState();

    setInterval(saveTimerState, 5000);
    window.addEventListener('beforeunload', saveTimerState);
});
