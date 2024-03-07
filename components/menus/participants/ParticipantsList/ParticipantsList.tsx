'use client'
import ParticipantRow from "../ParticipantRow/ParticipantRow"
import usePresence from "@/hooks/usePresence"



export default function ParticipantsList() {
    const presences = usePresence()

    return(
        <div>
            {presences.map(p => 
                <div key={p.id}>
                    <ParticipantRow color={p.color} name={p.userName}/>
                </div>
            )}
        </div>
    )
}