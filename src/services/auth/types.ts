export interface LoginRequestDto {
  phone: string;
  password: string;
  type: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface GetRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
