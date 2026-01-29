import React, { createContext, useContext, useState, useEffect } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
    // Default to FALSE on every refresh (No Persistence)
    // This ensures we always get a user interaction (click) before playing audio,
    // fixing "Autoplay Policy" issues where audio would be mute despite being "On".
    const [isSoundOn, setIsSoundOn] = useState(false);

    // Removed localStorage logic to satisfy "Reset on refresh" requirement

    return (
        <SoundContext.Provider value={{ isSoundOn, setIsSoundOn }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within SoundProvider');
    }
    return context;
};
