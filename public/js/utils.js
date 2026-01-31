// utils.js - Вспомогательные функции

// Генератор безопасного пароля
function generateSecurePassword(length = 16) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = uppercase + lowercase + numbers + symbols;
    
    let password = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    // Гарантируем хотя бы по одному символу из каждой категории
    password += uppercase[array[0] % uppercase.length];
    password += lowercase[array[1] % lowercase.length];
    password += numbers[array[2] % numbers.length];
    password += symbols[array[3] % symbols.length];
    
    // Остальные символы
    for (let i = 4; i < length; i++) {
        password += allChars[array[i] % allChars.length];
    }
    
    // Перемешиваем пароль
    return password.split('').sort(() => Math.random() - 0.5).join('');
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
    
    // Проверка на простые пароли
    const commonPasswords = ['123456', 'password', 'qwerty', '111111', '000000'];
    if (!commonPasswords.some(p => password.toLowerCase().includes(p))) {
        score += 1;
    }
    
    // Оценка
    if (score >= 8) return { score: 5, text: 'Очень сильный', color: '#00BFA5' };
    if (score >= 6) return { score: 4, text: 'Сильный', color: '#4CAF50' };
    if (score >= 4) return { score: 3, text: 'Средний', color: '#FF9800' };
    if (score >= 2) return { score: 2, text: 'Слабый', color: '#FF5722' };
    return { score: 1, text: 'Очень слабый', color: '#F44336' };
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