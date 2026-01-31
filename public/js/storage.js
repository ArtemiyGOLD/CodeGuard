// storage.js - Работа с localStorage
class PasswordStorage {
    constructor() {
        this.STORAGE_KEY = 'codeguard_passwords';
        this.MASTER_KEY = 'codeguard_master';
    }
    
    // Проверяем, установлен ли мастер-пароль
    isMasterPasswordSet() {
        return localStorage.getItem(this.MASTER_KEY) !== null;
    }
    
    // Устанавливаем мастер-пароль
    setMasterPassword(password) {
        try {
            // Простое хэширование (в реальном проекте используй Web Crypto API)
            const hash = this.simpleHash(password);
            localStorage.setItem(this.MASTER_KEY, hash);
            return true;
        } catch (error) {
            console.error('Ошибка установки мастер-пароля:', error);
            return false;
        }
    }
    
    // Проверяем мастер-пароль
    verifyMasterPassword(password) {
        const storedHash = localStorage.getItem(this.MASTER_KEY);
        if (!storedHash) return false;
        
        const hash = this.simpleHash(password);
        return hash === storedHash;
    }
    
    // Сохраняем пароли
    savePasswords(passwords) {
        try {
            const encrypted = this.encryptData(JSON.stringify(passwords));
            localStorage.setItem(this.STORAGE_KEY, encrypted);
            return true;
        } catch (error) {
            console.error('Ошибка сохранения паролей:', error);
            return false;
        }
    }
    
    // Получаем пароли
    getPasswords() {
        try {
            const encrypted = localStorage.getItem(this.STORAGE_KEY);
            if (!encrypted) return [];
            
            const decrypted = this.decryptData(encrypted);
            return JSON.parse(decrypted) || [];
        } catch (error) {
            console.error('Ошибка получения паролей:', error);
            return [];
        }
    }
    
    // Добавляем новый пароль
    addPassword(passwordData) {
        const passwords = this.getPasswords();
        const newPassword = {
            id: Date.now().toString(),
            ...passwordData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        passwords.push(newPassword);
        this.savePasswords(passwords);
        return newPassword;
    }
    
    // Удаляем пароль
    deletePassword(id) {
        const passwords = this.getPasswords();
        const filtered = passwords.filter(p => p.id !== id);
        this.savePasswords(filtered);
        return true;
    }
    
    // Обновляем пароль
    updatePassword(id, updates) {
        const passwords = this.getPasswords();
        const index = passwords.findIndex(p => p.id === id);
        
        if (index === -1) return null;
        
        passwords[index] = {
            ...passwords[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        this.savePasswords(passwords);
        return passwords[index];
    }
    
    // Поиск паролей
    searchPasswords(query) {
        const passwords = this.getPasswords();
        if (!query) return passwords;
        
        const lowerQuery = query.toLowerCase();
        return passwords.filter(p => 
            p.website.toLowerCase().includes(lowerQuery) ||
            p.username.toLowerCase().includes(lowerQuery) ||
            (p.notes && p.notes.toLowerCase().includes(lowerQuery))
        );
    }
    
    // Простое шифрование (для демо)
    encryptData(data) {
        // В реальном проекте используй Web Crypto API
        return btoa(unescape(encodeURIComponent(data)));
    }
    
    // Простое дешифрование (для демо)
    decryptData(encrypted) {
        // В реальном проекте используй Web Crypto API
        return decodeURIComponent(escape(atob(encrypted)));
    }
    
    // Простая хэш-функция (для демо)
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }
}

// Создаем глобальный экземпляр
const passwordStorage = new PasswordStorage();