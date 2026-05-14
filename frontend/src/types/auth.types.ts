export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
}
