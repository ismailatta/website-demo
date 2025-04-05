document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the target page
            const targetPage = this.dataset.page;
            
            // Here you would handle navigation between apps
            console.log(`Navigating to ${targetPage}`);
            // In a real implementation, this would load the appropriate app
        });
    });

    // Make sure Goals button is active by default
    document.querySelector('.nav-button[data-page="goal"]').classList.add('active');

    // Rest of your existing goal tracking JavaScript code...
    // DOM Elements
    const newGoalBtn = document.getElementById('new-goal-btn');
    const goalsList = document.getElementById('goals-list');
    const goalDetailsModal = document.getElementById('goal-details-modal');
    const newGoalModal = document.getElementById('new-goal-modal');
    const newStageModal = document.getElementById('new-stage-modal');
    const newStepModal = document.getElementById('new-step-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const addStageBtn = document.querySelector('.add-stage-btn');
    const saveGoalChangesBtn = document.getElementById('save-goal-changes');
    const deleteGoalBtn = document.getElementById('delete-goal-btn');
    const addAnotherStageBtn = document.getElementById('add-another-stage');
    const addAnotherTaskBtn = document.getElementById('add-another-task');
    const stagesInputContainer = document.getElementById('stages-input-container');
    const tasksInputContainer = document.getElementById('tasks-input-container');
    const totalGoalsEl = document.getElementById('total-goals');
    const completedGoalsEl = document.getElementById('completed-goals');
    const inProgressGoalsEl = document.getElementById('in-progress-goals');

    // Sample Data (would be replaced with actual database in production)
    let goals = JSON.parse(localStorage.getItem('goals')) || [
        {
            id: 1,
            title: "Learn Spanish",
            purpose: "To communicate with Spanish-speaking clients and expand business opportunities.",
            createdAt: new Date(),
            stages: [
                {
                    id: 1,
                    title: "Beginner Level",
                    purpose: "Build a foundation of basic vocabulary and grammar.",
                    completed: false,
                    steps: [
                        {
                            id: 1,
                            title: "Learn basic greetings",
                            purpose: "Essential for initial conversations.",
                            completed: true,
                            tasks: [
                                { id: 1, text: "Learn 'Hola' and 'Adiós'", completed: true },
                                { id: 2, text: "Practice with flashcards", completed: true }
                            ]
                        },
                        {
                            id: 2,
                            title: "Study present tense verbs",
                            purpose: "Foundation for constructing sentences.",
                            completed: false,
                            tasks: [
                                { id: 3, text: "Learn regular -ar verbs", completed: false },
                                { id: 4, text: "Practice conjugation", completed: false }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    title: "Intermediate Level",
                    purpose: "Hold basic conversations and understand common phrases.",
                    completed: false,
                    steps: []
                }
            ]
        },
        {
            id: 2,
            title: "Build a Mobile App",
            purpose: "Create a productivity app to help people manage their daily tasks.",
            createdAt: new Date(),
            stages: [
                {
                    id: 1,
                    title: "Planning",
                    purpose: "Define app features and requirements.",
                    completed: true,
                    steps: [
                        {
                            id: 1,
                            title: "Research competitors",
                            purpose: "Understand what similar apps offer.",
                            completed: true,
                            tasks: []
                        },
                        {
                            id: 2,
                            title: "Define core features",
                            purpose: "Identify must-have features for MVP.",
                            completed: true,
                            tasks: []
                        }
                    ]
                },
                {
                    id: 2,
                    title: "Design",
                    purpose: "Create UI/UX designs for the app.",
                    completed: false,
                    steps: [
                        {
                            id: 3,
                            title: "Create wireframes",
                            purpose: "Visualize app structure and flow.",
                            completed: false,
                            tasks: []
                        }
                    ]
                }
            ]
        }
    ];
    
    // Current goal being viewed
    let currentGoal = null;
    let currentStage = null;
    let currentStep = null;
    
    // Initialize the app
    function init() {
        renderGoals();
        setupEventListeners();
        updateStats();
    }
    
    // Render all goals on the dashboard
    function renderGoals() {
        goalsList.innerHTML = '';
        
        if (goals.length === 0) {
            goalsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bullseye"></i>
                    <h3>No Goals Yet</h3>
                    <p>Start by creating your first goal to track your progress</p>
                    <button id="new-goal-btn" class="btn-primary">
                        <i class="fas fa-plus"></i> Create Goal
                    </button>
                </div>
            `;
            return;
        }
        
        goals.forEach(goal => {
            const progress = calculateGoalProgress(goal);
            const status = getGoalStatus(goal);
            
            const goalCard = document.createElement('div');
            goalCard.className = 'goal-card fade-in';
            goalCard.innerHTML = `
                <h3>${goal.title}</h3>
                <p>${goal.purpose.substring(0, 60)}${goal.purpose.length > 60 ? '...' : ''}</p>
                
                <div class="goal-progress">
                    <div class="progress-text">
                        <span>Progress</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <div class="goal-actions">
                    <span class="goal-date">Created: ${formatDate(goal.createdAt)}</span>
                    <span class="goal-status ${status.class}">${status.text}</span>
                </div>
            `;
            
            goalCard.addEventListener('click', () => openGoalDetails(goal));
            goalsList.appendChild(goalCard);
        });
    }
    
    // Calculate progress percentage for a goal
    function calculateGoalProgress(goal) {
        if (!goal.stages || goal.stages.length === 0) return 0;
        
        // Count completed stages
        const completedStages = goal.stages.filter(stage => stage.completed).length;
        const totalStages = goal.stages.length;
        
        // Count completed steps in incomplete stages
        let completedStepsInIncompleteStages = 0;
        let totalStepsInIncompleteStages = 0;
        
        goal.stages.forEach(stage => {
            if (!stage.completed) {
                const completedSteps = stage.steps.filter(step => step.completed).length;
                completedStepsInIncompleteStages += completedSteps;
                totalStepsInIncompleteStages += stage.steps.length;
            }
        });
        
        // If all stages are completed, progress is 100%
        if (completedStages === totalStages) {
            return 100;
        }
        
        // Calculate progress for incomplete stages
        const stageProgress = (completedStages / totalStages) * 100;
        const stepProgress = totalStepsInIncompleteStages > 0 
            ? (completedStepsInIncompleteStages / totalStepsInIncompleteStages) * 100 
            : 0;
            
        // Weighted average (stages count more than steps)
        const totalProgress = stageProgress + (stepProgress * (1 / totalStages));
        
        return Math.round(totalProgress);
    }
    
    // Get status of a goal
    function getGoalStatus(goal) {
        const progress = calculateGoalProgress(goal);
        
        if (progress === 0) {
            return { text: 'Not Started', class: 'status-not-started' };
        } else if (progress === 100) {
            return { text: 'Completed', class: 'status-completed' };
        } else {
            return { text: 'In Progress', class: 'status-in-progress' };
        }
    }
    
    // Update stats cards
    function updateStats() {
        const total = goals.length;
        const completed = goals.filter(goal => calculateGoalProgress(goal) === 100).length;
        const inProgress = goals.filter(goal => {
            const progress = calculateGoalProgress(goal);
            return progress > 0 && progress < 100;
        }).length;
        
        totalGoalsEl.textContent = total;
        completedGoalsEl.textContent = completed;
        inProgressGoalsEl.textContent = inProgress;
    }
    
    // Format date for display
    function formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    // Open goal details modal
    function openGoalDetails(goal) {
        currentGoal = goal;
        const progress = calculateGoalProgress(goal);
        
        // Update modal title and purpose
        document.getElementById('goal-modal-title').textContent = goal.title;
        document.getElementById('goal-purpose-text').textContent = goal.purpose;
        
        // Update progress
        document.querySelector('.progress-percent').textContent = `${progress}%`;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        
        // Render stages
        renderStages(goal);
        
        // Open modal
        goalDetailsModal.classList.add('active');
    }
    
    // Render stages for a goal
    function renderStages(goal) {
        const stagesList = document.getElementById('stages-list');
        stagesList.innerHTML = '';
        
        if (!goal.stages || goal.stages.length === 0) {
            stagesList.innerHTML = `
                <div class="empty-state">
                    <p>No stages yet. Add your first stage to get started.</p>
                </div>
            `;
            return;
        }
        
        goal.stages.forEach(stage => {
            const stageItem = document.createElement('div');
            stageItem.className = 'stage-item slide-up';
            stageItem.dataset.stageId = stage.id;
            
            // Calculate stage completion
            const stageCompleted = checkStageCompletion(stage);
            
            stageItem.innerHTML = `
                <div class="stage-header">
                    <div class="stage-title">
                        <input type="checkbox" class="stage-checkbox" ${stageCompleted ? 'checked' : ''} data-stage-id="${stage.id}">
                        <span>${stage.title}</span>
                    </div>
                    <div class="stage-actions">
                        <button class="edit-stage-btn" title="Edit Stage"><i class="fas fa-edit"></i></button>
                        <button class="delete-stage-btn" title="Delete Stage"><i class="fas fa-trash"></i></button>
                        <button class="add-step-btn" title="Add Step"><i class="fas fa-plus"></i> Add Step</button>
                    </div>
                </div>
                <div class="stage-purpose">${stage.purpose}</div>
                <div class="stage-content ${stageCompleted ? 'expanded' : ''}">
                    <div class="steps-list" data-stage-id="${stage.id}">
                        ${renderSteps(stage.steps)}
                    </div>
                </div>
            `;
            
            stagesList.appendChild(stageItem);
            
            // Add event listeners for this stage
            const stageHeader = stageItem.querySelector('.stage-header');
            const stageContent = stageItem.querySelector('.stage-content');
            const addStepBtn = stageItem.querySelector('.add-step-btn');
            const editStageBtn = stageItem.querySelector('.edit-stage-btn');
            const deleteStageBtn = stageItem.querySelector('.delete-stage-btn');
            const stageCheckbox = stageItem.querySelector('.stage-checkbox');
            
            stageHeader.addEventListener('click', (e) => {
                if (!e.target.closest('.stage-actions') && !e.target.closest('.stage-checkbox')) {
                    stageContent.classList.toggle('expanded');
                }
            });
            
            addStepBtn.addEventListener('click', () => openNewStepModal(stage.id));
            editStageBtn.addEventListener('click', () => openEditStageModal(stage));
            deleteStageBtn.addEventListener('click', () => deleteStage(stage.id));
            
            // Stage checkbox event
            stageCheckbox.addEventListener('change', function() {
                const stageId = parseInt(this.dataset.stageId);
                const stage = currentGoal.stages.find(s => s.id === stageId);
                
                if (stage) {
                    stage.completed = this.checked;
                    
                    // Mark all steps as completed if stage is completed
                    if (this.checked) {
                        stage.steps.forEach(step => {
                            step.completed = true;
                        });
                    }
                    
                    saveGoals();
                    renderStages(currentGoal);
                    updateProgress();
                    renderGoals(); // Update dashboard view
                    updateStats();
                }
            });
            
            // Setup step checkboxes
            const stepCheckboxes = stageItem.querySelectorAll('.step-checkbox');
            stepCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const stepId = parseInt(this.dataset.stepId);
                    toggleStepCompletion(stage.id, stepId, this.checked);
                });
            });
            
            // Setup task checkboxes
            const taskCheckboxes = stageItem.querySelectorAll('.task-checkbox');
            taskCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const taskId = parseInt(this.dataset.taskId);
                    toggleTaskCompletion(stage.id, taskId, this.checked);
                });
            });
            
            // Setup step edit/delete buttons
            const editStepBtns = stageItem.querySelectorAll('.edit-step-btn');
            editStepBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const stepId = parseInt(this.closest('.step-item').dataset.stepId);
                    const step = stage.steps.find(s => s.id === stepId);
                    if (step) {
                        openEditStepModal(stage.id, step);
                    }
                });
            });
            
            const deleteStepBtns = stageItem.querySelectorAll('.delete-step-btn');
            deleteStepBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const stepId = parseInt(this.closest('.step-item').dataset.stepId);
                    deleteStep(stage.id, stepId);
                });
            });
        });
        
        // Setup drag and drop for steps
        setupDragAndDrop();
    }
    
    // Check if a stage is completed
    function checkStageCompletion(stage) {
        if (stage.completed) return true;
        if (!stage.steps || stage.steps.length === 0) return false;
        return stage.steps.every(step => step.completed);
    }
    
    // Render steps for a stage
    function renderSteps(steps) {
        if (!steps || steps.length === 0) {
            return `
                <div class="empty-state">
                    <p>No steps yet. Add your first step to get started.</p>
                </div>
            `;
        }
        
        return steps.map(step => {
            const tasksHtml = step.tasks && step.tasks.length > 0 
                ? `
                    <div class="tasks-list">
                        ${step.tasks.map(task => `
                            <div class="task-item">
                                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-task-id="${task.id}">
                                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                            </div>
                        `).join('')}
                    </div>
                `
                : '';
            
            return `
                <div class="step-item" data-step-id="${step.id}">
                    <div class="step-header">
                        <div class="step-title">
                            <input type="checkbox" class="step-checkbox" ${step.completed ? 'checked' : ''} data-step-id="${step.id}">
                            <span>${step.title}</span>
                        </div>
                        <div class="step-actions">
                            <button class="edit-step-btn" title="Edit Step"><i class="fas fa-edit"></i></button>
                            <button class="delete-step-btn" title="Delete Step"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <div class="step-purpose">${step.purpose}</div>
                    ${tasksHtml}
                </div>
            `;
        }).join('');
    }
    
    // Toggle step completion status
    function toggleStepCompletion(stageId, stepId, completed) {
        const stage = currentGoal.stages.find(s => s.id === stageId);
        if (stage) {
            const step = stage.steps.find(s => s.id === stepId);
            if (step) {
                step.completed = completed;
                
                // Check if all steps are completed to mark stage as completed
                stage.completed = checkStageCompletion(stage);
                
                // Mark all tasks as completed if step is completed
                if (completed) {
                    step.tasks.forEach(task => {
                        task.completed = true;
                    });
                }
                
                saveGoals();
                renderStages(currentGoal);
                updateProgress();
                renderGoals(); // Update dashboard view
                updateStats();
            }
        }
    }
    
    // Toggle task completion status
    function toggleTaskCompletion(stageId, taskId, completed) {
        const stage = currentGoal.stages.find(s => s.id === stageId);
        if (stage) {
            for (const step of stage.steps) {
                const task = step.tasks.find(t => t.id === taskId);
                if (task) {
                    task.completed = completed;
                    
                    // Check if all tasks are completed to mark step as completed
                    if (step.tasks.length > 0) {
                        step.completed = step.tasks.every(t => t.completed);
                    }
                    
                    // Check if all steps are completed to mark stage as completed
                    stage.completed = checkStageCompletion(stage);
                    
                    saveGoals();
                    renderStages(currentGoal);
                    updateProgress();
                    renderGoals(); // Update dashboard view
                    updateStats();
                    break;
                }
            }
        }
    }
    
    // Update progress in the modal
    function updateProgress() {
        const progress = calculateGoalProgress(currentGoal);
        document.querySelector('.progress-percent').textContent = `${progress}%`;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
    }
    
    // Open new goal modal
    function openNewGoalModal() {
        // Clear any existing stage inputs
        stagesInputContainer.innerHTML = '';
        document.getElementById('new-goal-form').reset();
        newGoalModal.classList.add('active');
    }
    
    // Open new stage modal
    function openNewStageModal() {
        document.getElementById('new-stage-form').reset();
        newStageModal.classList.add('active');
        newStageModal.dataset.stageId = ''; // Clear any existing stage ID
    }
    
    // Open edit stage modal
    function openEditStageModal(stage) {
        document.getElementById('stage-title').value = stage.title;
        document.getElementById('stage-purpose').value = stage.purpose;
        newStageModal.dataset.stageId = stage.id;
        newStageModal.classList.add('active');
    }
    
    // Open new step modal
    function openNewStepModal(stageId) {
        document.getElementById('new-step-form').reset();
        tasksInputContainer.innerHTML = '';
        newStepModal.dataset.stageId = stageId;
        newStepModal.dataset.stepId = ''; // Clear any existing step ID
        newStepModal.classList.add('active');
    }
    
    // Open edit step modal
    function openEditStepModal(stageId, step) {
        document.getElementById('step-title').value = step.title;
        document.getElementById('step-purpose').value = step.purpose;
        
        // Clear and repopulate tasks
        tasksInputContainer.innerHTML = '';
        if (step.tasks && step.tasks.length > 0) {
            step.tasks.forEach(task => {
                addTaskInputField(task.text);
            });
        }
        
        newStepModal.dataset.stageId = stageId;
        newStepModal.dataset.stepId = step.id;
        newStepModal.classList.add('active');
    }
    
    // Close all modals
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    // Add a new goal
    function addNewGoal(title, purpose, stages = []) {
        const newGoal = {
            id: Date.now(),
            title,
            purpose,
            createdAt: new Date(),
            stages
        };
        
        goals.push(newGoal);
        saveGoals();
        renderGoals();
        updateStats();
        closeAllModals();
    }
    
    // Add a new stage to current goal
    function addNewStage(title, purpose) {
        const stageId = newStageModal.dataset.stageId;
        
        if (stageId) {
            // Editing existing stage
            const stage = currentGoal.stages.find(s => s.id == stageId);
            if (stage) {
                stage.title = title;
                stage.purpose = purpose;
            }
        } else {
            // Adding new stage
            const newStage = {
                id: Date.now(),
                title,
                purpose,
                completed: false,
                steps: []
            };
            
            currentGoal.stages.push(newStage);
        }
        
        saveGoals();
        renderStages(currentGoal);
        closeAllModals();
    }
    
    // Add a new step to a stage
    function addNewStep(stageId, title, purpose, tasks = []) {
        const stepId = newStepModal.dataset.stepId;
        const stage = currentGoal.stages.find(s => s.id == stageId);
        
        if (stepId) {
            // Editing existing step
            const step = stage.steps.find(s => s.id == stepId);
            if (step) {
                step.title = title;
                step.purpose = purpose;
                step.tasks = tasks.map(task => ({ 
                    id: task.id || Date.now() + Math.random(), 
                    text: task.text, 
                    completed: task.completed || false 
                }));
            }
        } else {
            // Adding new step
            const newStep = {
                id: Date.now(),
                title,
                purpose,
                completed: false,
                tasks: tasks.map(task => ({ id: Date.now() + Math.random(), text: task.text, completed: false }))
            };
            
            stage.steps.push(newStep);
        }
        
        saveGoals();
        renderStages(currentGoal);
        closeAllModals();
    }
    
    // Delete a stage
    function deleteStage(stageId) {
        if (confirm('Are you sure you want to delete this stage and all its steps?')) {
            currentGoal.stages = currentGoal.stages.filter(stage => stage.id != stageId);
            saveGoals();
            renderStages(currentGoal);
            renderGoals();
            updateStats();
        }
    }
    
    // Delete a step
    function deleteStep(stageId, stepId) {
        if (confirm('Are you sure you want to delete this step and all its tasks?')) {
            const stage = currentGoal.stages.find(s => s.id == stageId);
            if (stage) {
                stage.steps = stage.steps.filter(step => step.id != stepId);
                saveGoals();
                renderStages(currentGoal);
                renderGoals();
                updateStats();
            }
        }
    }
    
    // Delete current goal
    function deleteCurrentGoal() {
        if (confirm('Are you sure you want to delete this goal and all its content?')) {
            goals = goals.filter(goal => goal.id !== currentGoal.id);
            saveGoals();
            closeAllModals();
            renderGoals();
            updateStats();
        }
    }
    
    // Save goals to localStorage
    function saveGoals() {
        localStorage.setItem('goals', JSON.stringify(goals));
    }
    
    // Setup drag and drop for steps
    function setupDragAndDrop() {
        const stepsLists = document.querySelectorAll('.steps-list');
        
        stepsLists.forEach(stepsList => {
            const steps = stepsList.querySelectorAll('.step-item');
            
            steps.forEach(step => {
                step.draggable = true;
                
                step.addEventListener('dragstart', function(e) {
                    e.dataTransfer.setData('text/plain', step.dataset.stepId);
                    setTimeout(() => {
                        step.classList.add('dragging');
                    }, 0);
                });
                
                step.addEventListener('dragend', function() {
                    step.classList.remove('dragging');
                });
            });
            
            stepsList.addEventListener('dragover', function(e) {
                e.preventDefault();
                const draggingStep = document.querySelector('.dragging');
                const afterElement = getDragAfterElement(stepsList, e.clientY);
                
                if (afterElement == null) {
                    stepsList.appendChild(draggingStep);
                } else {
                    stepsList.insertBefore(draggingStep, afterElement);
                }
            });
        });
    }
    
    // Helper function for drag and drop
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.step-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    // Add stage input field
    function addStageInputField() {
        const newStageInput = document.createElement('div');
        newStageInput.className = 'stage-input';
        newStageInput.innerHTML = `
            <input type="text" placeholder="Stage title" required>
            <textarea placeholder="Stage purpose..." required></textarea>
            <button type="button" class="remove-stage-btn"><i class="fas fa-times"></i></button>
        `;
        stagesInputContainer.appendChild(newStageInput);
        
        // Add event listener to remove button
        newStageInput.querySelector('.remove-stage-btn').addEventListener('click', function() {
            stagesInputContainer.removeChild(newStageInput);
        });
    }
    
    // Add task input field
    function addTaskInputField(initialValue = '') {
        const newTaskInput = document.createElement('div');
        newTaskInput.className = 'task-input';
        newTaskInput.innerHTML = `
            <input type="text" placeholder="Task description" value="${initialValue}">
            <button type="button" class="remove-task-btn"><i class="fas fa-times"></i></button>
        `;
        tasksInputContainer.appendChild(newTaskInput);
        
        // Add event listener to remove button
        newTaskInput.querySelector('.remove-task-btn').addEventListener('click', function() {
            tasksInputContainer.removeChild(newTaskInput);
        });
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // New Goal button
        newGoalBtn.addEventListener('click', openNewGoalModal);
        
        // Close modal buttons
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        // Add Stage button
        addStageBtn.addEventListener('click', openNewStageModal);
        
        // Save Goal Changes button
        saveGoalChangesBtn.addEventListener('click', function() {
            saveGoals();
            renderGoals();
            updateStats();
            closeAllModals();
        });
        
        // Delete Goal button
        deleteGoalBtn.addEventListener('click', deleteCurrentGoal);
        
        // New Goal form submission
        document.getElementById('new-goal-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('goal-title').value;
            const purpose = document.getElementById('goal-purpose').value;
            
            // Get stages if any were added
            const stageInputs = document.querySelectorAll('.stage-input');
            const stages = Array.from(stageInputs).map(input => {
                return {
                    id: Date.now() + Math.random(),
                    title: input.querySelector('input').value,
                    purpose: input.querySelector('textarea').value,
                    completed: false,
                    steps: []
                };
            });
            
            addNewGoal(title, purpose, stages);
        });
        
        // Add another stage in new goal form
        addAnotherStageBtn.addEventListener('click', addStageInputField);
        
        // New Stage form submission
        document.getElementById('new-stage-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('stage-title').value;
            const purpose = document.getElementById('stage-purpose').value;
            addNewStage(title, purpose);
        });
        
        // New Step form submission
        document.getElementById('new-step-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const stageId = newStepModal.dataset.stageId;
            const title = document.getElementById('step-title').value;
            const purpose = document.getElementById('step-purpose').value;
            
            // Get tasks if any were added
            const taskInputs = document.querySelectorAll('.task-input');
            const tasks = Array.from(taskInputs).map(input => ({
                text: input.querySelector('input').value
            }));
            
            addNewStep(stageId, title, purpose, tasks);
        });
        
        // Add another task in new step form
        addAnotherTaskBtn.addEventListener('click', () => addTaskInputField());
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeAllModals();
                }
            });
        });
    }
    
    // Initialize the app
    init();
});