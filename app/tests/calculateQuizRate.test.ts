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

    it('should return 100%', () => {
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
            { userId: 'user1', timestamp: 123457, questionId: 'q1', choiceId: 'b' },
            { userId: 'user2', timestamp: 123460, questionId: 'q2', choiceId: 'c' }
        ];

        const result = calculateQuizRate(questions, allUserIds, answers);

        // Test si l'erreur est nulle
        expect(result.error).toBeNull();

        // Testons la valeur du score final retournée
        expect(result.data).toBe(100);
    });

    it('should return 50%', () => {
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
            { userId: 'user2', timestamp: 123459, questionId: 'q1', choiceId: 'c' },
            { userId: 'user2', timestamp: 123460, questionId: 'q2', choiceId: 'a' }
        ];

        const result = calculateQuizRate(questions, allUserIds, answers);

        // Test si l'erreur est nulle
        expect(result.error).toBeNull();

        // Testons la valeur du score final retournée
        expect(result.data).toBe(50);
    });


    it('should return 0%', () => {
        const questions = [
            {
                questionId: 'q1',
                correctChoices: ['a'],
                totalChoices: 4
            }
        ];
        const questionsA = [
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

        const answers: QuizUserAnswer[] = [];
        const answersA: QuizUserAnswer[] = [
            // User 1 answers
            { userId: 'user1', timestamp: 123456, questionId: 'q1', choiceId: 'c' },
            { userId: 'user1', timestamp: 123458, questionId: 'q2', choiceId: 'a' },

            // User 2 answers
            { userId: 'user2', timestamp: 123459, questionId: 'q1', choiceId: 'c' },
            { userId: 'user2', timestamp: 123460, questionId: 'q2', choiceId: 'a' }
        ];

        const result = calculateQuizRate(questions, allUserIds, answers);
        const resultA = calculateQuizRate(questionsA, allUserIds, answersA);
        expect(result.error).toBeNull();
        expect(result.data).toBe(0);  // Car aucun score n'a été donné

        expect(resultA.error).toBeNull();
        expect(resultA.data).toBe(0);  // 0% de bonnes réponses
    });

    // it('should return between 0% ans 50%', () => {
    //     const questions = [
    //         {
    //             questionId: 'q1',
    //             correctChoices: ['a'],
    //             totalChoices: 4
    //         }
    //     ];
    //     const questionsA = [
    //         {
    //             questionId: 'q1',
    //             correctChoices: ['a', 'b'],
    //             totalChoices: 4
    //         },
    //         {
    //             questionId: 'q2',
    //             correctChoices: ['c'],
    //             totalChoices: 4
    //         }
    //     ];

    //     const allUserIds = new Set<string>(['user1', 'user2']);

    //     const answers: QuizUserAnswer[] = [
    //         // User 1 answers
    //         { userId: 'user1', timestamp: 123456, questionId: 'q1', choiceId: 'b' },

    //         // User 2 answers
    //         { userId: 'user2', timestamp: 123459, questionId: 'q1', choiceId: 'c' },
    //         { userId: 'user2', timestamp: 123460, questionId: 'q1', choiceId: 'a' }
    //     ];
    //     const answersA: QuizUserAnswer[] = [
    //         // User 1 answers
    //         { userId: 'user1', timestamp: 123456, questionId: 'q1', choiceId: 'a' },
    //         { userId: 'user1', timestamp: 123458, questionId: 'q2', choiceId: 'a' },

    //         // User 2 answers
    //         { userId: 'user2', timestamp: 123459, questionId: 'q1', choiceId: 'c' },
    //         { userId: 'user2', timestamp: 123460, questionId: 'q2', choiceId: 'a' }
    //     ];

    //     const result = calculateQuizRate(questions, allUserIds, answers);
    //     const resultA = calculateQuizRate(questionsA, allUserIds, answersA);
    //     expect(result.error).toBeNull();
    //     expect(result.data).toBeGreaterThanOrEqual(0);
    //     expect(result.data).toBeLessThanOrEqual(50);

    //     expect(resultA.error).toBeNull();
    //     expect(resultA.data).toBeGreaterThan(0);
    //     expect(resultA.data).toBeLessThan(50);
    // });

    it('should return between 50% ans 100%', () => {
        const questions = [
            {
                questionId: 'q1',
                correctChoices: ['a'],
                totalChoices: 4
            },
            {
                questionId: 'q2',
                correctChoices: ['a', 'b'],
                totalChoices: 4
            },
            {
                questionId: 'q3',
                correctChoices: ['c'],
                totalChoices: 4
            }
        ];
        const questionsA = [
            {
                questionId: 'q1',
                correctChoices: ['a', 'b'],
                totalChoices: 4
            },
            {
                questionId: 'q2',
                correctChoices: ['c'],
                totalChoices: 4
            },
            {
                questionId: 'q3',
                correctChoices: ['a', 'b'],
                totalChoices: 4
            },
            {
                questionId: 'q4',
                correctChoices: ['c'],
                totalChoices: 4
            }
        ];

        const allUserIds = new Set<string>(['user1', 'user2']);

        const answers: QuizUserAnswer[] = [
            // User 1 answers
            { userId: 'user1', timestamp: 123456, questionId: 'q1', choiceId: 'a' },
            { userId: 'user1', timestamp: 123456, questionId: 'q2', choiceId: 'a' },
            { userId: 'user1', timestamp: 123456, questionId: 'q3', choiceId: 'a' },

            // User 2 answers
            { userId: 'user2', timestamp: 123459, questionId: 'q1', choiceId: 'a' },
            { userId: 'user2', timestamp: 123460, questionId: 'q1', choiceId: 'a' },
            { userId: 'user1', timestamp: 123456, questionId: 'q3', choiceId: 'c' },

        ];
        const answersA: QuizUserAnswer[] = [
            // User 1 answers
            { userId: 'user1', timestamp: 123456, questionId: 'q1', choiceId: 'a' },
            { userId: 'user1', timestamp: 123458, questionId: 'q2', choiceId: 'c' },
            { userId: 'user1', timestamp: 123458, questionId: 'q3', choiceId: 'a' },
            { userId: 'user1', timestamp: 123458, questionId: 'q3', choiceId: 'a' },
            { userId: 'user1', timestamp: 123458, questionId: 'q4', choiceId: 'c' },


            // User 2 answers
            { userId: 'user2', timestamp: 123459, questionId: 'q1', choiceId: 'b' },
            { userId: 'user2', timestamp: 123460, questionId: 'q2', choiceId: 'a' },
            { userId: 'user1', timestamp: 123458, questionId: 'q3', choiceId: 'a' },
            { userId: 'user1', timestamp: 123458, questionId: 'q3', choiceId: 'a' },
            { userId: 'user1', timestamp: 123458, questionId: 'q4', choiceId: 'c' },

        ];

        const result = calculateQuizRate(questions, allUserIds, answers);
        const resultA = calculateQuizRate(questionsA, allUserIds, answersA);
        expect(result.error).toBeNull();
        expect(result.data).toBeGreaterThan(50);
        expect(result.data).toBeLessThan(100);

        expect(resultA.error).toBeNull();
        expect(resultA.data).toBeGreaterThan(50);
        expect(resultA.data).toBeLessThan(100);
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

// describe('calculateQuizScore', () => {
//     it('should calculate the score correctly with correct, wrong, and not given answers', () => {
//         const userChoices = {
//             correct: 3,         // 3 correct answers (2 points per answer)
//             wrong: 2,           // 2 wrong answers (-1 point per answer)
//             notGivenCorrect: 1, // 1 not given but correct answer (-1 point per not given correct answer)
//             notGivenWrong: 1    // 1 not given but wrong answer (0 points)
//         };

//         const result = calculateQuizScore(userChoices);

//         // Expected score calculation:
//         // (3 * 2) + (2 * -1) + (1 * -1) + (1 * 0) = 6 - 2 - 1 + 0 = 3
//         expect(result).toBe(3);
//     });

//     it('should return a score of 0 if no answers are given', () => {
//         const userChoices = {
//             correct: 0,
//             wrong: 0,
//             notGivenCorrect: 0,
//             notGivenWrong: 0
//         };

//         const result = calculateQuizScore(userChoices);

//         expect(result).toBe(0); // No points since no answers were provided
//     });

//     it('should return a negative score if all answers are incorrect or not given', () => {
//         const userChoices = {
//             correct: 0,
//             wrong: 3,
//             notGivenCorrect: 2,
//             notGivenWrong: 2
//         };

//         const result = calculateQuizScore(userChoices);

//         // Expected calculation:
//         // (0 * 2) + (3 * -1) + (2 * -1) + (2 * 0) = 0 - 3 - 2 + 0 = -5
//         expect(result).toBe(-5);
//     });

//     it('should return a score of 0 for incorrect and not given answers with no penalties', () => {
//         const userChoices = {
//             correct: 0,
//             wrong: 2,
//             notGivenCorrect: 0,
//             notGivenWrong: 3
//         };

//         const result = calculateQuizScore(userChoices);

//         // Expected calculation:
//         // (0 * 2) + (2 * -1) + (0 * -1) + (3 * 0) = 0 - 2 + 0 + 0 = -2
//         expect(result).toBe(-2);
//     });

//     it('should handle correctly the cases with 0 or 1 values for each category', () => {
//         const userChoices = {
//             correct: 1,          // 1 correct answer (2 points)
//             wrong: 1,            // 1 wrong answer (-1 point)
//             notGivenCorrect: 0,  // 0 not given but correct answers
//             notGivenWrong: 0     // 0 not given but wrong answers
//         };

//         const result = calculateQuizScore(userChoices);

//         // Expected calculation:
//         // (1 * 2) + (1 * -1) + (0 * -1) + (0 * 0) = 2 - 1 + 0 + 0 = 1
//         expect(result).toBe(1);
//     });
// });