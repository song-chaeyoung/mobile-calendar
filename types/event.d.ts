export interface EventType {
  category: number | null;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  content: string;
  startTime: string | number;
  endTime: string | number;
  id?: number | undefined;
}
