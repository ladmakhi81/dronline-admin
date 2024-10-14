import { jalaliDateTimeFormater } from "@/utils/date-format";

export const TABLE_DEFAULT_COLUMNS = [
  {
    title: "تاریخ ساخت",
    dataIndex: "createdAt",
    width: 200,
    render: (value: string) => {
      return jalaliDateTimeFormater(new Date(value));
    },
  },
  {
    title: "تاریخ ویرایش",
    dataIndex: "updatedAt",
    width: 200,
    render: (value: string) => {
      return jalaliDateTimeFormater(new Date(value));
    },
  },
];
