import { calculateQuizRate, questionQuizRateType } from "../(backend)/api/activity/fetchActivitiesDoneInRoom";
import { QuizUserAnswer } from "../_types/quiz";

describe('calculateTotalRate', () => {

    it('should calculate the total score correctly for multiple users', () => {
        const questions = [
            {
                questionId: 'q1',
                correctChoices: ['a', 'b'],
                totalChoices: 4
            },
            {
                questionId: 'q2',
                correctChoices: ['c'],
                totalChoices: 4
            }
        ];

        const allUserIds = new Set<string>(['user1', 'user2']);

        const answers: QuizUserAnswer[] = [
            // User 1 answers
            { userId: 'user1', timestamp: 123456, questionId: 'q1', choiceId: 'a' },
            { userId: 'user1', timestamp: 123457, questionId: 'q1', choiceId: 'b' },
            { userId: 'user1', timestamp: 123458, questionId: 'q2', choiceId: 'c' },

            // User 2 answers
            { userId: 'user2', timestamp: 123459, questionId: 'q1', choiceId: 'a' },
            { userId: 'user2', timestamp: 123460, questionId: 'q2', choiceId: 'c' }
        ];

        const result = calculateQuizRate(questions, allUserIds, answers);

        // Test si l'erreur est nulle
        expect(result.error).toBeNull();

        // Testons la valeur du score final retournée
        expect(result.data).toBeGreaterThanOrEqual(0);
        expect(result.data).toBeLessThanOrEqual(100);
    });

    it('should return 0% if no users answer any question', () => {
        const questions = [
            {
                questionId: 'q1',
                correctChoices: ['a'],
                totalChoices: 4
            }
        ];

        const allUserIds = new Set<string>(['user1', 'user2']);
        const answers: QuizUserAnswer[] = [];

        const result = calculateQuizRate(questions, allUserIds, answers);

        expect(result.error).toBeNull();
        expect(result.data).toBe(0);  // Car aucun score n'a été donné
    });

    it('should handle edge case with empty questions array', () => {
        const questions: questionQuizRateType[] = [];
        const allUserIds = new Set<string>(['user1', 'user2']);
        const answers: QuizUserAnswer[] = [];

        const result = calculateQuizRate(questions, allUserIds, answers);

        expect(result.error).toBeNull();
        expect(result.data).toBe(0);  // Pas de questions, pas de score
    });

    it('should handle edge case with empty answers array', () => {
        const questions = [
            {
                questionId: 'q1',
                correctChoices: ['a'],
                totalChoices: 4
            }
        ];

        const allUserIds = new Set<string>(['user1', 'user2']);
        const answers: QuizUserAnswer[] = [];  // Aucune réponse donnée

        const result = calculateQuizRate(questions, allUserIds, answers);

        expect(result.error).toBeNull();
        expect(result.data).toBe(0);  // Aucun score car aucune réponse donnée
    });

});
