export interface ReservationDTO {
  id: number;
  reservationNumber: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  roomId: number;
  roomDescription: string;
  roomPrice: number;
  hotelName: string;
  hotelCity: string;
  userEmail: string;
  userName: string;
}
