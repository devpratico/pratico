//import { calculateQuizRate, questionQuizRateType } from "./fetchActivitiesDoneInRoom";
import { QuizUserAnswer } from "@/domain/entities/activities/quiz";
import { calculateUserQuizScore, calculateTotalQuizScore } from "./scoresCalculation";



describe('calculateUserQuizScore', () => {
    it('should calculate the score correctly with 2 correct answers and 1 incorrect answer', () => {

        const quizChoices = [
            { id: 'a', isCorrect: true },
            { id: 'b', isCorrect: true },
            { id: 'c', isCorrect: true },
            { id: 'd', isCorrect: false },
            { id: 'e', isCorrect: false }
        ];

        const userAnswersIds = ['a', 'b', 'c', 'd'];

        const expectedPoints = 2 + 2 + 2 - 1;  // 5 points
        const expectedMaxPoints = 2 + 2 + 2 + 0;  // 6 points
        const expectedResult = expectedPoints / expectedMaxPoints;

        const result = calculateUserQuizScore({ quizChoices, userAnswersIds });

        expect(result).toBe(expectedResult);
    });

    it('should return a score of 1 if all correct', () => {
        const quizChoices = [
            { id: 'a', isCorrect: true },
            { id: 'b', isCorrect: true },
            { id: 'c', isCorrect: true },
            { id: 'd', isCorrect: false },
            { id: 'e', isCorrect: false }
        ];

        const userAnswersIds = ['a', 'b', 'c'];

        const expectedResult = 1;

        const result = calculateUserQuizScore({ quizChoices, userAnswersIds });

        expect(result).toBe(expectedResult);
    });

    it('shoud return a score of 0.5 if half correct', () => {
        const quizChoices = [
            { id: 'a', isCorrect: true },
            { id: 'b', isCorrect: true },
            { id: 'c', isCorrect: false },
            { id: 'd', isCorrect: false },
            { id: 'e', isCorrect: false }
        ];

        const userAnswersIds = ['a'];

        const expectedResult = 0.5;

        const result = calculateUserQuizScore({ quizChoices, userAnswersIds });

        expect(result).toBe(expectedResult);
    });

    it('should return a score of 0 if no answers are given', () => {
        const quizChoices = [
            { id: 'a', isCorrect: true },
            { id: 'b', isCorrect: true },
            { id: 'c', isCorrect: true },
            { id: 'd', isCorrect: false },
            { id: 'e', isCorrect: false }
        ];

        const userAnswersIds: string[] = [];

        const result = calculateUserQuizScore({ quizChoices, userAnswersIds });

        const expecedResult = 0;

        expect(result).toBe(expecedResult);
    });


    it('should return a score of 0 if negative points', () => {
        const quizChoices = [
            { id: 'a', isCorrect: true },
            { id: 'b', isCorrect: true },
            { id: 'c', isCorrect: true },
            { id: 'd', isCorrect: false },
            { id: 'e', isCorrect: false }
        ];

        const userAnswersIds = ['d', 'e'];

        const expectedResult = 0;

        const result = calculateUserQuizScore({ quizChoices, userAnswersIds });

        expect(result).toBe(expectedResult);
    });

    
    it('should handle edge case with empty quiz questions array', () => {
        const quizChoices: {
            id: string,
            isCorrect: boolean,
        }[] = [];
        
        const userAnswersIds = ['a', 'b', 'c'];

        const result = calculateUserQuizScore({ quizChoices, userAnswersIds });

        expect(result).toBe(0);
    });

});


describe('calculateTotalRate', () => {

    it('should calculate the total score correctly for multiple users', () => {

        const quizChoices = [
            { id: 'a', isCorrect: true },
            { id: 'b', isCorrect: true },
            { id: 'c', isCorrect: true },
            { id: 'd', isCorrect: false },
            { id: 'e', isCorrect: false }
        ];

        const usersAnswers = [
            // User 1 answers
            { userId: 'user1', choiceId: 'a' },
            { userId: 'user1', choiceId: 'b' },
            { userId: 'user1', choiceId: 'c' },

            // User 2 answers
            { userId: 'user2', choiceId: 'a' },
            { userId: 'user2', choiceId: 'c' }
        ];

        const result = calculateTotalQuizScore({ quizChoices, usersAnswers });

        const user1Points = 2 + 2 + 2;  // 6 points
        const user2Points = 2 + 2;  // 4 points
        const maxPoints = 2 + 2 + 2 + 0;  // 6 points
        const user1Score = user1Points / maxPoints;
        const user2Score = user2Points / maxPoints;
        const expecedResult = (user1Score + user2Score) / 2;

        expect(result).toBe(expecedResult);
    });

    it('should return 100%', () => {
        const quizChoices = [
            { id: 'a', isCorrect: true },
            { id: 'b', isCorrect: true },
            { id: 'c', isCorrect: true },
            { id: 'd', isCorrect: false },
            { id: 'e', isCorrect: false }
        ];

        const usersAnswers = [
            // User 1 answers
            { userId: 'user1', choiceId: 'a' },
            { userId: 'user1', choiceId: 'b' },
            { userId: 'user1', choiceId: 'c' },

            // User 2 answers
            { userId: 'user2', choiceId: 'a' },
            { userId: 'user2', choiceId: 'b' },
            { userId: 'user2', choiceId: 'c' }
        ];

        const result = calculateTotalQuizScore({ quizChoices, usersAnswers });

        expect(result).toBe(1);
    });

    it('should return 50% when people half correct', () => {
        const quizChoices = [
            { id: 'a', isCorrect: true },
            { id: 'b', isCorrect: true },
            { id: 'c', isCorrect: false },
            { id: 'd', isCorrect: false },
            { id: 'e', isCorrect: false }
        ];

        const usersAnswers = [
            { userId: 'user1', choiceId: 'a' }, // User 1 answers
            { userId: 'user2', choiceId: 'a' } // User 2 answers
        ];

        const result = calculateTotalQuizScore({ quizChoices, usersAnswers });

        expect(result).toBe(0.5);
    });

    it('should return 50% when one person is correct and the other is wrong', () => {
        const quizChoices = [
            { id: 'a', isCorrect: true },
            { id: 'b', isCorrect: true },
            { id: 'c', isCorrect: true },
            { id: 'd', isCorrect: false },
            { id: 'e', isCorrect: false }
        ];

        const usersAnswers = [
            // User 1 answers
            { userId: 'user1', choiceId: 'a' },
            { userId: 'user1', choiceId: 'b' },
            { userId: 'user1', choiceId: 'c' },

            // User 2 answers
            { userId: 'user2', choiceId: 'd' },
            { userId: 'user2', choiceId: 'e' },
        ];

        const result = calculateTotalQuizScore({ quizChoices, usersAnswers });

        expect(result).toBe(0.5);
    });


    it('should return 0%', () => {
        const quizChoices = [
            { id: 'a', isCorrect: true },
            { id: 'b', isCorrect: true },
            { id: 'c', isCorrect: true },
            { id: 'd', isCorrect: false },
            { id: 'e', isCorrect: false }
        ];

        const usersAnswers = [
            // User 1 answers
            { userId: 'user1', choiceId: 'd' },
            { userId: 'user1', choiceId: 'e' },

            // User 2 answers
            { userId: 'user2', choiceId: 'd' },
            { userId: 'user2', choiceId: 'e' }
        ];

        const result = calculateTotalQuizScore({ quizChoices, usersAnswers });

        expect(result).toBe(0);
    });

    it('should return 25% when 1 person is 0.5 and the other 0', () => {
        const quizChoices = [
            { id: 'a', isCorrect: true },
            { id: 'b', isCorrect: true },
            { id: 'c', isCorrect: true },
            { id: 'd', isCorrect: true },
            { id: 'e', isCorrect: false }
        ];

        const usersAnswers = [
            { userId: 'user1', choiceId: 'a' },
            { userId: 'user1', choiceId: 'b' }, // User 1 answers : score 0.5
            { userId: 'user2', choiceId: 'e' } // User 2 answers : score 0
        ];

        const result = calculateTotalQuizScore({ quizChoices, usersAnswers });

        expect(result).toBe(0.25);
    });



    it('should handle edge case with empty quiz questions array', () => {
        const quizChoices: {
            id: string,
            isCorrect: boolean,
        }[] = [];
        
        const usersAnswers = [
            { userId: 'user1', choiceId: 'a' },
            { userId: 'user1', choiceId: 'b' },
            { userId: 'user2', choiceId: 'e' }
        ];

        const result = calculateTotalQuizScore({ quizChoices, usersAnswers });

        expect(result).toBe(0);
    });

    it('should handle edge case with empty answers array', () => {
        const quizChoices = [
            { id: 'a', isCorrect: true },
            { id: 'b', isCorrect: true },
            { id: 'c', isCorrect: true },
            { id: 'd', isCorrect: true },
            { id: 'e', isCorrect: false }
        ];

        const usersAnswers: {
            userId: string;
            choiceId: string;
        }[] = [];

        const allUserIds = new Set<string>(['user1', 'user2']);
        const answers: QuizUserAnswer[] = [];  // Aucune réponse donnée

        const result = calculateTotalQuizScore({ quizChoices, usersAnswers});

        expect(result).toBe(0);  // Aucun score car aucune réponse donnée
    });

});

