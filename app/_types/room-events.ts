export interface RoomEvent {
    type: string //'start activity' | 'end-activity' 
    payload: any
    room_id: string
}