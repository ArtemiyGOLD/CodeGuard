// Генератор паролей
function generatePassword(length = 16, options = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
}) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let charset = '';
    if (options.lowercase) charset += lowercase;
    if (options.uppercase) charset += uppercase;
    if (options.numbers) charset += numbers;
    if (options.symbols) charset += symbols;
    
    if (!charset) return '';
    
    let password = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }
    
    return password;
}

// Копирование в буфер обмена
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
    }
}

// Проверка силы пароля
function checkPasswordStrength(password) {
    let score = 0;
    
    // Длина
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Сложность
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Проверка на простые последовательности
    const simplePatterns = [
        '123456', 'password', 'qwerty', 'abcdef', 
        '111111', '000000', 'admin', 'welcome'
    ];
    
    if (!simplePatterns.some(pattern => 
        password.toLowerCase().includes(pattern))) {
        score += 1;
    }
    
    // Оценка
    if (score >= 8) return { score: 5, text: 'Очень сильный', color: '#00BFA5' };
    if (score >= 6) return { score: 4, text: 'Сильный', color: '#4CAF50' };
    if (score >= 4) return { score: 3, text: 'Средний', color: '#FF9800' };
    if (score >= 2) return { score: 2, text: 'Слабый', color: '#FF5722' };
    return { score: 1, text: 'Очень слабый', color: '#F44336' };
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// HEX <-> Array конвертеры
function arrayToHex(buffer) {
    return Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexToArray(hex) {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
}