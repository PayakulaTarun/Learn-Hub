
import { RoadmapTopic, CareerRoadmap } from './roadmaps';

export interface PlanTask {
    day: number;
    topics: RoadmapTopic[];
    type: 'theory' | 'practice' | 'revision';
}

export interface StudyPlan {
    totalDays: number;
    dailyTasks: PlanTask[];
    weeklyMilestones: string[];
}

export function generatePlan(
    roadmap: CareerRoadmap,
    totalWeeks: number,
    dailyHours: number
): StudyPlan {
    const allTopics = roadmap.stages.flatMap(s => s.topics);
    const totalDays = totalWeeks * 7;
    const availableHours = totalDays * dailyHours;

    // Basic allocation logic
    let dailyTasks: PlanTask[] = [];
    let currentDay = 1;
    let accumulatedHours = 0;
    let currentDayTopics: RoadmapTopic[] = [];

    allTopics.forEach((topic, index) => {
        currentDayTopics.push(topic);
        accumulatedHours += topic.estimatedHours;

        if (accumulatedHours >= dailyHours || index === allTopics.length - 1) {
            dailyTasks.push({
                day: currentDay,
                topics: [...currentDayTopics],
                type: 'theory'
            });

            // Add a practice day if many topics accumulated
            if (currentDayTopics.some(t => t.practiceId) && dailyTasks.length % 3 === 0) {
                currentDay++;
                dailyTasks.push({
                    day: currentDay,
                    topics: [...currentDayTopics], // Review and practice
                    type: 'practice'
                });
            }

            currentDay++;
            accumulatedHours = 0;
            currentDayTopics = [];
        }
    });

    // Ensure it fits within totalDays (simple truncation for now, real AI would distribute better)
    dailyTasks = dailyTasks.filter(t => t.day <= totalDays);

    return {
        totalDays,
        dailyTasks,
        weeklyMilestones: roadmap.stages.map(s => s.title)
    };
}
