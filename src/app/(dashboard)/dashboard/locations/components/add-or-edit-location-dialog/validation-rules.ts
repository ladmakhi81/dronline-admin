export const CREATE_OR_EDIT_LOCATION_VALIDATION_RULES = {
  city: [
    {
      required: true,
      message: "وارد کردن شهر الزامی میباشد",
    },
    {
      min: 2,
      message: "شهر باید حداقل از دو کاراکتر تشکیل شده باشد",
    },
  ],
  address: [
    {
      required: true,
      message: "وارد کردن آدرس سرویس دهنده الزامی میباشد",
    },
    {
      min: 10,
      message: "آدرس وارد شده نادرست میباشد",
    },
  ],
};
