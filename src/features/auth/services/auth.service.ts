import api from "@/lib/api";

interface LoginPayload {
  email: string;
  password: string;
}

interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

interface RegisterPayload {
  username: string;
  full_name: string;
  email: string;
  password: string;
}

export async function register(payload: RegisterPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/register", payload);
  return response.data;
}
