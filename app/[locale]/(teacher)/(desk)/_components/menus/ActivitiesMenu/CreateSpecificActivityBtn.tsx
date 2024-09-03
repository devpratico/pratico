"use client";

import { ActivityType, emptyPoll, emptyQuiz, PollCreationProvider, QuizCreationProvider } from "@/app/_hooks/usePollQuizCreation";
import { Button } from "@radix-ui/themes";
import CardDialog from "../../CardDialog";
import QuizCreation from "../../activities/QuizCreation";
import PollCreation from "../../activities/PollCreation";
import { useState } from "react";
import { T } from "tldraw";


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
                <CardDialog preventClose open={openActivityCreation} setOpen={setOpenActivityCreation}>
                    <QuizCreationProvider initialQuiz={emptyQuiz}>
                        <QuizCreation closeDialog={() => setOpenActivityCreation(false)} />
                    </QuizCreationProvider>
                </CardDialog>
            </>
            break ;
        case 1:
            frActivity = "sondage"
            whichActivity = <>
                <CardDialog preventClose open={openActivityCreation} setOpen={setOpenActivityCreation}>
                    <PollCreationProvider initialPoll={emptyPoll}>
                        <PollCreation closeDialog={() => setOpenActivityCreation(false)} />
                    </PollCreationProvider>
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
                ? <Button disabled={activity !== 0} onClick={handleClick}>Créer un {frActivity}</Button>
                : null
            : whichActivity
        }
   </>);

};