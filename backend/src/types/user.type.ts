export enum UserRole {
  MASTER = "master",
  COMMON = "common",
  MODERATOR = "moderator",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
}

export type UserSafeResponse = Omit<User, "password">;
