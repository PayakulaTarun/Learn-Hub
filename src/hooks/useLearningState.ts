
import { useState, useEffect } from 'react';

export function useLearningState() {
    const [completed, setCompleted] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('learnhub_progress');
        if (saved) setCompleted(JSON.parse(saved));
    }, []);

    const toggleComplete = (id: string) => {
        const newCompleted = completed.includes(id)
            ? completed.filter(i => i !== id)
            : [...completed, id];
        setCompleted(newCompleted);
        localStorage.setItem('learnhub_progress', JSON.stringify(newCompleted));
    };

    const isCompleted = (id: string) => completed.includes(id);

    return { completed, toggleComplete, isCompleted };
}
