import dayjs from "dayjs";
import jalaliDate from "jalaliday";

dayjs.extend(jalaliDate);

export const dateFormater = dayjs;

export const jalaliDateTimeFormater = (value: Date) =>
  dateFormater(value).calendar("jalali").format("YYYY-MM-DD HH:mm");
