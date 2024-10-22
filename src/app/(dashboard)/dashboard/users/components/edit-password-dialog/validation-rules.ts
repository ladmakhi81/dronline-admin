export const EDIT_PASSWORD_VALIDATION_RULES = {
  password: [
    {
      required: true,
      message: "وارد کردن گذرواژه الزامی میباشد",
    },
    {
      min: 8,
      message: "گذرواژه حداقل باید 8 کاراکتر داشته باشد",
    },
  ],
};
