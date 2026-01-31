// main.js - Основная логика приложения
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем мастер-пароль
    if (!passwordStorage.isMasterPasswordSet()) {
        window.location.href = './setup.html';
        return;
    }
    
    // Инициализация
    initApp();
});

function initApp() {
    // Загружаем пароли
    loadPasswords();
    
    // Обработчики событий
    setupEventListeners();
    
    // Обновляем интерфейс
    updatePasswordCount();
}

// Загружаем пароли
function loadPasswords() {
    const passwords = passwordStorage.getPasswords();
    renderPasswords(passwords);
}

// Рендерим список паролей
function renderPasswords(passwords) {
    const container = document.getElementById('passwordsList');
    
    if (passwords.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-lock-open"></i>
                <p>У вас пока нет сохраненных паролей</p>
                <small>Добавьте первый пароль с помощью формы справа</small>
            </div>
        `;
        return;
    }
    
    let html = '';
    passwords.forEach(password => {
        html += `
            <div class="password-item" data-id="${password.id}">
                <div class="password-icon">
                    <i class="fas fa-user-shield"></i>
                </div>
                <div class="password-info">
                    <h3>${escapeHtml(password.website)}</h3>
                    <p>${escapeHtml(password.username)}</p>
                    <small>${formatDate(password.createdAt)}</small>
                </div>
                <div class="password-actions">
                    <button class="password-copy" onclick="copyPassword('${escapeHtml(password.password)}')" title="Копировать пароль">
                        <i class="far fa-copy"></i>
                    </button>
                    <button class="password-delete" onclick="deletePassword('${password.id}')" title="Удалить">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Обработчики событий
function setupEventListeners() {
    // Форма добавления пароля
    const form = document.getElementById('passwordForm');
    form.addEventListener('submit', handleFormSubmit);
    
    // Поиск
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // Показать/скрыть пароль
    const showPasswordBtn = document.getElementById('showPasswordBtn');
    showPasswordBtn.addEventListener('click', togglePasswordVisibility);
    
    // Генератор пароля
    const generatePasswordBtn = document.getElementById('generatePasswordBtn');
    generatePasswordBtn.addEventListener('click', generatePassword);
    
    // Очистить форму
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', clearForm);
    
    // Проверка силы пароля
    const passwordInput = document.getElementById('passwordInput');
    passwordInput.addEventListener('input', updatePasswordStrength);
}

// Обработка формы
function handleFormSubmit(e) {
    e.preventDefault();
    
    const website = document.getElementById('site').value.trim();
    const username = document.getElementById('login').value.trim();
    const password = document.getElementById('passwordInput').value;
    const notes = document.getElementById('notes').value.trim();
    
    if (!website || !username || !password) {
        alert('Заполните обязательные поля: сайт, логин и пароль');
        return;
    }
    
    const passwordData = {
        website,
        username,
        password,
        notes
    };
    
    // Сохраняем пароль
    const savedPassword = passwordStorage.addPassword(passwordData);
    
    if (savedPassword) {
        alert('Пароль успешно сохранен!');
        clearForm();
        loadPasswords();
        updatePasswordCount();
    } else {
        alert('Ошибка при сохранении пароля');
    }
}

// Поиск паролей
function handleSearch(e) {
    const query = e.target.value;
    const results = passwordStorage.searchPasswords(query);
    renderPasswords(results);
}

// Показать/скрыть пароль
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordInput');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Генератор пароля
function generatePassword() {
    const password = generateSecurePassword();
    document.getElementById('passwordInput').value = password;
    updatePasswordStrength();
}

// Очистить форму
function clearForm() {
    document.getElementById('passwordForm').reset();
    updatePasswordStrength();
}

// Проверка силы пароля
function updatePasswordStrength() {
    const password = document.getElementById('passwordInput').value;
    const strength = checkPasswordStrength(password);
    
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    strengthBar.style.width = (strength.score * 20) + '%';
    strengthBar.style.backgroundColor = strength.color;
    strengthText.textContent = strength.text;
    strengthText.style.color = strength.color;
}

// Копировать пароль
function copyPassword(password) {
    if (copyToClipboard(password)) {
        showNotification('Пароль скопирован в буфер обмена!');
    }
}

// Удалить пароль
function deletePassword(id) {
    if (confirm('Вы уверены, что хотите удалить этот пароль?')) {
        passwordStorage.deletePassword(id);
        loadPasswords();
        updatePasswordCount();
        showNotification('Пароль удален');
    }
}

// Обновить счетчик паролей
function updatePasswordCount() {
    const passwords = passwordStorage.getPasswords();
    const count = passwords.length;
    
    // Можно добавить отображение количества где-нибудь в интерфейсе
    console.log(`Всего паролей: ${count}`);
}

// Утилиты
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function showNotification(message) {
    // Простой alert, можно заменить на красивый toast
    alert(message);
}

// Делаем функции глобальными для onclick атрибутов
window.copyPassword = copyPassword;
window.deletePassword = deletePassword;