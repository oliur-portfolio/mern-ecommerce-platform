export type TUserRole = "admin" | "user";
export type TUserStatus = "active" | "blocked";

export interface IAvatar {
  url: string;
  publicId: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: TUserRole;
  status: TUserStatus;
  avatar: IAvatar;
  createdAt: string;
  updatedAt: string;
}

export interface ICommonResponse {
  success: boolean;
  message: string;
}
