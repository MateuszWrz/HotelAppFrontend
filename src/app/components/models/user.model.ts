export interface User {
  id: number;
  email: string;
  name: string;
  lastName: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  zipCode?: string;
  [key: string]: any;
}
