export interface NotificationAuthDto {
  socket_id: string;
  channel_name?: string | null;
}

export interface NotificationAuthResponseDto {
  auth: string; // authentication token
  user_data?: string | null;
}
