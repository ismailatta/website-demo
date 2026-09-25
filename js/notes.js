document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const notesGrid = document.querySelector('.notes-grid');
    const noteEditor = document.querySelector('.note-editor');
    const editorArea = document.querySelector('.editor-area');
    const noteTitle = document.querySelector('.note-title');
    const newNoteBtn = document.querySelector('.new-note-btn');
    const aiBtn = document.querySelector('.ai-btn');
    const aiPanel = document.querySelector('.ai-panel');
    const closeAi = document.querySelector('.close-ai');
    const upgradeBtn = document.querySelector('.upgrade-btn');
    const starBtn = document.querySelector('.editor-header .fa-star').closest('.tool-btn');
    const lockBtn = document.querySelector('.editor-header .fa-lock').closest('.tool-btn');
    const deleteBtn = document.querySelector('.editor-header .fa-trash').closest('.tool-btn');
    const sidebarItems = document.querySelectorAll('.sidebar-nav > ul > li');
    const tagItems = document.querySelectorAll('.tags-container li');
    const addTagBtn = document.querySelector('.tags-container .fa-plus');
    
  
  // Navigation functionality
  const navButtons = document.querySelectorAll('.nav-button');
      
  navButtons.forEach(button => {
      button.addEventListener('click', () => {
          navButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          const targetPage = button.dataset.page;
          switchPage(targetPage);
      });
  });
  
  function switchPage(targetPage) {
      // In a complete app, this would handle navigation between different apps
      console.log(`Switching to ${targetPage} page`);
      // For now, we'll just highlight the active button
  }
  
  // Make sure Notes button is active by default
    document.querySelector('.nav-button[data-page="notes"]')?.classList.add('active');
  
  
    let notes = JSON.parse(localStorage.getItem('notes') || '[]');

    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    
    let currentNoteId = null;
    let isEditorOpen = false;
    let currentFilter = 'all';
    let currentTagFilter = null;
    
    // Initialize the app
    function init() {
        renderNotes();
        setupEventListeners();
        updateActiveFilters();
    }
  
  
  
  
  
  
  
  
  
  
    
    // Render notes to the grid based on current filters
    function renderNotes() {
        notesGrid.innerHTML = '';
        
        let filteredNotes = notes.filter(note => {
            // Filter by main category
            if (currentFilter === 'starred' && !note.starred) return false;
            if (currentFilter === 'private' && !note.locked) return false;
            if (currentFilter === 'trash' && !note.trashed) return false;
            if (currentFilter !== 'trash' && note.trashed) return false;
            
            // Filter by tag
            if (currentTagFilter && note.tag !== currentTagFilter) return false;
            
            return true;
        });
        
        if (filteredNotes.length === 0) {
            notesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-${getEmptyStateIcon()}"></i>
                    <h3>${getEmptyStateMessage()}</h3>
                    ${currentFilter === 'trash' ? '' : '<button class="btn new-note-btn"><i class="fas fa-plus"></i> New Note</button>'}
                </div>
            `;
            
            // Add event listener to new note button in empty state
            const emptyStateBtn = notesGrid.querySelector('.new-note-btn');
            if (emptyStateBtn) {
                emptyStateBtn.addEventListener('click', createNewNote);
            }
            
            return;
        }
        
        filteredNotes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card';
            noteCard.dataset.id = note.id;
            
            if (currentNoteId === note.id) {
                noteCard.classList.add('active');
            }
            
            const date = new Date(note.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
            
            noteCard.innerHTML = `
                <div class="note-card-header">
                    <div class="note-card-title">${note.title}</div>
                    <div class="note-card-actions">
                        <div class="note-card-action star-btn">
                            <i class="fas fa-${note.starred ? 'star' : 'star'}"></i>
                        </div>
                        <div class="note-card-action lock-btn">
                            <i class="fas fa-${note.locked ? 'lock' : 'lock-open'}"></i>
                        </div>
                    </div>
                </div>
                <div class="note-card-content">${note.content || 'No content yet'}</div>
                <div class="note-card-footer">
                    <div class="note-card-tag ${note.tag}">${note.tag}</div>
                    <div>${formattedDate}</div>
                </div>
            `;
            
            notesGrid.appendChild(noteCard);
        });
        
        // Update editor buttons if a note is open
        if (currentNoteId) {
            const currentNote = notes.find(n => n.id === currentNoteId);
            if (currentNote) {
                // Update star button
                const starIcon = starBtn.querySelector('i');
                starIcon.className = currentNote.starred ? 'fas fa-star' : 'far fa-star';
                starBtn.style.color = currentNote.starred ? 'var(--warning-color)' : '';
                
                // Update lock button
                const lockIcon = lockBtn.querySelector('i');
                lockIcon.className = currentNote.locked ? 'fas fa-lock' : 'fas fa-lock-open';
                lockBtn.style.color = currentNote.locked ? 'var(--danger-color)' : '';
                
                // Update delete button
                const deleteIcon = deleteBtn.querySelector('i');
                deleteIcon.className = currentNote.trashed ? 'fas fa-trash-restore' : 'fas fa-trash';
            }
        }
    }
    
    function getEmptyStateIcon() {
        switch(currentFilter) {
            case 'starred': return 'star';
            case 'private': return 'lock';
            case 'trash': return 'trash';
            default: return 'sticky-note';
        }
    }
    
    function getEmptyStateMessage() {
        switch(currentFilter) {
            case 'starred': return 'No starred notes';
            case 'private': return 'No private notes';
            case 'trash': return 'Trash is empty';
            default: 
                return currentTagFilter 
                    ? `No ${currentTagFilter} notes`
                    : 'No notes yet';
        }
    }
    
    // Open note in editor
    function openNote(noteId) {
        const note = notes.find(n => n.id === noteId);
        if (!note) return;
        
        currentNoteId = noteId;
        noteTitle.value = note.title;
        editorArea.innerHTML = note.content.replace(/\n/g, '<br>');
        
        // Update editor buttons
        const starIcon = starBtn.querySelector('i');
        starIcon.className = note.starred ? 'fas fa-star' : 'far fa-star';
        starBtn.style.color = note.starred ? 'var(--warning-color)' : '';
        
        const lockIcon = lockBtn.querySelector('i');
        lockIcon.className = note.locked ? 'fas fa-lock' : 'fas fa-lock-open';
        lockBtn.style.color = note.locked ? 'var(--danger-color)' : '';
        
        const deleteIcon = deleteBtn.querySelector('i');
        deleteIcon.className = note.trashed ? 'fas fa-trash-restore' : 'fas fa-trash';
        
        // Highlight active note card
        document.querySelectorAll('.note-card').forEach(card => {
            card.classList.remove('active');
            if (parseInt(card.dataset.id) === noteId) {
                card.classList.add('active');
            }
        });
        
        // Show editor (important for mobile)
        if (window.innerWidth < 992) {
            noteEditor.classList.add('active');
        }
        
        isEditorOpen = true;
    }
    
    // Create new note
    function createNewNote() {
        const newNote = {
            id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
            title: '',
            content: '',
            date: new Date().toISOString().split('T')[0],
            tag: currentTagFilter || 'personal',
            starred: false,
            locked: false,
            trashed: false
        };
        
        notes.unshift(newNote);
        saveNotes();
        currentFilter = 'all';
        updateActiveFilters();
        renderNotes();
        openNote(newNote.id);
    }
    
    // Save note
    function saveNote() {
        if (currentNoteId === null) return;
        
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex === -1) return;
        
        notes[noteIndex].title = noteTitle.value;
        notes[noteIndex].content = editorArea.innerText;
        notes[noteIndex].date = new Date().toISOString().split('T')[0];
        saveNotes();
        
        renderNotes();
        showToast('Note saved successfully');
    }
    
    // Toggle star on current note
    function toggleStar() {
        if (currentNoteId === null) return;
        
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex === -1) return;
        
        notes[noteIndex].starred = !notes[noteIndex].starred;
        saveNotes();
        
        // Update UI
        const starIcon = starBtn.querySelector('i');
        starIcon.className = notes[noteIndex].starred ? 'fas fa-star' : 'far fa-star';
        starBtn.style.color = notes[noteIndex].starred ? 'var(--warning-color)' : '';
        
        // Update in notes grid
        const noteCard = document.querySelector(`.note-card[data-id="${currentNoteId}"]`);
        if (noteCard) {
            const cardStarIcon = noteCard.querySelector('.star-btn i');
            cardStarIcon.className = notes[noteIndex].starred ? 'fas fa-star' : 'far fa-star';
        }
        
        showToast(notes[noteIndex].starred ? 'Note starred' : 'Note unstarred');
    }
    
    // Toggle lock on current note
    function toggleLock() {
        if (currentNoteId === null) return;
        
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex === -1) return;
        
        notes[noteIndex].locked = !notes[noteIndex].locked;
        saveNotes();
        
        // Update UI
        const lockIcon = lockBtn.querySelector('i');
        lockIcon.className = notes[noteIndex].locked ? 'fas fa-lock' : 'fas fa-lock-open';
        lockBtn.style.color = notes[noteIndex].locked ? 'var(--danger-color)' : '';
        
        // Update in notes grid
        const noteCard = document.querySelector(`.note-card[data-id="${currentNoteId}"]`);
        if (noteCard) {
            const cardLockIcon = noteCard.querySelector('.lock-btn i');
            cardLockIcon.className = notes[noteIndex].locked ? 'fas fa-lock' : 'fas fa-lock-open';
        }
        
        showToast(notes[noteIndex].locked ? 'Note locked (private)' : 'Note unlocked');
    }
    
    // Toggle trash/restore on current note
    function toggleTrash() {
        if (currentNoteId === null) return;
        
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex === -1) return;
        
        const isCurrentlyTrashed = notes[noteIndex].trashed;
        
        if (!isCurrentlyTrashed && !confirm('Move this note to trash?')) {
            return;
        }
        
        notes[noteIndex].trashed = !isCurrentlyTrashed;
        saveNotes();
        
        // Update UI
        const deleteIcon = deleteBtn.querySelector('i');
        deleteIcon.className = notes[noteIndex].trashed ? 'fas fa-trash-restore' : 'fas fa-trash';
        
        // If we're in the trash view and restoring, or in main view and trashing
        if ((currentFilter === 'trash' && !notes[noteIndex].trashed) || 
            (currentFilter !== 'trash' && notes[noteIndex].trashed)) {
            renderNotes();
        }
        
        showToast(notes[noteIndex].trashed ? 'Note moved to trash' : 'Note restored');
        
        // Clear editor if we trashed the current note
        if (notes[noteIndex].trashed) {
            currentNoteId = null;
            noteTitle.value = '';
            editorArea.innerHTML = '';
            
            // Hide editor on mobile
            if (window.innerWidth < 992) {
                noteEditor.classList.remove('active');
            }
        }
    }
    
    // Change note tag
    function changeTag(tag) {
        if (currentNoteId === null) return;
        
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex === -1) return;
        
        notes[noteIndex].tag = tag;
        saveNotes();
        
        // Update in notes grid
        const noteCard = document.querySelector(`.note-card[data-id="${currentNoteId}"]`);
        if (noteCard) {
            const tagElement = noteCard.querySelector('.note-card-tag');
            tagElement.className = `note-card-tag ${tag}`;
            tagElement.textContent = tag;
        }
        
        showToast(`Tag changed to ${tag}`);
    }
    
    // Update active filter indicators
    function updateActiveFilters() {
        // Update sidebar filters
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.textContent.toLowerCase().includes(currentFilter)) {
                item.classList.add('active');
            }
        });
        
        // Update tag filters
        tagItems.forEach(item => {
            const tagName = item.textContent.toLowerCase();
            item.classList.remove('active');
            if (currentTagFilter && tagName.includes(currentTagFilter)) {
                item.classList.add('active');
            }
        });
    }
    
    // Show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // New note button
        newNoteBtn.addEventListener('click', createNewNote);
        
        // Note card clicks
        notesGrid.addEventListener('click', (e) => {
            const noteCard = e.target.closest('.note-card');
            if (noteCard) {
                openNote(parseInt(noteCard.dataset.id));
            }
            
            // Star button in note card
            const starBtn = e.target.closest('.star-btn');
            if (starBtn) {
                e.stopPropagation();
                const noteId = parseInt(starBtn.closest('.note-card').dataset.id);
                const noteIndex = notes.findIndex(n => n.id === noteId);
                if (noteIndex !== -1) {
                    notes[noteIndex].starred = !notes[noteIndex].starred;
                    saveNotes();
                    renderNotes();
                    showToast(notes[noteIndex].starred ? 'Note starred' : 'Note unstarred');
                    
                    // If this is the currently open note, update editor star button
                    if (currentNoteId === noteId) {
                        const editorStarIcon = starBtn.querySelector('i');
                        editorStarIcon.className = notes[noteIndex].starred ? 'fas fa-star' : 'far fa-star';
                        starBtn.style.color = notes[noteIndex].starred ? 'var(--warning-color)' : '';
                    }
                }
            }
            
            // Lock button in note card
            const lockBtn = e.target.closest('.lock-btn');
            if (lockBtn) {
                e.stopPropagation();
                const noteId = parseInt(lockBtn.closest('.note-card').dataset.id);
                const noteIndex = notes.findIndex(n => n.id === noteId);
                if (noteIndex !== -1) {
                    notes[noteIndex].locked = !notes[noteIndex].locked;
                    saveNotes();
                    renderNotes();
                    showToast(notes[noteIndex].locked ? 'Note locked (private)' : 'Note unlocked');
                    
                    // If this is the currently open note, update editor lock button
                    if (currentNoteId === noteId) {
                        const editorLockIcon = lockBtn.querySelector('i');
                        editorLockIcon.className = notes[noteIndex].locked ? 'fas fa-lock' : 'fas fa-lock-open';
                        lockBtn.style.color = notes[noteIndex].locked ? 'var(--danger-color)' : '';
                    }
                }
            }
        });
        
        // Sidebar filters
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                currentFilter = item.textContent.trim().toLowerCase();
                currentTagFilter = null;
                updateActiveFilters();
                renderNotes();
            });
        });
        
        // Tag filters
        tagItems.forEach(item => {
            item.addEventListener('click', () => {
                const tagName = item.textContent.trim().toLowerCase();
                currentTagFilter = currentTagFilter === tagName ? null : tagName;
                updateActiveFilters();
                renderNotes();
            });
        });
        
        // Add tag button
        addTagBtn.addEventListener('click', () => {
            const newTag = prompt('Enter new tag name:');
            if (newTag && newTag.trim() !== '') {
                const tagName = newTag.trim().toLowerCase();
                if (!['business', 'personal', 'ideas'].includes(tagName)) {
                    showToast('New tags coming soon in premium version!');
                }
            }
        });
        
        // Save note on cmd/ctrl + s
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                saveNote();
            }
        });
        
        // AI Assistant
        aiBtn.addEventListener('click', () => {
            aiPanel.classList.add('active');
        });
        
        closeAi.addEventListener('click', () => {
            aiPanel.classList.remove('active');
        });
        
        // Star button in editor
        starBtn.addEventListener('click', toggleStar);
        
        // Lock button in editor
        lockBtn.addEventListener('click', toggleLock);
        
        // Delete button in editor
        deleteBtn.addEventListener('click', toggleTrash);
        
        // Change tag from editor
        document.querySelectorAll('.editor-tags .tag').forEach(tag => {
            tag.addEventListener('click', () => {
                changeTag(tag.dataset.tag);
            });
        });
        
        // Upgrade button with confetti
        upgradeBtn.addEventListener('click', () => {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
            
            showToast('Premium features unlocked!');
        });
        
        // Auto-save when leaving editor
        editorArea.addEventListener('input', () => {
            if (editorArea.innerText.trim() === '') {
                editorArea.innerHTML = '';
            }
        });
        editorArea.addEventListener('blur', saveNote);
        noteTitle.addEventListener('blur', saveNote);
        
        // Responsive behavior
        window.addEventListener('resize', handleResponsiveLayout);
        handleResponsiveLayout();
    }
    
    // Handle responsive layout
    function handleResponsiveLayout() {
        if (window.innerWidth >= 992) {
            noteEditor.classList.remove('active');
        }
    }
    
    // Initialize the app
    init();
    
    // Add some sample confetti on first load
    setTimeout(() => {
        confetti({
            particleCount: 30,
            spread: 60,
            origin: { y: 0.6 }
        });
    }, 1500);
  });