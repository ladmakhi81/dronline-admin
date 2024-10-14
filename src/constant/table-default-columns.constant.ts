import { jalaliDateTimeFormater } from "@/utils/date-format";

export const TABLE_DEFAULT_COLUMNS = [
  {
    title: "ردیف",
    dataIndex: "index",
    width: 70,
  },
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