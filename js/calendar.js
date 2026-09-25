document.addEventListener('DOMContentLoaded', function() {
  const calendar = new EnhancedCalendar();
  calendar.init();
});

class EnhancedCalendar {
  constructor() {
    this.currentDate = new Date();
    this.events = [];
    this.calendars = [];
    this.reminders = [];
    this.selectedCalendarIds = new Set();
    this.selectedColor = '#4285F4';
    this.editingEventId = null;
    this.editingCalendarId = null;
    this.selectedDays = new Set();
    this.reminderContext = 'event';
    this.loadData(); 
    this.selectedFrequency = 'none';
    this.userProductivityHours = { start: 9, end: 17 };
    this.countryCodes = [
      { code: '+93', name: 'Afghanistan' },
      { code: '+355', name: 'Albania' },
      { code: '+213', name: 'Algeria' },
      { code: '+1-684', name: 'American Samoa' },
      { code: '+376', name: 'Andorra' },
      { code: '+244', name: 'Angola' },
      { code: '+1-264', name: 'Anguilla' },
      { code: '+672', name: 'Antarctica' },
      { code: '+1-268', name: 'Antigua and Barbuda' },
      { code: '+54', name: 'Argentina' },
      { code: '+374', name: 'Armenia' },
      { code: '+297', name: 'Aruba' },
      { code: '+61', name: 'Australia' },
      { code: '+43', name: 'Austria' },
      { code: '+994', name: 'Azerbaijan' },
      { code: '+1-242', name: 'Bahamas' },
      { code: '+973', name: 'Bahrain' },
      { code: '+880', name: 'Bangladesh' },
      { code: '+1-246', name: 'Barbados' },
      { code: '+375', name: 'Belarus' },
      { code: '+32', name: 'Belgium' },
      { code: '+501', name: 'Belize' },
      { code: '+229', name: 'Benin' },
      { code: '+1-441', name: 'Bermuda' },
      { code: '+975', name: 'Bhutan' },
      { code: '+591', name: 'Bolivia' },
      { code: '+387', name: 'Bosnia and Herzegovina' },
      { code: '+267', name: 'Botswana' },
      { code: '+55', name: 'Brazil' },
      { code: '+246', name: 'British Indian Ocean Territory' },
      { code: '+1-284', name: 'British Virgin Islands' },
      { code: '+673', name: 'Brunei' },
      { code: '+359', name: 'Bulgaria' },
      { code: '+226', name: 'Burkina Faso' },
      { code: '+257', name: 'Burundi' },
      { code: '+855', name: 'Cambodia' },
      { code: '+237', name: 'Cameroon' },
      { code: '+1', name: 'Canada' },
      { code: '+238', name: 'Cape Verde' },
      { code: '+1-345', name: 'Cayman Islands' },
      { code: '+236', name: 'Central African Republic' },
      { code: '+235', name: 'Chad' },
      { code: '+56', name: 'Chile' },
      { code: '+86', name: 'China' },
      { code: '+61', name: 'Christmas Island' },
      { code: '+61', name: 'Cocos Islands' },
      { code: '+57', name: 'Colombia' },
      { code: '+269', name: 'Comoros' },
      { code: '+682', name: 'Cook Islands' },
      { code: '+506', name: 'Costa Rica' },
      { code: '+385', name: 'Croatia' },
      { code: '+53', name: 'Cuba' },
      { code: '+599', name: 'Curacao' },
      { code: '+357', name: 'Cyprus' },
      { code: '+420', name: 'Czech Republic' },
      { code: '+243', name: 'Democratic Republic of the Congo' },
      { code: '+45', name: 'Denmark' },
      { code: '+253', name: 'Djibouti' },
      { code: '+1-767', name: 'Dominica' },
      { code: '+1-809', name: 'Dominican Republic' },
      { code: '+1-829', name: 'Dominican Republic' },
      { code: '+1-849', name: 'Dominican Republic' },
      { code: '+670', name: 'East Timor' },
      { code: '+593', name: 'Ecuador' },
      { code: '+20', name: 'Egypt' },
      { code: '+503', name: 'El Salvador' },
      { code: '+240', name: 'Equatorial Guinea' },
      { code: '+291', name: 'Eritrea' },
      { code: '+372', name: 'Estonia' },
      { code: '+251', name: 'Ethiopia' },
      { code: '+500', name: 'Falkland Islands' },
      { code: '+298', name: 'Faroe Islands' },
      { code: '+679', name: 'Fiji' },
      { code: '+358', name: 'Finland' },
      { code: '+33', name: 'France' },
      { code: '+689', name: 'French Polynesia' },
      { code: '+241', name: 'Gabon' },
      { code: '+220', name: 'Gambia' },
      { code: '+995', name: 'Georgia' },
      { code: '+49', name: 'Germany' },
      { code: '+233', name: 'Ghana' },
      { code: '+350', name: 'Gibraltar' },
      { code: '+30', name: 'Greece' },
      { code: '+299', name: 'Greenland' },
      { code: '+1-473', name: 'Grenada' },
      { code: '+1-671', name: 'Guam' },
      { code: '+502', name: 'Guatemala' },
      { code: '+44-1481', name: 'Guernsey' },
      { code: '+224', name: 'Guinea' },
      { code: '+245', name: 'Guinea-Bissau' },
      { code: '+592', name: 'Guyana' },
      { code: '+509', name: 'Haiti' },
      { code: '+504', name: 'Honduras' },
      { code: '+852', name: 'Hong Kong' },
      { code: '+36', name: 'Hungary' },
      { code: '+354', name: 'Iceland' },
      { code: '+91', name: 'India' },
      { code: '+62', name: 'Indonesia' },
      { code: '+98', name: 'Iran' },
      { code: '+964', name: 'Iraq' },
      { code: '+353', name: 'Ireland' },
      { code: '+44-1624', name: 'Isle of Man' },
      { code: '+972', name: 'Israel' },
      { code: '+39', name: 'Italy' },
      { code: '+225', name: 'Ivory Coast' },
      { code: '+1-876', name: 'Jamaica' },
      { code: '+81', name: 'Japan' },
      { code: '+44-1534', name: 'Jersey' },
      { code: '+962', name: 'Jordan' },
      { code: '+7', name: 'Kazakhstan' },
      { code: '+254', name: 'Kenya' },
      { code: '+686', name: 'Kiribati' },
      { code: '+383', name: 'Kosovo' },
      { code: '+965', name: 'Kuwait' },
      { code: '+996', name: 'Kyrgyzstan' },
      { code: '+856', name: 'Laos' },
      { code: '+371', name: 'Latvia' },
      { code: '+961', name: 'Lebanon' },
      { code: '+266', name: 'Lesotho' },
      { code: '+231', name: 'Liberia' },
      { code: '+218', name: 'Libya' },
      { code: '+423', name: 'Liechtenstein' },
      { code: '+370', name: 'Lithuania' },
      { code: '+352', name: 'Luxembourg' },
      { code: '+853', name: 'Macau' },
      { code: '+389', name: 'Macedonia' },
      { code: '+261', name: 'Madagascar' },
      { code: '+265', name: 'Malawi' },
      { code: '+60', name: 'Malaysia' },
      { code: '+960', name: 'Maldives' },
      { code: '+223', name: 'Mali' },
      { code: '+356', name: 'Malta' },
      { code: '+692', name: 'Marshall Islands' },
      { code: '+222', name: 'Mauritania' },
      { code: '+230', name: 'Mauritius' },
      { code: '+262', name: 'Mayotte' },
      { code: '+52', name: 'Mexico' },
      { code: '+691', name: 'Micronesia' },
      { code: '+373', name: 'Moldova' },
      { code: '+377', name: 'Monaco' },
      { code: '+976', name: 'Mongolia' },
      { code: '+382', name: 'Montenegro' },
      { code: '+1-664', name: 'Montserrat' },
      { code: '+212', name: 'Morocco' },
      { code: '+258', name: 'Mozambique' },
      { code: '+95', name: 'Myanmar' },
      { code: '+264', name: 'Namibia' },
      { code: '+674', name: 'Nauru' },
      { code: '+977', name: 'Nepal' },
      { code: '+31', name: 'Netherlands' },
      { code: '+687', name: 'New Caledonia' },
      { code: '+64', name: 'New Zealand' },
      { code: '+505', name: 'Nicaragua' },
      { code: '+227', name: 'Niger' },
      { code: '+234', name: 'Nigeria' },
      { code: '+683', name: 'Niue' },
      { code: '+850', name: 'North Korea' },
      { code: '+1-670', name: 'Northern Mariana Islands' },
      { code: '+47', name: 'Norway' },
      { code: '+968', name: 'Oman' },
      { code: '+92', name: 'Pakistan' },
      { code: '+680', name: 'Palau' },
      { code: '+970', name: 'Palestine' },
      { code: '+507', name: 'Panama' },
      { code: '+675', name: 'Papua New Guinea' },
      { code: '+595', name: 'Paraguay' },
      { code: '+51', name: 'Peru' },
      { code: '+63', name: 'Philippines' },
      { code: '+64', name: 'Pitcairn' },
      { code: '+48', name: 'Poland' },
      { code: '+351', name: 'Portugal' },
      { code: '+1-787', name: 'Puerto Rico' },
      { code: '+1-939', name: 'Puerto Rico' },
      { code: '+974', name: 'Qatar' },
      { code: '+242', name: 'Republic of the Congo' },
      { code: '+262', name: 'Reunion' },
      { code: '+40', name: 'Romania' },
      { code: '+7', name: 'Russia' },
      { code: '+250', name: 'Rwanda' },
      { code: '+590', name: 'Saint Barthelemy' },
      { code: '+290', name: 'Saint Helena' },
      { code: '+1-869', name: 'Saint Kitts and Nevis' },
      { code: '+1-758', name: 'Saint Lucia' },
      { code: '+590', name: 'Saint Martin' },
      { code: '+508', name: 'Saint Pierre and Miquelon' },
      { code: '+1-784', name: 'Saint Vincent and the Grenadines' },
      { code: '+685', name: 'Samoa' },
      { code: '+378', name: 'San Marino' },
      { code: '+239', name: 'Sao Tome and Principe' },
      { code: '+966', name: 'Saudi Arabia' },
      { code: '+221', name: 'Senegal' },
      { code: '+381', name: 'Serbia' },
      { code: '+248', name: 'Seychelles' },
      { code: '+232', name: 'Sierra Leone' },
      { code: '+65', name: 'Singapore' },
      { code: '+1-721', name: 'Sint Maarten' },
      { code: '+421', name: 'Slovakia' },
      { code: '+386', name: 'Slovenia' },
      { code: '+677', name: 'Solomon Islands' },
      { code: '+252', name: 'Somalia' },
      { code: '+27', name: 'South Africa' },
      { code: '+82', name: 'South Korea' },
      { code: '+211', name: 'South Sudan' },
      { code: '+34', name: 'Spain' },
      { code: '+94', name: 'Sri Lanka' },
      { code: '+249', name: 'Sudan' },
      { code: '+597', name: 'Suriname' },
      { code: '+268', name: 'Swaziland' },
      { code: '+46', name: 'Sweden' },
      { code: '+41', name: 'Switzerland' },
      { code: '+963', name: 'Syria' },
      { code: '+886', name: 'Taiwan' },
      { code: '+992', name: 'Tajikistan' },
      { code: '+255', name: 'Tanzania' },
      { code: '+66', name: 'Thailand' },
      { code: '+228', name: 'Togo' },
      { code: '+690', name: 'Tokelau' },
      { code: '+676', name: 'Tonga' },
      { code: '+1-868', name: 'Trinidad and Tobago' },
      { code: '+216', name: 'Tunisia' },
      { code: '+90', name: 'Turkey' },
      { code: '+993', name: 'Turkmenistan' },
      { code: '+1-649', name: 'Turks and Caicos Islands' },
      { code: '+688', name: 'Tuvalu' },
      { code: '+1-340', name: 'U.S. Virgin Islands' },
      { code: '+256', name: 'Uganda' },
      { code: '+380', name: 'Ukraine' },
      { code: '+971', name: 'United Arab Emirates' },
      { code: '+44', name: 'United Kingdom' },
      { code: '+1', name: 'United States' },
      { code: '+598', name: 'Uruguay' },
      { code: '+998', name: 'Uzbekistan' },
      { code: '+678', name: 'Vanuatu' },
      { code: '+379', name: 'Vatican' },
      { code: '+58', name: 'Venezuela' },
      { code: '+84', name: 'Vietnam' },
      { code: '+681', name: 'Wallis and Futuna' },
      { code: '+212', name: 'Western Sahara' },
      { code: '+967', name: 'Yemen' },
      { code: '+260', name: 'Zambia' },
      { code: '+263', name: 'Zimbabwe' }
    ];
    
    // DOM Elements
    this.dom = {
      currentDateEl: document.getElementById('current-date'),
      miniMonthName: document.getElementById('mini-month-name'),
      todayButton: document.getElementById('today-button'),
      prevWeekButton: document.getElementById('prev-week'),
      nextWeekButton: document.getElementById('next-week'),
      addEventButton: document.getElementById('add-event-button'),
      addTaskButton: document.getElementById('add-task-button'),
      addCalendarButton: document.getElementById('add-calendar-button'),
      savedCalendarsContainer: document.getElementById('saved-calendars'),
      daysColumns: document.getElementById('days-columns'),
      miniDaysGrid: document.getElementById('mini-days-grid'),
      weekHeader: document.querySelector('.week-header'),
      hoursColumn: document.querySelector('.hours-column'),
      totalTasksEl: document.getElementById('total-tasks'),
      completedTasksEl: document.getElementById('completed-tasks'),
      urgentTasksEl: document.getElementById('urgent-tasks'),
      // Popups
      eventPopup: document.getElementById('event-popup'),
      taskPopup: document.getElementById('task-popup'),
      calendarPopup: document.getElementById('calendar-popup'),
      reminderPopup: document.getElementById('reminder-popup'),
      toast: document.getElementById('toast'),
      // Event popup elements
      eventPopupTitle: document.getElementById('event-popup-title'),
      eventTitle: document.getElementById('event-title'),
      eventDescription: document.getElementById('event-description'),
      eventStartTime: document.getElementById('event-start-time'),
      eventEndTime: document.getElementById('event-end-time'),
      eventCalendarSelect: document.getElementById('event-calendar'),
      eventFrequency: document.getElementById('event-frequency'),
      saveEventButton: document.getElementById('save-event'),
      // Task popup elements
      taskPopupTitle: document.getElementById('task-popup-title'),
      taskTitle: document.getElementById('task-title'),
      taskDescription: document.getElementById('task-description'),
      taskDuration: document.getElementById('task-duration'),
      taskPriority: document.getElementById('task-priority'),
      taskDeadlineDate: document.getElementById('task-deadline-date'),
      taskDeadlineTime: document.getElementById('task-deadline-time'),
      taskCalendarSelect: document.getElementById('task-calendar'),
      saveTaskButton: document.getElementById('save-task'),
      // Calendar popup elements
      calendarPopupTitle: document.getElementById('calendar-popup-title'),
      calendarNameInput: document.getElementById('calendar-name'),
      calendarColorInput: document.getElementById('calendar-color'),
      saveCalendarButton: document.getElementById('save-calendar'),
      deleteCalendarButton: document.getElementById('delete-calendar'),
      // Reminder popup elements
      eventTitleDisplay: document.getElementById('event-title-display'),
      eventTimeDisplay: document.getElementById('event-time-display'),
      saveReminderButton: document.getElementById('save-reminder'),
      remindersList: document.getElementById('event-reminders-list'),
      taskRemindersList: document.getElementById('task-reminders-list')
    };

    this.reminderSystem = new ReminderSystem();
    this.reminderSystem.start();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.setupDaySelection();
    this.setupFrequencySelection();
    this.setupCountryCodeSearch(); // Add this line
    
    this.requestNotificationPermission();
    this.setupNavigation();
  }

  render() {
    this.updateHeader();
    this.renderMiniMonth();
    this.renderWeekHeader();
    this.renderHoursColumn();
    this.renderWeekView();
    this.renderCalendarsList();
    this.populateCalendarDropdown();
    this.updateTaskSummary();
  }

  updateHeader() {
    const options = { month: 'long', year: 'numeric' };
    this.dom.currentDateEl.textContent = this.currentDate.toLocaleDateString('en-US', options);
    this.dom.miniMonthName.textContent = this.currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  // Add this to your EnhancedCalendar class
setupCountryCodeSearch() {
  const searchInput = document.getElementById('country-code-search');
  const resultsContainer = document.getElementById('country-results');
  const countryCodeField = document.getElementById('selected-country-code');
  
  if (!searchInput || !resultsContainer) return;

  // Show results when input is focused
  searchInput.addEventListener('focus', () => {
    this.showCountryResults('');
  });

  // Filter results as user types
  searchInput.addEventListener('input', (e) => {
    this.showCountryResults(e.target.value);
  });

  // Hide results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target)) {
      resultsContainer.style.display = 'none';
    }
  });
}

showCountryResults(searchTerm) {
  const searchInput = document.getElementById('country-code-search');
  const resultsContainer = document.getElementById('country-results');
  const countryCodeField = document.getElementById('selected-country-code');
  
  if (!resultsContainer) return;

  // Get all country options from your original select
  const countryOptions = Array.from(document.querySelectorAll('.country-code option'));
  
  const filtered = countryOptions.filter(option => 
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  resultsContainer.innerHTML = '';
  
  if (filtered.length === 0) {
    resultsContainer.style.display = 'none';
    return;
  }

  filtered.forEach(option => {
    const item = document.createElement('div');
    item.className = 'country-result-item';
    item.textContent = option.text;
    item.dataset.value = option.value;
    
    item.addEventListener('click', () => {
      searchInput.value = option.text;
      countryCodeField.value = option.value;
      resultsContainer.style.display = 'none';
    });
    
    resultsContainer.appendChild(item);
  });

  resultsContainer.style.display = 'block';
}

// Add to your EnhancedCalendar class
setupCountryCodeSearch() {
  const searchInput = document.getElementById('country-code-search');
  const resultsContainer = document.getElementById('country-results');
  const countryCodeField = document.getElementById('selected-country-code');
  const whatsappNumberField = document.getElementById('whatsapp-number');
  
  if (!searchInput || !resultsContainer) return;

  // Show results when input is focused
  searchInput.addEventListener('focus', () => {
    this.showCountryResults('');
  });

  // Filter results as user types
  searchInput.addEventListener('input', (e) => {
    this.showCountryResults(e.target.value);
  });

  // Handle selection
  resultsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('country-result-item')) {
      searchInput.value = e.target.textContent;
      countryCodeField.value = e.target.dataset.value;
      resultsContainer.style.display = 'none';
      whatsappNumberField.focus();
    }
  });

  // Hide results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) ){
      resultsContainer.style.display = 'none';
    }
  });
}

showCountryResults(searchTerm) {
  const searchInput = document.getElementById('country-code-search');
  const resultsContainer = document.getElementById('country-results');
  
  if (!resultsContainer) return;

  // Get all country options
  const countryOptions = Array.from(document.querySelectorAll('#country-code option'));
  
  const filtered = countryOptions.filter(option => 
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  resultsContainer.innerHTML = '';
  
  if (filtered.length === 0) {
    resultsContainer.style.display = 'none';
    return;
  }

  filtered.forEach(option => {
    const item = document.createElement('div');
    item.className = 'country-result-item';
    item.textContent = option.text;
    item.dataset.value = option.value;
    resultsContainer.appendChild(item);
  });

  resultsContainer.style.display = 'block';
}
  
  populateCountryCodes(filter = '') {
    const countrySelect = document.getElementById('country-code');
    if (!countrySelect) return;
    
    countrySelect.innerHTML = '';
    
    const filteredCountries = filter 
      ? this.countryCodes.filter(country => 
          country.name.toLowerCase().includes(filter) || 
          country.code.includes(filter))
      : this.countryCodes;
    
    filteredCountries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.code;
      option.textContent = `${country.name} (${country.code})`;
      countrySelect.appendChild(option);
    });
  }
  
  filterCountryCodes(searchTerm) {
    this.populateCountryCodes(searchTerm);
    
    const countrySelect = document.getElementById('country-code');
    if (countrySelect) {
      // Show up to 10 options with scrolling
      countrySelect.size = Math.min(10, countrySelect.options.length);
      countrySelect.style.display = 'block';
    }
  }
  
  populateCountryCodes(filter = '') {
    const countrySelect = document.getElementById('country-code');
    if (!countrySelect) return;
    
    countrySelect.innerHTML = '';
    
    const filteredCountries = filter 
      ? this.countryCodes.filter(country => 
          country.name.toLowerCase().includes(filter.toLowerCase()) || 
          country.code.toLowerCase().includes(filter.toLowerCase()))
      : this.countryCodes;
    
    filteredCountries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.code;
      option.textContent = `${country.name} (${country.code})`;
      countrySelect.appendChild(option);
    });
  
    // Set default country if not filtered
    if (!filter) {
      this.setDefaultCountryCode();
    }
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const targetPage = button.dataset.page;
        this.switchPage(targetPage);
      });
    });
  }

  switchPage(targetPage) {
    console.log(`Switching to ${targetPage} page`);
  }

  renderMiniMonth() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    this.dom.miniDaysGrid.innerHTML = '';
    
    for (let i = 0; i < startingDay; i++) {
      const emptyCell = document.createElement('span');
      emptyCell.className = 'other-month';
      this.dom.miniDaysGrid.appendChild(emptyCell);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dayCell = document.createElement('span');
      dayCell.textContent = i;
      
      const isCurrentDay = i === new Date().getDate() && 
                          month === new Date().getMonth() && 
                          year === new Date().getFullYear();
      
      if (isCurrentDay) {
        dayCell.classList.add('current-day');
      }
      
      dayCell.addEventListener('click', () => {
        this.navigateToDate(new Date(year, month, i));
      });
      
      this.dom.miniDaysGrid.appendChild(dayCell);
    }
  }

  renderWeekHeader() {
    this.dom.weekHeader.innerHTML = '';
    
    // Add empty space to match the hours column width
    const hoursPlaceholder = document.createElement('div');
    hoursPlaceholder.style.width = '60px';
    hoursPlaceholder.style.flexShrink = '0';
    this.dom.weekHeader.appendChild(hoursPlaceholder);
    
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      
      const dayContainer = document.createElement('div');
      dayContainer.style.flex = '1';
      dayContainer.style.display = 'flex';
      dayContainer.style.flexDirection = 'column';
      
      const dayHeader = document.createElement('div');
      dayHeader.className = 'day-header';
      
      const dayName = document.createElement('div');
      dayName.className = 'day-name';
      dayName.textContent = dayDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      
      const dayNumber = document.createElement('div');
      dayNumber.className = 'day-number';
      dayNumber.textContent = dayDate.getDate();
      
      if (this.isSameDay(dayDate, new Date())) {
        dayHeader.classList.add('current-day');
      }
      
      dayHeader.appendChild(dayName);
      dayHeader.appendChild(dayNumber);
      dayContainer.appendChild(dayHeader);
      
      // Add separator after each day except the last one
      if (i < 6) {
        const separator = document.createElement('div');
        separator.className = 'separator';
        dayContainer.appendChild(separator);
      }
      
      this.dom.weekHeader.appendChild(dayContainer);
    }
  }

  renderHoursColumn() {
    this.dom.hoursColumn.innerHTML = '';
    
    for (let hour = 0; hour < 24; hour++) {
      const hourLabel = document.createElement('div');
      hourLabel.className = 'hour-label';
      
      let displayHour = hour % 12;
      if (displayHour === 0) displayHour = 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      
      hourLabel.textContent = `${displayHour} ${ampm}`;
      this.dom.hoursColumn.appendChild(hourLabel);
    }
  }

  renderWeekView() {
    this.dom.daysColumns.innerHTML = '';
    
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      
      const dayColumn = document.createElement('div');
      dayColumn.className = 'day-column';
      dayColumn.dataset.date = dayDate.toISOString().split('T')[0];
      
      if (this.isSameDay(dayDate, new Date())) {
        dayColumn.classList.add('current-day');
      }
      
      for (let hour = 0; hour < 24; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.dataset.hour = hour;
        
        timeSlot.addEventListener('click', (e) => {
          if (e.target === timeSlot) {
            this.openEventPopupForNewEvent(dayDate, hour);
          }
        });
        
        dayColumn.appendChild(timeSlot);
      }
      
      this.dom.daysColumns.appendChild(dayColumn);
    }
    
    this.renderEvents();
  }

  renderEvents() {
    document.querySelectorAll('.event').forEach(event => event.remove());
    
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const eventsForWeek = this.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfWeek && 
             eventDate <= endOfWeek &&
             this.selectedCalendarIds.has(event.calendarId);
    });
    
    eventsForWeek.forEach(event => {
      const calendar = this.calendars.find(c => c.id === event.calendarId);
      if (calendar) {
        this.renderEvent(event, calendar.color);
      }
    });
  }

  renderEvent(event, calendarColor) {
    const eventDate = new Date(event.date);
    const dayOfWeek = eventDate.getDay();
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    
    const hourHeight = 60;
    const startPosition = (startHour + startMinute / 60) * hourHeight;
    const duration = (endHour + endMinute / 60) - (startHour + startMinute / 60);
    const eventHeight = duration * hourHeight;
    
    const dayColumns = this.dom.daysColumns;
    if (!dayColumns || dayColumns.children.length !== 7) return;
    
    const dayColumn = dayColumns.children[dayOfWeek];
    if (!dayColumn) return;
    
    const eventEl = document.createElement('div');
    eventEl.className = 'event';
    eventEl.dataset.eventId = event.id;
    
    if (event.completed) {
      eventEl.classList.add('completed');
    }
    
    if (event.isTask) {
      eventEl.classList.add('task');
      eventEl.classList.add(event.priority || 'medium');
    }
    
    eventEl.style.top = `${startPosition}px`;
    eventEl.style.height = `${eventHeight}px`;
    eventEl.style.backgroundColor = calendarColor;
    eventEl.style.position = 'absolute';
    eventEl.style.left = '5px';
    eventEl.style.right = '5px';
    
    let eventContent = `
      <div class="event-title">${event.title}</div>
      <div class="event-time">${this.formatTime(event.startTime)} - ${this.formatTime(event.endTime)}</div>
    `;
    
    if (event.isTask && event.deadline) {
      const deadline = new Date(event.deadline);
      const deadlineStr = deadline.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      eventContent += `
        <div class="event-deadline">
          <i class="fas fa-clock"></i> Due: ${deadlineStr}
        </div>
      `;
    }
    
    eventContent += `
      <div class="event-actions">
        <button class="delete-event" data-id="${event.id}" aria-label="Delete event">×</button>
        <button class="complete-event" data-id="${event.id}" aria-label="Mark as ${event.completed ? 'incomplete' : 'complete'}">✓</button>
      </div>
    `;
    
    eventEl.innerHTML = eventContent;
    
    dayColumn.appendChild(eventEl);
    
    eventEl.addEventListener('dblclick', () => {
      if (event.isTask) {
        this.openTaskPopupForEditing(event);
      } else {
        this.openEventPopupForEditing(event);
      }
    });
    
    eventEl.querySelector('.delete-event').addEventListener('click', (e) => {
      e.stopPropagation();
      this.deleteEvent(event.id);
    });
    
    eventEl.querySelector('.complete-event').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleEventCompletion(event.id);
    });
  }

  renderCalendarsList() {
    this.dom.savedCalendarsContainer.innerHTML = '';
    
    this.calendars.forEach(calendar => {
      const calendarEl = document.createElement('div');
      calendarEl.className = 'saved-calendar';
      
      calendarEl.innerHTML = `
        <div class="calendar-color" style="background-color: ${calendar.color}"></div>
        <div class="calendar-name">${calendar.name}</div>
        <input type="checkbox" class="calendar-checkbox" 
               data-id="${calendar.id}" ${this.selectedCalendarIds.has(calendar.id) ? 'checked' : ''}>
      `;
      
      calendarEl.querySelector('.calendar-checkbox').addEventListener('change', (e) => {
        if (e.target.checked) {
          this.selectedCalendarIds.add(calendar.id);
        } else {
          this.selectedCalendarIds.delete(calendar.id);
        }
        this.renderEvents();
      });
      
      calendarEl.addEventListener('dblclick', () => {
        this.openCalendarPopupForEditing(calendar);
      });
      
      this.dom.savedCalendarsContainer.appendChild(calendarEl);
    });
  }

  populateCalendarDropdown() {
    this.dom.eventCalendarSelect.innerHTML = '';
    this.dom.taskCalendarSelect.innerHTML = '';
    
    this.calendars.forEach(calendar => {
      const option = document.createElement('option');
      option.value = calendar.id;
      option.textContent = calendar.name;
      option.style.color = calendar.color;
      this.dom.eventCalendarSelect.appendChild(option);
      
      const taskOption = option.cloneNode(true);
      this.dom.taskCalendarSelect.appendChild(taskOption);
    });
    
    if (this.selectedCalendarIds.size === 0 && this.calendars.length > 0) {
      this.selectedCalendarIds.add(this.calendars[0].id);
      this.dom.eventCalendarSelect.value = this.calendars[0].id;
      this.dom.taskCalendarSelect.value = this.calendars[0].id;
    }
  }

  updateTaskSummary() {
    const tasks = this.events.filter(e => e.isTask);
    const completedTasks = tasks.filter(t => t.completed).length;
    const urgentTasks = tasks.filter(t => t.priority === 'urgent' && !t.completed).length;
    
    this.dom.totalTasksEl.textContent = tasks.length;
    this.dom.completedTasksEl.textContent = completedTasks;
    this.dom.urgentTasksEl.textContent = urgentTasks;
  }

  setupEventListeners() {
    this.dom.todayButton.addEventListener('click', () => {
      this.currentDate = new Date();
      this.render();
      this.showToast('Returned to today\'s view', 'success');
    });
    
    this.dom.prevWeekButton.addEventListener('click', () => {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
      this.render();
    });
    
    this.dom.nextWeekButton.addEventListener('click', () => {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
      this.render();
    });
    
    this.dom.addEventButton.addEventListener('click', () => {
      this.openEventPopupForNewEvent();
    });
    
    this.dom.addTaskButton.addEventListener('click', () => {
      this.openTaskPopupForNewTask();
    });
    
    this.dom.addCalendarButton.addEventListener('click', () => {
      this.openCalendarPopupForNew();
    });
    
    this.dom.saveEventButton.addEventListener('click', () => {
      if (this.editingEventId) {
        this.updateEvent();
      } else {
        this.saveEvent();
      }
    });
    
    document.getElementById('close-event-popup').addEventListener('click', () => {
      this.closePopup('event-popup');
    });
    
    document.getElementById('cancel-event').addEventListener('click', () => {
      this.closePopup('event-popup');
    });
    
    this.dom.saveTaskButton.addEventListener('click', () => {
      this.saveTask();
    });
    
    document.getElementById('close-task-popup').addEventListener('click', () => {
      this.closePopup('task-popup');
    });
    
    document.getElementById('cancel-task').addEventListener('click', () => {
      this.closePopup('task-popup');
    });
    
    this.dom.saveCalendarButton.addEventListener('click', () => {
      this.saveCalendar();
    });
    
    this.dom.deleteCalendarButton.addEventListener('click', () => {
      this.deleteCalendar();
    });
    
    document.getElementById('close-calendar-popup').addEventListener('click', () => {
      this.closePopup('calendar-popup');
    });
    
    document.getElementById('cancel-calendar').addEventListener('click', () => {
      this.closePopup('calendar-popup');
    });
    
    document.getElementById('set-reminder').addEventListener('click', () => {
      this.openReminderPopup();
    });
    
    document.getElementById('set-task-reminder').addEventListener('click', () => {
      this.openReminderPopup('task');
    });
    
    this.dom.saveReminderButton.addEventListener('click', () => {
      this.saveReminder();
    });
    
    document.getElementById('close-reminder-popup').addEventListener('click', () => {
      this.closePopup('reminder-popup');
    });
    
    document.getElementById('cancel-reminder').addEventListener('click', () => {
      this.closePopup('reminder-popup');
    });
    
    document.querySelectorAll('.reminder-option-card').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.reminder-option-card').forEach(opt => {
          opt.classList.remove('active');
        });
        option.classList.add('active');
      });
    });
    
    document.querySelectorAll('.method-card').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.method-card').forEach(opt => {
          opt.classList.remove('active');
        });
        option.classList.add('active');
        
        document.getElementById('whatsapp-fields').style.display = 'none';
        document.getElementById('email-fields').style.display = 'none';
        
        if (option.dataset.method === 'whatsapp') {
          document.getElementById('whatsapp-fields').style.display = 'block';
        } else if (option.dataset.method === 'email') {
          document.getElementById('email-fields').style.display = 'block';
        }
      });
    });
  }

  setupDaySelection() {
    document.querySelectorAll('.day-option').forEach(option => {
      option.addEventListener('click', () => {
        option.classList.toggle('selected');
        const day = option.dataset.day;
        if (option.classList.contains('selected')) {
          this.selectedDays.add(day);
        } else {
          this.selectedDays.delete(day);
        }
      });
    });
  }

  setupFrequencySelection() {
    document.querySelectorAll('.frequency-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.frequency-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        option.classList.add('selected');
        this.selectedFrequency = option.dataset.frequency;
      });
    });
  }

  openEventPopupForNewEvent(date, hour) {
    this.dom.eventPopupTitle.textContent = 'Add New Event';
    this.dom.eventTitle.value = '';
    this.dom.eventDescription.value = '';
    this.selectedDays = new Set();
    this.selectedFrequency = 'none';
    
    document.querySelectorAll('.day-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    document.querySelectorAll('.frequency-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    document.querySelector('.frequency-option[data-frequency="none"]').classList.add('selected');
    
    this.dom.eventStartTime.value = '09:00';
    this.dom.eventEndTime.value = '10:00';
    
    if (date && hour !== undefined) {
      const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const dayName = dayNames[date.getDay()];
      const dayOption = document.querySelector(`.day-option[data-day="${dayName}"]`);
      if (dayOption) {
        dayOption.classList.add('selected');
        this.selectedDays.add(dayName);
      }
      
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = hour === 23 ? '23:59' : `${(hour + 1).toString().padStart(2, '0')}:00`;
      this.dom.eventStartTime.value = startTime;
      this.dom.eventEndTime.value = endTime;
    }
    
    this.editingEventId = null;
    this.openPopup('event-popup');
  }

  openTaskPopupForNewTask() {
    this.dom.taskPopupTitle.textContent = 'Add New Task';
    this.dom.taskTitle.value = '';
    this.dom.taskDescription.value = '';
    this.dom.taskDuration.value = '30';
    this.dom.taskPriority.value = 'medium';
    
    // Set default deadline to tomorrow at 5pm
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format for date input (YYYY-MM-DD)
    const formattedDate = tomorrow.toISOString().split('T')[0];
    this.dom.taskDeadlineDate.value = formattedDate;
    this.dom.taskDeadlineTime.value = '17:00';
    
    this.editingEventId = null;
    this.openPopup('task-popup');
  }

  openEventPopupForEditing(event) {
    this.dom.eventPopupTitle.textContent = 'Edit Event';
    this.dom.eventTitle.value = event.title || '';
    this.dom.eventDescription.value = event.description || '';
    this.dom.eventStartTime.value = event.startTime || '09:00';
    this.dom.eventEndTime.value = event.endTime || '10:00';
    this.dom.eventCalendarSelect.value = event.calendarId || (this.calendars[0]?.id || '');
    
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const eventDate = new Date(event.date);
    const dayName = dayNames[eventDate.getDay()];
    document.querySelectorAll('.day-option').forEach(opt => {
      opt.classList.remove('selected');
      if (opt.dataset.day === dayName) {
        opt.classList.add('selected');
        this.selectedDays.add(dayName);
      }
    });
    
    this.selectedFrequency = event.frequency || 'none';
    document.querySelectorAll('.frequency-option').forEach(opt => {
      opt.classList.remove('selected');
      if (opt.dataset.frequency === this.selectedFrequency) {
        opt.classList.add('selected');
      }
    });

    this.editingEventId = event.id;
    this.openPopup('event-popup');
  }

  openTaskPopupForEditing(task) {
    this.dom.taskPopupTitle.textContent = 'Edit Task';
    this.dom.taskTitle.value = task.title || '';
    this.dom.taskDescription.value = task.description || '';
    this.dom.taskDuration.value = task.duration || '30';
    this.dom.taskPriority.value = task.priority || 'medium';
    this.dom.taskCalendarSelect.value = task.calendarId || (this.calendars[0]?.id || '');
    
    if (task.deadline) {
      const deadline = new Date(task.deadline);
      this.dom.taskDeadlineDate.value = deadline.toISOString().split('T')[0];
      this.dom.taskDeadlineTime.value = deadline.toTimeString().substring(0, 5);
    } else {
      // Set default deadline to tomorrow at 5pm
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.dom.taskDeadlineDate.value = tomorrow.toISOString().split('T')[0];
      this.dom.taskDeadlineTime.value = '17:00';
    }
    
    this.editingEventId = task.id;
    this.openPopup('task-popup');
  }

  saveEvent() {
    const title = this.dom.eventTitle.value.trim();
    const description = this.dom.eventDescription.value.trim();
    const startTime = this.dom.eventStartTime.value;
    const endTime = this.dom.eventEndTime.value;
    const calendarId = parseInt(this.dom.eventCalendarSelect.value);
    const frequency = this.selectedFrequency;
    
    if (!title) {
      this.showError('event-title-error', 'Please enter an event title');
      return;
    }
    
    if (this.selectedDays.size === 0) {
      this.showError('event-days-error', 'Please select at least one day');
      return;
    }
    
    if (startTime >= endTime) {
      this.showError('event-time-error', 'End time must be after start time');
      return;
    }
    
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
    
    Array.from(this.selectedDays).forEach(day => {
      const dayIndex = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].indexOf(day);
      const eventDate = new Date(startOfWeek);
      eventDate.setDate(startOfWeek.getDate() + dayIndex);
      
      const event = {
        id: Date.now() + Math.random(),
        title,
        description,
        startTime,
        endTime,
        date: eventDate,
        frequency,
        completed: false,
        calendarId,
        isTask: false
      };
      
      this.events.push(event);
      
      if (frequency && frequency !== 'none') {
        this.generateRecurringEvents(event);
      }
    });
    
    this.closePopup('event-popup');
    this.renderEvents();
    this.saveToLocalStorage();
    this.showToast('Event saved successfully', 'success');
  }

  saveTask() {
    const title = this.dom.taskTitle.value.trim();
    const description = this.dom.taskDescription.value.trim();
    const duration = parseInt(this.dom.taskDuration.value) || 30;
    const priority = this.dom.taskPriority.value;
    const calendarId = parseInt(this.dom.taskCalendarSelect.value);
    
    // Get deadline date and time
    const deadlineDate = this.dom.taskDeadlineDate.value;
    const deadlineTime = this.dom.taskDeadlineTime.value;
    
    // Validation checks
    if (!title) {
        this.showError('task-title-error', 'Please enter a task title');
        return;
    }
    
    if (!deadlineDate || !deadlineTime) {
        this.showError('task-deadline-error', 'Please select a valid deadline');
        return;
    }
    
    if (duration < 5) {
        this.showError('task-duration-error', 'Minimum duration is 5 minutes');
        return;
    }
    
    // Create deadline datetime
    const deadline = new Date(`${deadlineDate}T${deadlineTime}`);
    if (isNaN(deadline.getTime())) {
        this.showError('task-deadline-error', 'Please select a valid deadline');
        return;
    }
    
    // Calculate start and end times (start 30 minutes before deadline by default)
    const startTime = new Date(deadline);
    startTime.setMinutes(startTime.getMinutes() - duration);
    
    // Create the task object
    const task = {
        id: this.editingEventId || Date.now() + Math.random(),
        title,
        description,
        startTime: this.formatTimeForStorage(startTime),
        endTime: this.formatTimeForStorage(deadline),
        date: startTime,
        duration,
        priority,
        deadline,
        completed: false,
        calendarId,
        isTask: true
    };
    
    // Add or update the task
    if (this.editingEventId) {
        const index = this.events.findIndex(e => e.id === this.editingEventId);
        if (index !== -1) {
            this.events[index] = task;
        }
    } else {
        this.events.push(task);
    }
    
    // Update UI and save
    this.closePopup('task-popup');
    this.renderEvents();
    this.updateTaskSummary();
    this.saveToLocalStorage();
    this.showToast('Task saved successfully', 'success');
  }

  formatTimeForStorage(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  generateRecurringEvents(originalEvent) {
    let currentDate = new Date(originalEvent.date);
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);
    
    while (currentDate <= endDate) {
      if (originalEvent.frequency === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (originalEvent.frequency === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (originalEvent.frequency === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      if (currentDate <= endDate) {
        const newEvent = {
          ...originalEvent,
          id: Date.now() + Math.random(),
          date: new Date(currentDate),
          recurringFrom: originalEvent.id
        };
        this.events.push(newEvent);
      }
    }
  }

  updateEvent() {
    const title = this.dom.eventTitle.value.trim();
    const description = this.dom.eventDescription.value.trim();
    const startTime = this.dom.eventStartTime.value;
    const endTime = this.dom.eventEndTime.value;
    const calendarId = parseInt(this.dom.eventCalendarSelect.value);
    const frequency = this.selectedFrequency;
    
    if (!title) {
      this.showError('event-title-error', 'Please enter an event title');
      return;
    }
    
    if (this.selectedDays.size === 0) {
      this.showError('event-days-error', 'Please select at least one day');
      return;
    }
    
    if (startTime >= endTime) {
      this.showError('event-time-error', 'End time must be after start time');
      return;
    }
    
    const eventIndex = this.events.findIndex(e => e.id === this.editingEventId);
    if (eventIndex === -1) return;
    
    const originalEvent = this.events[eventIndex];
    
    // Get the first selected day (since we're editing an existing single event)
    const firstDay = Array.from(this.selectedDays)[0];
    const dayIndex = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].indexOf(firstDay);
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
    const eventDate = new Date(startOfWeek);
    eventDate.setDate(startOfWeek.getDate() + dayIndex);
    
    this.events[eventIndex] = {
      ...originalEvent,
      title,
      description,
      date: eventDate,
      startTime,
      endTime,
      frequency,
      calendarId
    };
    
    if (originalEvent.frequency !== 'none') {
      this.events = this.events.filter(e => 
        !e.recurringFrom || e.recurringFrom !== originalEvent.id
      );
    }
    
    if (frequency !== 'none') {
      this.generateRecurringEvents(this.events[eventIndex]);
    }
    
    this.closePopup('event-popup');
    this.renderEvents();
    this.saveToLocalStorage();
    this.showToast('Event updated successfully', 'success');
  }

  deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
      const event = this.events.find(e => e.id === eventId);
      
      if (event) {
        this.events = this.events.filter(e => 
          e.id !== eventId && 
          (!e.recurringFrom || e.recurringFrom !== eventId)
        );
        
        this.renderEvents();
        this.updateTaskSummary();
        this.saveToLocalStorage();
        this.showToast('Event deleted', 'success');
      }
    }
  }

  toggleEventCompletion(eventId) {
    const eventIndex = this.events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
        this.events[eventIndex].completed = !this.events[eventIndex].completed;
        
        const eventEl = document.querySelector(`.event[data-event-id="${eventId}"]`);
        if (eventEl) {
            eventEl.classList.toggle('completed');
            
            const completeBtn = eventEl.querySelector('.complete-event');
            if (completeBtn) {
                completeBtn.setAttribute('aria-label', 
                    this.events[eventIndex].completed ? 'Mark as incomplete' : 'Mark as complete');
            }
        }
        
        this.saveToLocalStorage();
        this.updateTaskSummary();
        
        const action = this.events[eventIndex].completed ? 'completed' : 'reopened';
        this.showToast(`Task ${action}`, 'success', true, () => {
            this.events[eventIndex].completed = !this.events[eventIndex].completed;
            this.renderEvents();
            this.updateTaskSummary();
            this.saveToLocalStorage();
        });
    }
  }

  openCalendarPopupForNew() {
    this.dom.calendarPopupTitle.textContent = 'Add New Calendar';
    this.dom.calendarNameInput.value = '';
    this.dom.calendarColorInput.value = '#4285F4';
    this.dom.saveCalendarButton.textContent = 'Save Calendar';
    this.dom.deleteCalendarButton.style.display = 'none';
    this.editingCalendarId = null;
    
    this.openPopup('calendar-popup');
  }

  openCalendarPopupForEditing(calendar) {
    this.dom.calendarPopupTitle.textContent = 'Edit Calendar';
    this.dom.calendarNameInput.value = calendar.name;
    this.dom.calendarColorInput.value = calendar.color;
    this.dom.saveCalendarButton.textContent = 'Update Calendar';
    this.dom.deleteCalendarButton.style.display = 'block';
    this.editingCalendarId = calendar.id;
    
    this.openPopup('calendar-popup');
  }

  validateCalendar() {
    let isValid = true;
    
    if (!this.dom.calendarNameInput.value.trim()) {
      this.showError('calendar-name-error', 'Please enter a calendar name');
      isValid = false;
    } else {
      this.hideError('calendar-name-error');
    }
    
    return isValid;
  }

  saveCalendar() {
    if (!this.validateCalendar()) return;
    
    const name = this.dom.calendarNameInput.value.trim();
    const color = this.dom.calendarColorInput.value;
    
    if (this.editingCalendarId) {
      const calendarIndex = this.calendars.findIndex(c => c.id === this.editingCalendarId);
      if (calendarIndex !== -1) {
        this.calendars[calendarIndex] = {
          ...this.calendars[calendarIndex],
          name,
          color
        };
        
        this.events.forEach(event => {
          if (event.calendarId === this.editingCalendarId) {
            event.color = color;
          }
        });
        
        this.showToast('Calendar updated successfully', 'success');
      }
    } else {
      const calendar = {
        id: Date.now(),
        name,
        color
      };
      
      this.calendars.push(calendar);
      this.selectedCalendarIds.add(calendar.id);
      this.showToast('Calendar created successfully', 'success');
    }
    
    this.closePopup('calendar-popup');
    this.renderCalendarsList();
    this.populateCalendarDropdown();
    this.renderEvents();
    this.saveToLocalStorage();
  }

  deleteCalendar() {
    if (confirm('Are you sure you want to delete this calendar? All events in this calendar will also be deleted.')) {
      this.calendars = this.calendars.filter(c => c.id !== this.editingCalendarId);
      this.selectedCalendarIds.delete(this.editingCalendarId);
      
      this.events = this.events.filter(e => e.calendarId !== this.editingCalendarId);
      
      this.closePopup('calendar-popup');
      this.renderCalendarsList();
      this.populateCalendarDropdown();
      this.renderEvents();
      this.updateTaskSummary();
      this.saveToLocalStorage();
      this.showToast('Calendar deleted', 'success');
    }
  }

  openReminderPopup(context = 'event') {
    if (!this.dom.eventTitleDisplay || !this.dom.eventTimeDisplay) {
        console.error('Required elements for reminder popup not found');
        return;
    }

    this.reminderContext = context;

    let eventTitle, eventStartTime;
    
    if (context === 'task') {
      eventTitle = this.dom.taskTitle.value.trim() || 'New Task';
      eventStartTime = this.dom.taskDeadlineTime.value;
    } else {
      eventTitle = this.dom.eventTitle.value.trim() || 'New Event';
      eventStartTime = this.dom.eventStartTime.value;
    }
    
    this.dom.eventTitleDisplay.textContent = eventTitle;
    
    if (eventStartTime) {
        const [hours, minutes] = eventStartTime.split(':').map(Number);
        const eventDate = new Date();
        eventDate.setHours(hours, minutes);
        
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        this.dom.eventTimeDisplay.textContent = eventDate.toLocaleDateString('en-US', options);
    } else {
        this.dom.eventTimeDisplay.textContent = 'Time not set';
    }
    
    document.querySelectorAll('.reminder-option-card').forEach(opt => {
        opt.classList.remove('active');
    });
    document.querySelector('.reminder-option-card[data-minutes="0"]').classList.add('active');
    
    document.querySelectorAll('.method-card').forEach(opt => {
        opt.classList.remove('active');
    });
    document.querySelector('.method-card[data-method="notification"]').classList.add('active');
    
    document.getElementById('whatsapp-fields').style.display = 'none';
    document.getElementById('email-fields').style.display = 'none';
    document.getElementById('whatsapp-number').value = '';
    document.getElementById('email-address').value = '';
    
    this.openPopup('reminder-popup');
  }

  saveReminder() {
    const selectedMethod = document.querySelector('.method-card.active');
    const minutesBefore = parseInt(document.querySelector('.reminder-option-card.active').dataset.minutes);
    
    if (!selectedMethod) {
      this.showError('reminder-method-error', 'Please select a reminder method');
      return;
    }
    
    const method = selectedMethod.dataset.method;
    let contactInfo = null;
    let isValid = true;
    
    if (method === 'whatsapp') {
      const phoneNumber = document.getElementById('whatsapp-number').value.trim();
      if (!phoneNumber) {
        this.showError('whatsapp-number-error', 'Please enter a phone number');
        isValid = false;
      } else {
        const countryCode = document.getElementById('country-code').value;
        contactInfo = `${countryCode}${phoneNumber}`;
        this.hideError('whatsapp-number-error');
      }
    } else if (method === 'email') {
      const email = document.getElementById('email-address').value.trim();
      if (!email || !this.validateEmail(email)) {
        this.showError('email-error', 'Please enter a valid email address');
        isValid = false;
      } else {
        contactInfo = email;
        this.hideError('email-error');
      }
    }
    
    if (!isValid) return;
    
    // Get the current event/task being edited
    let event;
    if (this.editingEventId) {
      event = this.events.find(e => e.id === this.editingEventId);
    } else {
      // For new events, create a temporary object
      event = {
        id: 'temp-' + Date.now(),
        title: this.dom.eventTitle.value.trim() || 'New Event',
        date: new Date(), // You'll need to get the actual event date
        startTime: this.dom.eventStartTime.value || '00:00'
      };
    }
    
    // Add the reminder to the reminder system
    this.reminderSystem.addReminder(event, minutesBefore, method, contactInfo);
    
    // Create the UI element
    const reminderItem = document.createElement('div');
    reminderItem.className = 'reminder-item';
    
    let methodText = '';
    if (method === 'notification') {
      methodText = 'Desktop Notification';
    } else if (method === 'whatsapp') {
      methodText = 'WhatsApp Message';
    } else if (method === 'email') {
      methodText = 'Email';
    }
    
    let timeText = '';
    if (minutesBefore === 0) {
      timeText = 'At time of event';
    } else if (minutesBefore < 60) {
      timeText = `${minutesBefore} minutes before`;
    } else if (minutesBefore < 1440) {
      timeText = `${Math.floor(minutesBefore / 60)} hour${Math.floor(minutesBefore / 60) > 1 ? 's' : ''} before`;
    } else {
      timeText = `${Math.floor(minutesBefore / 1440)} day${Math.floor(minutesBefore / 1440) > 1 ? 's' : ''} before`;
    }
    
    reminderItem.innerHTML = `
      <span>${methodText} - ${timeText}</span>
      <button class="delete-reminder" aria-label="Remove reminder">&times;</button>
    `;
    
    reminderItem.querySelector('.delete-reminder').addEventListener('click', () => {
      reminderItem.remove();
      // You should also remove the reminder from the reminderSystem
    });
    
    // Add to the list belonging to the form that opened the reminder popup.
    if (this.reminderContext === 'task') {
      this.dom.taskRemindersList.appendChild(reminderItem);
    } else {
      this.dom.remindersList.appendChild(reminderItem);
    }
    
    this.closePopup('reminder-popup');
    this.showToast('Reminder added', 'success');
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  }

  hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'none';
    }
  }

  showToast(message, type = 'default', showUndo = false, undoCallback = null) {
    if (!this.dom.toast) return;
    
    const toast = this.dom.toast;
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    if (showUndo && undoCallback) {
      const undoButton = document.createElement('button');
      undoButton.textContent = 'Undo';
      undoButton.addEventListener('click', () => {
        undoCallback();
        toast.classList.remove('show');
      });
      toast.appendChild(undoButton);
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
      const button = toast.querySelector('button');
      if (button) button.remove();
    }, 3000);
  }

  openPopup(popupId) {
    document.getElementById(popupId).style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.getElementById(popupId).setAttribute('aria-hidden', 'false');
  }

  closePopup(popupId) {
    const popup = document.getElementById(popupId);
    const focused = popup.querySelector(':focus');
    if (focused) focused.blur();
    
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
    popup.setAttribute('aria-hidden', 'true');
  }

  navigateToDate(date) {
    this.currentDate = date;
    this.render();
  }

  isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  formatTime(timeStr) {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  }

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }

  loadData() {
    const savedData = localStorage.getItem('calendarData');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            this.events = data.events || [];
            this.calendars = data.calendars || [];
            this.selectedCalendarIds = new Set(data.selectedCalendarIds || []);
            
            // Convert string dates back to Date objects with validation
            this.events.forEach(event => {
                try {
                    const parsedDate = new Date(event.date);
                    event.date = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
                } catch (e) {
                    console.warn('Failed to parse event date, using current date:', event);
                    event.date = new Date();
                }
                
                if (event.deadline) {
                    try {
                        const parsedDeadline = new Date(event.deadline);
                        event.deadline = isNaN(parsedDeadline.getTime()) ? null : parsedDeadline;
                    } catch (e) {
                        console.warn('Failed to parse event deadline:', event);
                        event.deadline = null;
                    }
                }
            });
            
            if (data.userPreferences) {
                this.userProductivityHours = data.userPreferences.productivityHours || this.userProductivityHours;
            }
        } catch (e) {
            console.error('Failed to load saved data', e);
            this.loadSampleData();
        }
    } else {
        this.loadSampleData();
    }
  }

  loadSampleData() {
    this.calendars = [
      { id: 1, name: 'Personal', color: '#4285F4' },
      { id: 2, name: 'Work', color: '#EA4335' },
      { id: 3, name: 'Family', color: '#FBBC05' }
    ];
    
    this.calendars.forEach(calendar => {
      this.selectedCalendarIds.add(calendar.id);
    });
    
    this.events = [];
  }

  saveToLocalStorage() {
    const data = {
        events: this.events.map(event => {
            const eventData = { ...event };
            
            if (!(event.date instanceof Date) || isNaN(event.date.getTime())) {
                console.warn('Invalid date found for event, using current date:', event);
                eventData.date = new Date();
            }
            
            eventData.date = eventData.date.toISOString();
            
            if (event.deadline) {
                if (event.deadline instanceof Date && !isNaN(event.deadline.getTime())) {
                    eventData.deadline = event.deadline.toISOString();
                } else {
                    console.warn('Invalid deadline found for event:', event);
                    delete eventData.deadline;
                }
            }
            
            return eventData;
        }),
        calendars: this.calendars,
        selectedCalendarIds: Array.from(this.selectedCalendarIds),
        userPreferences: {
            productivityHours: this.userProductivityHours
        }
    };
    
    localStorage.setItem('calendarData', JSON.stringify(data));
  }
}

class ReminderSystem {
  constructor() {
    this.reminders = [];
    this.checkRemindersInterval = null;
    this.emailService = new EmailService(); // You'll need to implement this
    this.whatsappService = new WhatsAppService(); // You'll need to implement this
  }
  
  start() {
    this.checkRemindersInterval = setInterval(() => {
      this.checkReminders();
    }, 60000);
  }
  
  addReminder(event, minutesBefore, method, contactInfo = null) {
    const reminderTime = new Date(event.date);
    const [hours, minutes] = event.startTime.split(':');
    reminderTime.setHours(hours, minutes - minutesBefore);
    
    const reminder = {
      id: Date.now(),
      eventId: event.id,
      eventTitle: event.title,
      triggerTime: reminderTime,
      method,
      contactInfo,
      fired: false
    };
    
    this.reminders.push(reminder);
    return reminder;
  }
  
  checkReminders() {
    const now = new Date();
    this.reminders.forEach(reminder => {
      if (!reminder.fired && reminder.triggerTime <= now) {
        this.triggerReminder(reminder);
        reminder.fired = true;
      }
    });
    
    this.reminders = this.reminders.filter(r => !r.fired || r.triggerTime > new Date(now.getTime() - 86400000));
  }
  
  triggerReminder(reminder) {
    switch (reminder.method) {
      case 'notification':
        this.showDesktopNotification(reminder);
        break;
      case 'email':
        this.sendEmailReminder(reminder);
        break;
      case 'whatsapp':
        this.sendWhatsAppReminder(reminder);
        break;
    }
  }
  
  showDesktopNotification(reminder) {
    if (Notification.permission === 'granted') {
      new Notification(`Reminder: ${reminder.eventTitle}`, {
        body: `Your event is coming up soon!`,
        icon: '/path/to/icon.png',
        requireInteraction: true
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.showDesktopNotification(reminder);
        }
      });
    }
  }
  
  sendEmailReminder(reminder) {
    console.log(`Email reminder sent to ${reminder.contactInfo} for event: ${reminder.eventTitle}`);
  }
  
  sendWhatsAppReminder(reminder) {
    console.log(`WhatsApp reminder sent to ${reminder.contactInfo} for event: ${reminder.eventTitle}`);
  }
  async triggerReminder(reminder) {
    try {
      switch (reminder.method) {
        case 'notification':
          await this.showDesktopNotification(reminder);
          break;
        case 'email':
          await this.sendEmailReminder(reminder);
          break;
        case 'whatsapp':
          await this.sendWhatsAppReminder(reminder);
          break;
      }
      reminder.fired = true;
    } catch (error) {
      console.error('Failed to trigger reminder:', error);
    }
  }
  
  async showDesktopNotification(reminder) {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return;
    }
    
    if (Notification.permission === 'granted') {
      const notification = new Notification(`Reminder: ${reminder.eventTitle}`, {
        body: `Your event is coming up soon!`,
        icon: '/favicon.ico',
        requireInteraction: true
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await this.showDesktopNotification(reminder);
      }
    }
  }
  
  async sendEmailReminder(reminder) {
    if (!reminder.contactInfo) {
      console.error('No email address provided for reminder');
      return;
    }
    
    try {
      // In a real app, you would call your backend email service here
      const response = await this.emailService.send({
        to: reminder.contactInfo,
        subject: `Reminder: ${reminder.eventTitle}`,
        text: `This is a reminder for your upcoming event: ${reminder.eventTitle}`
      });
      
      console.log('Email reminder sent:', response);
    } catch (error) {
      console.error('Failed to send email reminder:', error);
    }
  }
  
  async sendWhatsAppReminder(reminder) {
    if (!reminder.contactInfo) {
      console.error('No WhatsApp number provided for reminder');
      return;
    }
    
    try {
      // In a real app, you would call your backend WhatsApp service here
      const response = await this.whatsappService.send({
        to: reminder.contactInfo,
        message: `Reminder: ${reminder.eventTitle} is coming up soon!`
      });
      
      console.log('WhatsApp reminder sent:', response);
    } catch (error) {
      console.error('Failed to send WhatsApp reminder:', error);
    }
  }
}

class EmailService {
  async send({ to, subject, text }) {
    console.log(`[Mock Email Service] Sending to ${to}:`, { subject, text });
    return { success: true, message: 'Email sent successfully (mock)' };
  }
}

class WhatsAppService {
  async send({ to, message }) {
    console.log(`[Mock WhatsApp Service] Sending to ${to}:`, message);
    return { success: true, message: 'WhatsApp message sent successfully (mock)' };
  }
}