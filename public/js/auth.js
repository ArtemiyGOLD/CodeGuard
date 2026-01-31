// Проверка, первый ли вход
function isFirstTime() {
    return !localStorage.getItem('masterPasswordHash');
}

// Установка мастер-пароля
function setupMasterPassword(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = generateKeyFromPassword(password, salt);
    
    localStorage.setItem('masterPasswordHash', arrayToHex(hash));
    localStorage.setItem('salt', arrayToHex(salt));
    
    return true;
}

// Проверка мастер-пароля
function checkMasterPassword(password) {
    const storedHash = localStorage.getItem('masterPasswordHash');
    const salt = localStorage.getItem('salt');
    
    if (!storedHash || !salt) return false;
    
    const hash = generateKeyFromPassword(password, hexToArray(salt));
    return arrayToHex(hash) === storedHash;
}

// Генерация ключа из пароля
function generateKeyFromPassword(password, salt) {
    // Используем PBKDF2 или другой KDF
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    // Здесь будет Web Crypto API для генерации ключа
    // Пока заглушка
    return crypto.getRandomValues(new Uint8Array(32));
}