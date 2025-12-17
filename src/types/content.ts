export interface TutorialExample {
    code: string;
    output: string;
    explanation: string;
}

export interface CommonMistake {
    mistake: string;
    correction: string;
    example: string;
}

export interface InterviewQuestion {
    question: string;
    difficulty: "Easy" | "Medium" | "Hard";
    answer: string;
}

export interface PracticeProblem {
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    problem: string;
    hint: string;
    solution: string;
}

export interface RealWorldUseCase {
    scenario: string;
    description: string;
    code: string;
}

export interface Tutorial {
    title: string;
    slug: string;
    subject: string;
    category: string;
    level: string;
    estimated_read_time: string;
    prerequisites: string[];
    learning_objectives: string[];
    theory: string;
    syntax?: string;
    examples: TutorialExample[];
    common_mistakes: CommonMistake[];
    interview_questions: InterviewQuestion[];
    practice_problems: PracticeProblem[];
    real_world_use_cases: RealWorldUseCase[];
    exam_notes: string[];
    summary: string;
    description?: string; // Fallback for backward compatibility
}

export interface TutorialMetadata {
    slug: string;
    title: string;
    category: string;
    subject: string;
    description: string;
}
