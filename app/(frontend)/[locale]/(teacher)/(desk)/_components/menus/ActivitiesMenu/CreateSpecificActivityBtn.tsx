"use client";
import { PollProvider, emptyPoll } from "@/app/(frontend)/_hooks/usePoll";
import { QuizProvider, emptyQuiz } from "@/app/(frontend)/_hooks/useQuiz";

import { Button } from "@radix-ui/themes";
import CardDialog from "../../CardDialog";
import QuizCreation from "../../activities/QuizCreation";
import PollCreation from "../../activities/PollCreation";
import { useState } from "react";
import { ActivityType } from "@/app/_types/activity";


export const activities: ActivityType[] = ["quiz", "poll"];

export default function CreateSpecificActivityBtn({type} : {type: ActivityType | null}) {
    const [openActivityCreation, setOpenActivityCreation] = useState(false)
    const activity = activities.findIndex((item) => {
        return (String(item) === String(type));
    });
    let whichActivity = null;
    let frActivity = null;

    switch (activity)
    {
        case 0:
            frActivity = "quizz";
            whichActivity = <>
                <CardDialog preventClose open={openActivityCreation} onOpenChange={setOpenActivityCreation}>
                    <QuizProvider quiz={emptyQuiz}>
                        <QuizCreation closeDialog={() => setOpenActivityCreation(false)} />
                    </QuizProvider>
                </CardDialog>
            </>
            break ;
        case 1:
            frActivity = "sondage"
            whichActivity = <>
                <CardDialog preventClose open={openActivityCreation} onOpenChange={setOpenActivityCreation}>
                    <PollProvider poll={emptyPoll}>
                        <PollCreation closeDialog={() => setOpenActivityCreation(false)} />
                    </PollProvider>
                </CardDialog>
            </>
    }

    const handleClick = () => {
        setOpenActivityCreation(true);
    };
    return (<>
        {
            !openActivityCreation
            ?   type
                ? <Button onClick={handleClick}>Créer un {frActivity}</Button>
                : null
            : whichActivity
        }
   </>);

};