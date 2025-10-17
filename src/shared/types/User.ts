export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  nationalID: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  role: string | Role;
  profilePicture?: string;
  isActive: boolean;
  isVerified: boolean;
  authType: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Role {
	_id: string;
	key: string;
	__v: number;
	permissions: string[]; // Array of permission IDs
}

export interface Permission {
  _id: string;
  key: string;
}

export interface VerifyUserData {
  isVerified: boolean;
  roleId?: string;
}

export interface AssignRoleData {
  roleId: string;
}

export interface UserResponse {
  success: boolean;
  data: User[];
}

export interface SingleUserResponse {
  success: boolean;
  message: string;
  data: User & {
    role: Role;
  };
} 