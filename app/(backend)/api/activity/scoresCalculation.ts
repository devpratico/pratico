import { Quiz } from "@/domain/entities/activities/quiz"


const scoreRules = {
    correctTicked: 2,
    correctNotTicked: 0,
    wrongTicked: -1,
    wrongNotTicked: 0,
}



/** 
 * Calculates the score for a set of quiz answers.
 * It works for one question or the whole quiz.
 * Returns a ratio
 * */
export function calculateUserQuizScore(args: {
    quizChoices: {
        id: string,
        isCorrect: boolean,
    }[],
    userAnswersIds: string[],
}): number {

    const { quizChoices, userAnswersIds } = args

    let points = quizChoices.reduce((acc, quizChoice) => {
        const isUserAnswer = userAnswersIds.includes(quizChoice.id)

        if (quizChoice.isCorrect) {
            if (isUserAnswer) {
                return acc + scoreRules.correctTicked
            } else {
                return acc + scoreRules.correctNotTicked
            }
        } else {
            if (isUserAnswer) {
                return acc + scoreRules.wrongTicked
            } else {
                return acc + scoreRules.wrongNotTicked
            }
        }
    }, 0)

    // If the score is negative, set to 0
    points =  Math.max(0, points)

    // Compute the max score
    const maxPoints = quizChoices.reduce((acc, quizChoice) => {
        if (quizChoice.isCorrect) {
            return acc + scoreRules.correctTicked
        } else {
            return acc + scoreRules.wrongNotTicked
        }
    }, 0)

    if (maxPoints === 0) return 0

    return points / maxPoints
}




export function concatenateQuizChoices(quiz: Quiz): { id: string, isCorrect: boolean }[] {
    return quiz.questions.flatMap(question => {
        return question.choices.map(choice => {
            return {
                id: choice.id,
                isCorrect: choice.isCorrect
            }
        })
    })
}


/**
 * Calculate the global score of a quiz
 * It is the average score of all users
 */
export function calculateTotalQuizScore(args: {
    quizChoices: {
        id: string,
        isCorrect: boolean,
    }[],
    usersAnswers: {
        userId: string,
        choiceId: string,
    }[]
}) {
    const { quizChoices, usersAnswers } = args

    const usersIds = Array.from(new Set<string>(usersAnswers.map((answer) => answer.userId)));

    const scores: {
        userId: string,
        score: number,
    }[] = usersIds.map((userId) => {
        const userAnswersIds = usersAnswers.filter((answer) => answer.userId === userId).map((answer) => answer.choiceId)
        const score = calculateUserQuizScore({quizChoices, userAnswersIds})

        return { userId, score }
    })

    // Compute the average score of all users
    const numberOfUsers = usersIds.length
    const scoreSum = scores.reduce((acc, score) => acc + score.score, 0)
    if (scoreSum <= 0 || numberOfUsers <= 0)
        return 0
    const averageScore =  scoreSum / numberOfUsers

    return averageScore
};