import dayjs from "dayjs";
import moment from "moment-jalaali";

export const dateFormater = dayjs;

export const jalaliDateTimeFormater = (value: Date) =>
  dateFormater(value).format("YYYY-MM-DD HH:mm");

export const jalaliDateFormater = (value: Date) =>
  dateFormater(value).format("YYYY-MM-DD");

export const convertJalaliToGregorian = (date: string) =>
  moment(date, "jYYYY-jMM-jDD").format("YYYY-MM-DD");
