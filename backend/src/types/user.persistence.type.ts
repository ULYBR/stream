export interface UserPersistence {
  pk: string;
  sk: string;
  email: string;
  name: string;
  password: string;
  role: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
}
