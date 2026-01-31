// mobile.js - Мобильная навигация
class MobileNavigation {
    constructor() {
        this.currentTab = 'passwords';
        this.init();
    }
    
    init() {
        // Инициализация табов
        this.initTabs();
        
        // Инициализация меню
        this.initMenu();
        
        // Обработка ориентации
        this.handleOrientation();
        
        // Обработка клавиатуры
        this.handleKeyboard();
    }
    
    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                this.switchTab(tabId);
            });
        });
        
        // Назначаем контент табам
        document.getElementById('passwordsList').parentElement.classList.add('tab-content', 'active');
        document.querySelector('.add-password').classList.add('tab-content');
        
        // Переименовываем для мобилок
        if (window.innerWidth <= 768) {
            document.querySelector('.passwords').id = 'passwordsTab';
            document.querySelector('.add-password').id = 'addTab';
        }
    }
    
    switchTab(tabId) {
        this.currentTab = tabId;
        
        // Обновляем активные кнопки
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabId) btn.classList.add('active');
        });
        
        // Показываем активный контент
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(tabId === 'passwords' ? 'passwordsTab' : 'addTab');
        if (activeContent) {
            activeContent.classList.add('active');
        }
        
        // Прокручиваем к началу
        window.scrollTo(0, 0);
    }
    
    initMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const addToggle = document.getElementById('addToggle');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                this.switchTab('passwords');
            });
        }
        
        if (addToggle) {
            addToggle.addEventListener('click', () => {
                this.switchTab('add');
            });
        }
    }
    
    handleOrientation() {
        // Проверяем ориентацию при загрузке и изменении
        this.checkOrientation();
        window.addEventListener('resize', this.checkOrientation.bind(this));
        window.addEventListener('orientationchange', this.checkOrientation.bind(this));
    }
    
    checkOrientation() {
        const warning = document.querySelector('.orientation-warning');
        if (!warning) return;
        
        const isMobile = window.innerWidth <= 768;
        const isPortrait = window.innerHeight > window.innerWidth;
        const isTooShort = window.innerHeight < 500;
        
        if (isMobile && isPortrait && isTooShort) {
            warning.style.display = 'flex';
            document.querySelector('main').style.display = 'none';
        } else {
            warning.style.display = 'none';
            document.querySelector('main').style.display = 'flex';
        }
    }
    
    handleKeyboard() {
        // Скрываем клавиатуру при тапе вне инпутов на мобилках
        if ('ontouchstart' in window) {
            document.addEventListener('touchstart', (e) => {
                if (!e.target.matches('input, textarea, [contenteditable]')) {
                    document.activeElement?.blur();
                }
            });
        }
    }
    
    // Показываем/скрываем лоадер
    showLoader(text = 'Загрузка...') {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('active');
            loader.querySelector('.loader-text').textContent = text;
        }
    }
    
    hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.remove('active');
        }
    }
    
    // Адаптивное скрытие клавиатуры
    adjustForKeyboard() {
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        }
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        window.mobileNav = new MobileNavigation();
    }
});

// Ресайз обработчик
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth <= 768 && !window.mobileNav) {
            window.mobileNav = new MobileNavigation();
        } else if (window.innerWidth > 768 && window.mobileNav) {
            // На десктопе отключаем мобильную навигацию
            window.mobileNav = null;
            document.querySelectorAll('.tab-content').forEach(el => {
                el.classList.remove('tab-content');
                el.style.display = '';
            });
        }
    }, 250);
});