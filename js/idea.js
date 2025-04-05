document.addEventListener('DOMContentLoaded', function() {
    // ===== Navigation Functionality =====
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

    // Make sure Ideas button is active by default
    document.querySelector('.nav-button[data-page="idea"]').classList.add('active');

    // ===== Original IdeaFlow Functionality =====
    // DOM Elements
    const addIdeaBtn = document.getElementById('add-idea-btn');
    const ideaContainer = document.getElementById('idea-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const totalIdeasEl = document.getElementById('total-ideas');
    const completedIdeasEl = document.getElementById('completed-ideas');
    const progressPercentEl = document.getElementById('progress-percent');
    const tagCloud = document.getElementById('tag-cloud');
    
    let ideas = JSON.parse(localStorage.getItem('ideas')) || [];
    let tags = {};
    
    // Initialize the app
    function init() {
        renderIdeas();
        updateStats();
        generateTagCloud();
        
        // Add event listeners
        addIdeaBtn.addEventListener('click', addNewIdea);
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderIdeas(btn.dataset.filter);
            });
        });
    }
    
    // Add a new idea
    function addNewIdea() {
        const newIdea = {
            id: Date.now(),
            content: '',
            completed: false,
            important: false,
            tags: [],
            positive: '',
            negative: '',
            purpose: '',
            notes: '',
            createdAt: new Date().toISOString()
        };
        
        ideas.unshift(newIdea);
        saveIdeas();
        renderIdeas();
        
        // Focus on the new idea input
        const newIdeaInput = document.querySelector(`[data-id="${newIdea.id}"] .idea-input`);
        if (newIdeaInput) newIdeaInput.focus();
    }
    
    // Render all ideas
    function renderIdeas(filter = 'all') {
        ideaContainer.innerHTML = '';
        
        const filteredIdeas = filterIdeas(filter);
        
        if (filteredIdeas.length === 0) {
            ideaContainer.innerHTML = '<p class="no-ideas">No ideas found. Add a new one to get started!</p>';
            return;
        }
        
        filteredIdeas.forEach(idea => {
            const ideaEl = createIdeaElement(idea);
            ideaContainer.appendChild(ideaEl);
        });
    }
    
    // Filter ideas based on selected filter
    function filterIdeas(filter) {
        let filtered = [...ideas];
        
        switch(filter) {
            case 'active':
                filtered = filtered.filter(idea => !idea.completed);
                break;
            case 'completed':
                filtered = filtered.filter(idea => idea.completed);
                break;
            case 'important':
                filtered = filtered.filter(idea => idea.important);
                break;
            default:
                // 'all' - no filtering needed
                break;
        }
        
        return filtered;
    }
    
    // Create an idea element
    function createIdeaElement(idea) {
        const ideaEl = document.createElement('div');
        ideaEl.className = `idea-card ${idea.completed ? 'completed' : ''} ${idea.important ? 'important' : ''}`;
        ideaEl.dataset.id = idea.id;
        
        ideaEl.innerHTML = `
            <div class="idea-header">
                <div class="checkbox ${idea.completed ? 'checked' : ''}">
                    ${idea.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <input type="text" class="idea-input ${idea.completed ? 'completed' : ''}" 
                    value="${escapeHtml(idea.content)}" placeholder="Enter your idea...">
                <div class="idea-actions">
                    <button class="action-btn important-btn ${idea.important ? 'active' : ''}">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="action-btn delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="idea-footer">
                <div class="tags-container" id="tags-${idea.id}">
                    ${idea.tags.map(tag => `
                        <span class="tag">
                            ${escapeHtml(tag)}
                            <span class="tag-remove" data-tag="${escapeHtml(tag)}">&times;</span>
                        </span>
                    `).join('')}
                </div>
                <input type="text" class="tag-input" placeholder="Add tag..." data-idea-id="${idea.id}">
            </div>
            <div class="idea-details" style="display: none;">
                <div class="detail-section">
                    <h4>Positive Aspects</h4>
                    <textarea class="detail-input positive">${escapeHtml(idea.positive)}</textarea>
                </div>
                <div class="detail-section">
                    <h4>Negative Aspects</h4>
                    <textarea class="detail-input negative">${escapeHtml(idea.negative)}</textarea>
                </div>
                <div class="detail-section">
                    <h4>Purpose/Objective</h4>
                    <textarea class="detail-input purpose">${escapeHtml(idea.purpose)}</textarea>
                </div>
                <div class="detail-section">
                    <h4>Additional Notes</h4>
                    <textarea class="detail-input notes">${escapeHtml(idea.notes)}</textarea>
                </div>
            </div>
            <button class="toggle-details-btn">Show Analysis <i class="fas fa-chevron-down"></i></button>
        `;
        
        // Add event listeners
        const checkbox = ideaEl.querySelector('.checkbox');
        const ideaInput = ideaEl.querySelector('.idea-input');
        const importantBtn = ideaEl.querySelector('.important-btn');
        const deleteBtn = ideaEl.querySelector('.delete-btn');
        const tagInput = ideaEl.querySelector('.tag-input');
        const tagsContainer = ideaEl.querySelector(`#tags-${idea.id}`);
        const toggleBtn = ideaEl.querySelector('.toggle-details-btn');
        const detailsSection = ideaEl.querySelector('.idea-details');
        
        checkbox.addEventListener('click', () => toggleComplete(idea.id));
        ideaInput.addEventListener('input', () => updateIdeaContent(idea.id, ideaInput.value));
        importantBtn.addEventListener('click', () => toggleImportant(idea.id));
        deleteBtn.addEventListener('click', () => deleteIdea(idea.id));
        tagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && tagInput.value.trim()) {
                addTag(idea.id, tagInput.value.trim());
                tagInput.value = '';
            }
        });
        
        // Add event listeners to tag remove buttons
        const tagRemoveBtns = ideaEl.querySelectorAll('.tag-remove');
        tagRemoveBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                removeTag(idea.id, btn.dataset.tag);
            });
        });
        
        // Toggle details section
        toggleBtn.addEventListener('click', () => {
            if (detailsSection.style.display === 'none') {
                detailsSection.style.display = 'block';
                toggleBtn.innerHTML = 'Hide Analysis <i class="fas fa-chevron-up"></i>';
            } else {
                detailsSection.style.display = 'none';
                toggleBtn.innerHTML = 'Show Analysis <i class="fas fa-chevron-down"></i>';
            }
        });
        
        // Add input listeners for analysis fields
        const detailFields = ['positive', 'negative', 'purpose', 'notes'];
        detailFields.forEach(field => {
            const input = ideaEl.querySelector(`.detail-input.${field}`);
            input.addEventListener('input', () => {
                idea[field] = input.value;
                saveIdeas();
            });
        });
        
        return ideaEl;
    }
    
    // Toggle idea completion status
    function toggleComplete(id) {
        const idea = ideas.find(i => i.id == id);
        if (idea) {
            idea.completed = !idea.completed;
            saveIdeas();
            renderIdeas(document.querySelector('.filter-btn.active').dataset.filter);
            updateStats();
        }
    }
    
    // Update idea content
    function updateIdeaContent(id, content) {
        const idea = ideas.find(i => i.id == id);
        if (idea) {
            idea.content = content;
            saveIdeas();
        }
    }
    
    // Toggle important status
    function toggleImportant(id) {
        const idea = ideas.find(i => i.id == id);
        if (idea) {
            idea.important = !idea.important;
            saveIdeas();
            renderIdeas(document.querySelector('.filter-btn.active').dataset.filter);
        }
    }
    
    // Delete an idea
    function deleteIdea(id) {
        if (confirm('Are you sure you want to delete this idea?')) {
            ideas = ideas.filter(i => i.id != id);
            saveIdeas();
            renderIdeas(document.querySelector('.filter-btn.active').dataset.filter);
            updateStats();
            generateTagCloud();
        }
    }
    
    // Add a tag to an idea
    function addTag(ideaId, tag) {
        const idea = ideas.find(i => i.id == ideaId);
        if (idea && !idea.tags.includes(tag)) {
            idea.tags.push(tag);
            saveIdeas();
            renderIdeas(document.querySelector('.filter-btn.active').dataset.filter);
            generateTagCloud();
        }
    }
    
    // Remove a tag from an idea
    function removeTag(ideaId, tag) {
        const idea = ideas.find(i => i.id == ideaId);
        if (idea) {
            idea.tags = idea.tags.filter(t => t !== tag);
            saveIdeas();
            renderIdeas(document.querySelector('.filter-btn.active').dataset.filter);
            generateTagCloud();
        }
    }
    
    // Save ideas to localStorage
    function saveIdeas() {
        localStorage.setItem('ideas', JSON.stringify(ideas));
    }
    
    // Update statistics
    function updateStats() {
        totalIdeasEl.textContent = ideas.length;
        const completedCount = ideas.filter(i => i.completed).length;
        completedIdeasEl.textContent = completedCount;
        
        const progressPercent = ideas.length > 0 
            ? Math.round((completedCount / ideas.length) * 100) 
            : 0;
        progressPercentEl.textContent = `${progressPercent}%`;
        
        // Update progress color based on percentage
        if (progressPercent < 30) {
            progressPercentEl.style.color = '#f56565';
        } else if (progressPercent < 70) {
            progressPercentEl.style.color = '#ed8936';
        } else {
            progressPercentEl.style.color = '#48bb78';
        }
    }
    
    // Generate tag cloud
    function generateTagCloud() {
        // Count tag frequencies
        tags = {};
        ideas.forEach(idea => {
            idea.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        });
        
        // Sort tags by frequency
        const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]);
        
        // Clear and rebuild tag cloud
        tagCloud.innerHTML = '<h4>Common Tags</h4>';
        
        if (sortedTags.length === 0) {
            tagCloud.innerHTML += '<p>No tags yet. Add some to organize your ideas!</p>';
            return;
        }
        
        // Add tags to cloud (limit to top 20)
        const topTags = sortedTags.slice(0, 20);
        topTags.forEach(([tag, count]) => {
            const tagEl = document.createElement('span');
            tagEl.className = 'cloud-tag';
            tagEl.textContent = `${tag} (${count})`;
            tagEl.style.fontSize = `${14 + count}px`;
            tagEl.style.opacity = `${0.6 + (count / topTags[0][1]) * 0.4}`;
            tagEl.addEventListener('click', () => {
                // Filter ideas by this tag
                filterIdeasByTag(tag);
            });
            tagCloud.appendChild(tagEl);
        });
    }
    
    // Filter ideas by tag
    function filterIdeasByTag(tag) {
        const filtered = ideas.filter(idea => idea.tags.includes(tag));
        ideaContainer.innerHTML = '';
        
        if (filtered.length === 0) {
            ideaContainer.innerHTML = '<p class="no-ideas">No ideas with this tag.</p>';
            return;
        }
        
        filtered.forEach(idea => {
            const ideaEl = createIdeaElement(idea);
            ideaContainer.appendChild(ideaEl);
        });
    }
    
    // Helper function to escape HTML
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Initialize the app
    init();
});