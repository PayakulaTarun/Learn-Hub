
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface CompanyQuestion {
    id: string;
    title: string;
    type: 'Coding' | 'DSA' | 'Core CS' | 'Aptitude';
    category: string; // e.g., 'Dynamic Programming', 'OS Memory Management'
    difficulty: Difficulty;
    description: string;
    constraints?: string[];
    inputFormat?: string;
    outputFormat?: string;
    initialCode?: string;
    language?: string;
    expectedOutput?: string;
    solutionSlug?: string; // Link to tutorial
    visualizerType?: string;
}

export interface CompanyBattleground {
    id: string;
    name: string;
    logo?: string;
    hiringPattern: {
        pattern: string;
        questionTypes: string[];
        difficultyDistribution: Record<Difficulty, string>;
        hotTopics: string[];
    };
    questions: CompanyQuestion[];
}

export interface MockExam {
    id: string;
    title: string;
    description: string;
    durationMinutes: number;
    negativeMarking?: number; // e.g. -0.33
    companyId?: string; // If specific to a company
    sections: {
        id: string;
        title: string;
        questionCount: number;
        marksPerQuestion: number;
        constraints?: string;
    }[];
    questions: {
        id: string;
        text: string;
        options?: string[];
        correctAnswer: string;
        explanation: string;
        type: 'MCQ' | 'Numerical' | 'MSQ';
        subject: string;
        marks: number;
    }[];
    predictedWeightage?: Record<string, number>; // Topic to %
}

export interface CodeReviewResult {
    score: number; // 0-100
    cleanCodeScore: number;
    readabilityScore: number;
    complexityAnalysis: {
        time: string;
        space: string;
    };
    findings: {
        line?: number;
        type: 'optimization' | 'style' | 'error' | 'security';
        message: string;
        suggestion: string;
    }[];
}

export interface UserAssessmentStats {
    accuracy: number;
    speed: number;
    topicStrengths: string[];
    topicWeaknesses: string[];
    totalAttempted: number;
    percentileEstimation?: number;
}
