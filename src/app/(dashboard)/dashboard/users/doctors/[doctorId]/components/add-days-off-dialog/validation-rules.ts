export const ADD_DAYS_OFF_VALIDATION_RULES = {
  schedule: [
    {
      required: true,
      message: "گزینه رزرو برای مرخصی الزامی میباشد",
    },
  ],
  date: [
    {
      required: true,
      message: "تاریخ درخواست مرخصی الزامی میباشد",
    },
  ],
};
