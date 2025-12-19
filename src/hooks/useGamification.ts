
import { useState, useEffect } from 'react';
import { UserStats, XP_WEIGHTS, LEVEL_THRESHOLD } from '../types/gamification';

const STORAGE_KEY = 'learnhub_gamification_stats';

const initialStats: UserStats = {
    xp: 0,
    level: 1,
    streak: 0,
    lastLoginDate: null,
    totalProblemsSolved: 0,
    completedRoadmaps: [],
    badges: [],
    skills: {},
};

export function useGamification() {
    const [stats, setStats] = useState<UserStats>(initialStats);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            setStats(parsed);
            checkStreak(parsed);
        } else {
            // New user login
            updateStreak(initialStats);
        }
    }, []);

    const saveStats = (newStats: UserStats) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
        setStats(newStats);
    };

    const checkStreak = (currentStats: UserStats) => {
        if (!currentStats.lastLoginDate) return;

        const last = new Date(currentStats.lastLoginDate);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 3600 * 24));

        if (diffDays > 1) {
            // Streak broken
            saveStats({ ...currentStats, streak: 0 });
        } else if (diffDays === 1) {
            // Streak continued
            updateStreak(currentStats);
        }
    };

    const updateStreak = (currentStats: UserStats) => {
        const today = new Date().toISOString().split('T')[0];
        if (currentStats.lastLoginDate?.split('T')[0] === today) return;

        const newStats = {
            ...currentStats,
            streak: currentStats.streak + 1,
            lastLoginDate: new Date().toISOString(),
            xp: currentStats.xp + XP_WEIGHTS.LOGIN,
        };
        saveStats(calculateLevel(newStats));
    };

    const calculateLevel = (currentStats: UserStats) => {
        const newLevel = Math.floor(currentStats.xp / LEVEL_THRESHOLD) + 1;
        return { ...currentStats, level: newLevel };
    };

    const addXP = (type: keyof typeof XP_WEIGHTS, amount?: number) => {
        const xpToAdd = amount || XP_WEIGHTS[type];
        const newStats = {
            ...stats,
            xp: stats.xp + xpToAdd,
        };
        saveStats(calculateLevel(newStats));
    };

    const recordProblemSolved = (topic: string) => {
        const newStats = {
            ...stats,
            totalProblemsSolved: stats.totalProblemsSolved + 1,
            skills: {
                ...stats.skills,
                [topic]: Math.min(100, (stats.skills[topic] || 0) + 10)
            }
        };
        setStats(newStats);
        addXP('SOLVE');
    };

    return {
        stats,
        addXP,
        recordProblemSolved,
        updateStreak
    };
}
