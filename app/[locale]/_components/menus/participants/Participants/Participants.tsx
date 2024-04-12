'use client'
import ParticipantsList from '../ParticipantsList/ParticipantsList'
import NavigationOption from '../NavigationOption/NavigationOption'
import DeskMenuLayout from '../../DeskMenuLayout/DeskMenuLayout'


export default function Participants() {
    return (
        <DeskMenuLayout menu="participants">

            <div>
                <h2>Défilement</h2>
                <NavigationOption />
            </div>
            <div>
                <h2>Participants</h2>
                <ParticipantsList />
            </div>
            
        </DeskMenuLayout>
    )
}