export interface IToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}