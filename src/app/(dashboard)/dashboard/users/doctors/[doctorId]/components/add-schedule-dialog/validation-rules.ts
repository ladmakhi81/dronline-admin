export const ADD_SCHEDULE_VALIDATION_RULES = {
  day: [
    {
      required: true,
      message: "وارد کردن روز برگزاری الزامی میباشد",
    },
  ],
  type: [
    {
      required: true,
      message: "وارد کردن نوع برگزاری جلسه الزامی میباشد",
    },
  ],
  location: (required: boolean) => [
    {
      required,
      message: "وارد کردن محل برگزاری جلسه الزامی میباشد",
    },
  ],
  room: (required: boolean) => [
    {
      required,
      message: "وارد کردن اتاق الزامی میباشد",
    },
  ],
  startHour: [
    {
      required: true,
      message: "وارد کردن زمان شروع جلسه الزامی میباشد",
    },
  ],
  endHour: [
    {
      required: true,
      message: "وارد کردن زمان پایان جلسه الزامی میباشد",
    },
  ],
};
