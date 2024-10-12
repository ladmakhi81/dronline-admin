export const SIGN_IN_VALIDATION_RULES = {
  phoneNumber: [
    {
      required: true,
      message: "شماره تماس خود را وارد کنید",
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
      message: "گذرواژه خود را وارد کنید",
    },
    { min: 8, message: "گذرواژه باید حداقل 8 کاراکتر داشته باشد" },
  ],
};
