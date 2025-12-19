
import fs from 'fs';
import path from 'path';
import { CompanyQuestion } from '../types/evaluator';

const questionsDir = path.join(process.cwd(), 'content/evaluator/questions/companies');

export function getCompanyQuestions(companyId: string): CompanyQuestion[] {
    const filePath = path.join(questionsDir, `${companyId}.json`);
    if (!fs.existsSync(filePath)) return [];

    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        console.error(`Error loading questions for company ${companyId}:`, e);
        return [];
    }
}
