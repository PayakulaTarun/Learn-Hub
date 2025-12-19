
export interface UserStats {
    xp: number;
    level: number;
    streak: number;
    lastLoginDate: string | null;
    totalProblemsSolved: number;
    completedRoadmaps: string[];
    badges: Badge[];
    skills: Record<string, number>; // Topic to skill level 0-100
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlockedAt: string;
}

export interface GamificationAction {
    type: 'READ' | 'PRACTICE' | 'SOLVE' | 'MOCK' | 'LOGIN';
    payload?: string;
}

export const XP_WEIGHTS = {
    LOGIN: 10,
    READ: 20,
    PRACTICE: 50,
    SOLVE: 100,
    MOCK: 500,
};

export const LEVEL_THRESHOLD = 1000; // XP per level
