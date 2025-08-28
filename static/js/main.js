/**
 * Cisco Configuration Manager - Main JavaScript
 */

// Global variables
let currentDevice = null;
let commandHistory = [];
let isConnected = false;

// Document ready
$(document).ready(function() {
    initializeApp();
    initializeTheme();
});

// Initialize application
function initializeApp() {
    // Initialize tooltips
    initializeTooltips();
    
    // Load command history
    loadCommandHistory();
    
    // Setup auto-refresh for device status
    setupAutoRefresh();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Initialize WebSocket connection (for future real-time updates)
    // initializeWebSocket();
    
    console.log('Cisco Configuration Manager initialized');
}

// Initialize Bootstrap tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Load command history from localStorage
function loadCommandHistory() {
    const stored = localStorage.getItem('ciscoCommandHistory');
    if (stored) {
        try {
            commandHistory = JSON.parse(stored);
        } catch (e) {
            commandHistory = [];
        }
    }
}

// Save command history to localStorage
function saveCommandHistory() {
    try {
        localStorage.setItem('ciscoCommandHistory', JSON.stringify(commandHistory.slice(-50))); // Keep last 50 commands
    } catch (e) {
        console.warn('Could not save command history:', e);
    }
}

// Add command to history
function addToCommandHistory(command) {
    if (!command || command.trim() === '') return;
    
    // Remove duplicate if exists
    const index = commandHistory.indexOf(command);
    if (index > -1) {
        commandHistory.splice(index, 1);
    }
    
    // Add to beginning
    commandHistory.unshift(command);
    
    // Limit to 50 commands
    if (commandHistory.length > 50) {
        commandHistory = commandHistory.slice(0, 50);
    }
    
    saveCommandHistory();
}

// Setup auto-refresh for device status
function setupAutoRefresh() {
    // Refresh device status every 30 seconds if on devices page
    if (window.location.pathname.includes('/devices') || window.location.pathname === '/') {
        setInterval(refreshDeviceStatus, 30000);
    }
}

// Refresh device status
function refreshDeviceStatus() {
    const deviceRows = document.querySelectorAll('[id^="device-"]');
    deviceRows.forEach(row => {
        const deviceId = row.id.replace('device-', '');
        if (deviceId) {
            updateSingleDeviceStatus(deviceId);
        }
    });
}

// Update single device status
function updateSingleDeviceStatus(deviceId) {
    fetch(`/api/devices/${deviceId}/status`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateDeviceStatusUI(deviceId, data.status);
            }
        })
        .catch(error => {
            console.warn('Failed to update device status:', error);
        });
}

// Update device status in UI
function updateDeviceStatusUI(deviceId, status) {
    const row = document.getElementById(`device-${deviceId}`);
    if (!row) return;
    
    const statusCell = row.querySelector('.status-cell');
    if (!statusCell) return;
    
    const isConnected = status.connected;
    const badgeClass = isConnected ? 'bg-success' : 'bg-secondary';
    const icon = isConnected ? 'fa-check-circle' : 'fa-times-circle';
    const text = isConnected ? 'Подключено' : 'Отключено';
    
    statusCell.innerHTML = `
        <span class="badge ${badgeClass}">
            <i class="fas ${icon} me-1"></i>${text}
        </span>
    `;
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + Enter: Execute command
        if (e.ctrlKey && e.key === 'Enter') {
            const commandInput = document.getElementById('customCommand');
            if (commandInput && commandInput === document.activeElement) {
                e.preventDefault();
                const form = commandInput.closest('form');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        }
        
        // Escape: Close modals
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                bootstrap.Modal.getInstance(modal)?.hide();
            });
        }
        
        // Ctrl + /: Show keyboard shortcuts help
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            showKeyboardShortcuts();
        }
    });
}

// Show keyboard shortcuts help
function showKeyboardShortcuts() {
    const shortcuts = [
        { key: 'Ctrl + Enter', description: 'Выполнить команду' },
        { key: 'Escape', description: 'Закрыть модальные окна' },
        { key: 'Ctrl + Shift + T', description: 'Переключить тему' },
        { key: 'Ctrl + /', description: 'Показать горячие клавиши' }
    ];
    
    let content = '<h6>Горячие клавиши:</h6><ul>';
    shortcuts.forEach(shortcut => {
        content += `<li><kbd>${shortcut.key}</kbd> - ${shortcut.description}</li>`;
    });
    content += '</ul>';
    
    showModal('Горячие клавиши', content);
}

// Generic modal function
function showModal(title, content, buttons = null) {
    const modalId = 'dynamicModal';
    let existingModal = document.getElementById(modalId);
    
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        ${buttons || '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
    
    // Remove modal from DOM when hidden
    document.getElementById(modalId).addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Никогда';
    
    try {
        const date = new Date(timestamp);
        return date.toLocaleString('ru-RU');
    } catch (e) {
        return timestamp;
    }
}

// Format uptime
function formatUptime(uptime) {
    if (!uptime) return 'Неизвестно';
    
    // Parse uptime from Cisco format
    const matches = uptime.match(/(\d+)\s+years?,?\s*(\d+)\s+weeks?,?\s*(\d+)\s+days?,?\s*(\d+)\s+hours?,?\s*(\d+)\s+minutes?/);
    if (matches) {
        const [, years, weeks, days, hours, minutes] = matches;
        let result = [];
        
        if (parseInt(years) > 0) result.push(`${years} лет`);
        if (parseInt(weeks) > 0) result.push(`${weeks} недель`);
        if (parseInt(days) > 0) result.push(`${days} дней`);
        if (parseInt(hours) > 0) result.push(`${hours} часов`);
        if (parseInt(minutes) > 0) result.push(`${minutes} минут`);
        
        return result.join(', ');
    }
    
    return uptime;
}

// Validate IP address
function validateIP(ip) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

// Show loading state
function showLoading(element, text = 'Загрузка...') {
    const originalContent = element.innerHTML;
    element.dataset.originalContent = originalContent;
    element.innerHTML = `
        <span class="loading-spinner"></span>
        ${text}
    `;
    element.disabled = true;
}

// Hide loading state
function hideLoading(element) {
    if (element.dataset.originalContent) {
        element.innerHTML = element.dataset.originalContent;
        delete element.dataset.originalContent;
    }
    element.disabled = false;
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Скопировано в буфер обмена', 'success');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback copy to clipboard for older browsers
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Скопировано в буфер обмена', 'success');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showToast('Не удалось скопировать', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = getOrCreateToastContainer();
    const toastId = 'toast-' + Date.now();
    
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: duration
    });
    
    toast.show();
    
    // Remove from DOM after hiding
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

// Get or create toast container
function getOrCreateToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1100';
        document.body.appendChild(container);
    }
    return container;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Local storage utilities
const storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
            return false;
        }
    },
    
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Could not read from localStorage:', e);
            return defaultValue;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('Could not remove from localStorage:', e);
            return false;
        }
    }
};

// Device type icons mapping
const deviceTypeIcons = {
    'cisco_ios': 'fas fa-server',
    'cisco_ios_xe': 'fas fa-server',
    'cisco_nxos': 'fas fa-network-wired',
    'cisco_asa': 'fas fa-shield-alt'
};

// Get device type icon
function getDeviceTypeIcon(deviceType) {
    return deviceTypeIcons[deviceType] || 'fas fa-server';
}

// Command suggestions for autocomplete
const commonCommands = [
    'show version',
    'show running-config',
    'show startup-config',
    'show ip interface brief',
    'show interface status',
    'show vlan brief',
    'show mac address-table',
    'show spanning-tree',
    'show ip route',
    'show arp',
    'show clock',
    'show users',
    'show processes',
    'show memory',
    'show inventory',
    'show cdp neighbors',
    'show lldp neighbors',
    'configure terminal',
    'write memory',
    'copy running-config startup-config'
];

// Initialize command autocomplete
function initializeCommandAutocomplete(inputElement) {
    if (!inputElement) return;
    
    let currentSuggestions = [];
    let currentIndex = -1;
    
    inputElement.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length < 2) {
            hideSuggestions();
            return;
        }
        
        currentSuggestions = commonCommands.filter(cmd => 
            cmd.toLowerCase().includes(value)
        ).slice(0, 10);
        
        if (currentSuggestions.length > 0) {
            showSuggestions(currentSuggestions, this);
        } else {
            hideSuggestions();
        }
    });
    
    inputElement.addEventListener('keydown', function(e) {
        const suggestionsContainer = document.getElementById('command-suggestions');
        if (!suggestionsContainer || !suggestionsContainer.style.display !== 'none') return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = Math.min(currentIndex + 1, currentSuggestions.length - 1);
                updateSuggestionSelection();
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = Math.max(currentIndex - 1, -1);
                updateSuggestionSelection();
                break;
            case 'Tab':
            case 'Enter':
                if (currentIndex >= 0) {
                    e.preventDefault();
                    this.value = currentSuggestions[currentIndex];
                    hideSuggestions();
                }
                break;
            case 'Escape':
                hideSuggestions();
                break;
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!inputElement.contains(e.target)) {
            hideSuggestions();
        }
    });
}

// Show command suggestions
function showSuggestions(suggestions, inputElement) {
    hideSuggestions();
    
    const container = document.createElement('div');
    container.id = 'command-suggestions';
    container.className = 'command-suggestions';
    container.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-top: none;
        border-radius: 0 0 6px 6px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    
    suggestions.forEach((suggestion, index) => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = suggestion;
        item.style.cssText = `
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
        `;
        
        item.addEventListener('click', function() {
            inputElement.value = suggestion;
            hideSuggestions();
        });
        
        item.addEventListener('mouseenter', function() {
            currentIndex = index;
            updateSuggestionSelection();
        });
        
        container.appendChild(item);
    });
    
    // Position relative to input
    const inputRect = inputElement.getBoundingClientRect();
    const inputContainer = inputElement.parentElement;
    if (inputContainer.style.position !== 'relative') {
        inputContainer.style.position = 'relative';
    }
    
    inputContainer.appendChild(container);
}

// Update suggestion selection
function updateSuggestionSelection() {
    const items = document.querySelectorAll('.suggestion-item');
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.style.backgroundColor = '#f8f9fa';
        } else {
            item.style.backgroundColor = 'white';
        }
    });
}

// Hide command suggestions
function hideSuggestions() {
    const container = document.getElementById('command-suggestions');
    if (container) {
        container.remove();
    }
    currentIndex = -1;
}

// Export functions for global use
window.CiscoConfigManager = {
    showToast,
    showModal,
    copyToClipboard,
    formatTimestamp,
    formatUptime,
    validateIP,
    showLoading,
    hideLoading,
    storage,
    getDeviceTypeIcon,
    initializeCommandAutocomplete,
    addToCommandHistory,
    debounce,
    throttle,
    setTheme,
    toggleTheme,
    getCurrentTheme: () => currentTheme
};

// Theme Management
let currentTheme = 'auto';

function initializeTheme() {
    // Load saved theme preference
    const savedTheme = storage.get('theme', 'auto');
    setTheme(savedTheme);
    updateThemeIcon();
}

function setTheme(theme) {
    currentTheme = theme;
    storage.set('theme', theme);
    
    const html = document.documentElement;
    
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
        html.setAttribute('data-theme', 'light');
    } else {
        // Auto mode - remove attribute to use CSS media query
        html.removeAttribute('data-theme');
    }
    
    updateThemeIcon();
    
    // Show theme change notification
    const themeNames = {
        'light': 'Светлая тема',
        'dark': 'Темная тема',
        'auto': 'Автоматическая тема'
    };
    
    showToast(`Переключено на: ${themeNames[theme]}`, 'info', 2000);
}

function toggleTheme() {
    // Cycle through themes: auto -> light -> dark -> auto
    const themes = ['auto', 'light', 'dark'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (!themeIcon) return;
    
    // Update icon based on current theme and system preference
    let iconClass = 'fas fa-magic'; // Default for auto
    
    if (currentTheme === 'light') {
        iconClass = 'fas fa-sun';
    } else if (currentTheme === 'dark') {
        iconClass = 'fas fa-moon';
    } else {
        // Auto mode - show based on current effective theme
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        iconClass = isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    themeIcon.className = `${iconClass} theme-icon`;
}

// Listen for system theme changes in auto mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (currentTheme === 'auto') {
        updateThemeIcon();
    }
});

// Add keyboard shortcut for theme toggle
document.addEventListener('keydown', function(e) {
    // Ctrl + Shift + T: Toggle theme
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggleTheme();
    }
});

console.log('Cisco Configuration Manager JavaScript loaded');
