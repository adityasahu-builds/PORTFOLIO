export interface TokenPayload {
  id: string;
  role: "admin" | "editor";
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: "admin" | "editor";
  createdAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}
