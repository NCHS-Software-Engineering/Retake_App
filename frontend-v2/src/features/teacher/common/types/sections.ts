export interface Assignment {
    id: number;
    type: 'test' | 'relearning';
    title: string;
    description: string;
}

export interface Section {
    id: number;
    name: string;
    assignments: Assignment[];
}

export interface SectionDTO {
    classId: number;
    className: string;
    sections: Section[];
}


export interface QuestionPayload {
    id: number;
    sequence: number;
    questionText: string;
    answerKey?: string;
}

export interface AssignmentPayload {
    id: number;
    type: string;
    title: string;
    description: string;
    questions: QuestionPayload[];
    createdAt: string;
}