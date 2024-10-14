export const CREATE_OR_EDIT_PATIENT_VALIDATION_RULES = {
  firstName: [
    {
      required: true,
      message: "وارد کردن نام بیمار الزامی میباشد",
    },
    {
      min: 3,
      message: "نام بیمار باید حداقل تشکیل شده از 3 حرف باشد",
    },
  ],
  lastName: [
    {
      required: true,
      message: "وارد کردن نام خانوادگی بیمار الزامی میباشد",
    },
    {
      min: 3,
      message: "نام خانوادگی بیمار باید حداقل تشکیل شده از 3 حرف باشد",
    },
  ],
  phone: [
    {
      required: true,
      message: "وارد کردن شماره تماس بیمار الزامی میباشد",
    },
    {
      pattern:
        /^(098|0098|98|\+98|0)?9(0[0-5]|[1 3]\d|2[0-3]|9[0-9]|41)\d{7}$/g,
      message: "فرمت شماره تماس وارد شده نادرست میباشد",
    },
  ],
};
