type RoomEventType = 'start activity' 



interface RoomEvent {
    type: string
    payload: any
    room_id: number
}