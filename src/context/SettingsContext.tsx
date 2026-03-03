import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface StoreSettings {
  whatsappNumber: string;
  storeName: string;
  storeAddress: string;
  storeHours: string;
}

interface SettingsContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  getWhatsAppLink: (message?: string) => string;
}

const defaultSettings: StoreSettings = {
  whatsappNumber: '081234567890',
  storeName: 'ULFAMART',
  storeAddress: 'Jl. Mawar No.12, RT.03/RW.05',
  storeHours: '07.00–20.00 WIB'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('ulfamart-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage on change
  useEffect(() => {
    localStorage.setItem('ulfamart-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const getWhatsAppLink = useCallback((message?: string) => {
    const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const baseUrl = `https://wa.me/62${phone.startsWith('0') ? phone.slice(1) : phone}`;
    if (message) {
      return `${baseUrl}?text=${encodeURIComponent(message)}`;
    }
    return baseUrl;
  }, [settings.whatsappNumber]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        getWhatsAppLink
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
