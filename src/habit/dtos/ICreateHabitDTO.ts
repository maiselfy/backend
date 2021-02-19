export default interface ICreateHabitDTO {
  id: string;
  name: string;
  description: string;
  reminder_question: string;
  color: string;
  frequency: Int16Array;
  reminder: string;
  pontuation: Int16Array;
}
