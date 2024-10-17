export const CREATE_OR_EDIT_ADMIN_VALIDATION_RULES = {
  firstName: [
    {
      required: true,
      message: "وارد کردن نام ادمین الزامی میباشد",
    },
    {
      min: 3,
      message: "نام ادمین حداقل باید شامل 3 حرف باشد",
    },
  ],
  lastName: [
    {
      required: true,
      message: "وارد کردن نام خانوادگی ادمین الزامی میباشد",
    },
    {
      min: 3,
      message: "نام خانوادگی حداقل باید شامل 3 حرف باشد",
    },
  ],
  phone: [
    {
      required: true,
      message: "شماره تماس پزشک را وارد کنید",
    },
    {
      pattern:
        /^(098|0098|98|\+98|0)?9(0[0-5]|[1 3]\d|2[0-3]|9[0-9]|41)\d{7}$/g,
      message: "فرمت شماره تماس وارد شده نادرست میباشد",
    },
  ],
  password: [
    {
      required: true,
      message: "گذرواژه پزشک را وارد کنید",
    },
    { min: 8, message: "گذرواژه باید حداقل 8 کاراکتر داشته باشد" },
  ],
};
