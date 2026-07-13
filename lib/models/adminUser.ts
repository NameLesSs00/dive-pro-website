export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface CreateAdminUserRequest {
  email: string;
  password: string;
  fullName: string;
  role: string;
}
