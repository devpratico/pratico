import { Json } from "@/supabase/types/database.types"
import { Quiz } from "@/core/domain/entities/activities/quiz"
import { Poll } from "@/core/domain/entities/activities/poll"
import logger from "@/app/_utils/logger"


// TODO: Remove the 'type' ('quiz' or 'poll') field from supabase and use the json content ('object' column) instead
// Supabase allows to filter queries by the content of a JSON object field.

export const adapter = {
    toJson: (activity: Quiz | Poll ) => activity as unknown as Json,

    toQuiz: (json: Json) => {
        if (!json) {
            logger.error('supabase:database', 'Error parsing quiz', 'No JSON provided')
            return undefined
        }

        const rawObject = json as any
        const schemaVersion = rawObject.schemaVersion as string

        switch (schemaVersion) {
            case '3':
                return rawObject as Quiz
            default:
                logger.error('supabase:database', 'Error parsing quiz', `Schema version "${schemaVersion}" not supported`)
                return undefined
        }
    },

    toPoll: (json: Json) => {
        if (!json) {
            logger.error('supabase:database', 'Error parsing poll', 'No JSON provided')
            return undefined
        }

        const rawObject = json as any
        const schemaVersion = rawObject.schemaVersion as string

        switch (schemaVersion) {
            case '3':
                return rawObject as Poll
            default:
                logger.error('supabase:database', 'Error parsing poll', `Schema version "${schemaVersion}" not supported`)
                return undefined
        }
    }
}