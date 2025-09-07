import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // 获取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // 由于artifacts环境限制，这里使用内存存储模拟
      if (typeof window !== 'undefined') {
        // 在实际部署时，这里应该使用 localStorage
        // const item = window.localStorage.getItem(key);
        // return item ? JSON.parse(item) : initialValue;
        
        // 模拟存储，使用内存对象
        if (!window._mockStorage) {
          window._mockStorage = {};
        }
        const item = window._mockStorage[key];
        return item !== undefined ? item : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 设置值的函数
  const setValue = (value) => {
    try {
      // 允许value是一个函数，用于函数式更新
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        // 在实际部署时，这里应该使用 localStorage
        // window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // 模拟存储
        if (!window._mockStorage) {
          window._mockStorage = {};
        }
        window._mockStorage[key] = valueToStore;
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 移除值的函数
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        // 在实际部署时，这里应该使用 localStorage
        // window.localStorage.removeItem(key);
        
        // 模拟存储
        if (window._mockStorage) {
          delete window._mockStorage[key];
        }
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};