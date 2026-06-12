export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}
