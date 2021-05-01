enum weekDay {
  everySunday = 1,
  everyMonday = 2,
  everyTuesday = 3,
  everyWednesday = 4,
  everyThursday = 5,
  everyFriday = 6,
  everySaturday = 7,
}
export default interface ICreateHabitDTO {
  userId: string;
  name: string;
  description: string;
  reminderQuestion: string;
  color: string;
  frequency: weekDay;
  reminder: boolean;
  pontuation: number;
}
