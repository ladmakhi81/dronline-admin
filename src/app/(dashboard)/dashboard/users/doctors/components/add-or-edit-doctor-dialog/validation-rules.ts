export const ADD_OR_EDIT_DOCTOR_VALIDATION_RULES = {
  firstName: [
    {
      required: true,
      message: "وارد کردن نام پزشک الزامی میباشد",
    },
    {
      min: 3,
      message: "نام پزشک باید حداقل 3 حرف داشته باشد",
    },
  ],
  lastName: [
    {
      required: true,
      message: "وارد کردن نام خانوادگی پزشک الزامی میباشد",
    },
    {
      min: 3,
      message: "نام خانوادگی پزشک باید حداقل 3 حرف داشته باشد",
    },
  ],
  phone: [
    {
      required: true,
      message: "وارد کردن شماره تماس الزامی میباشد",
    },
    {
      pattern:
        /^(098|0098|98|\+98|0)?9(0[0-5]|[1 3]\d|2[0-3]|9[0-9]|41)\d{7}$/g,
      message: "فرمت شماره تماس وارد شده نادرست میباشد",
    },
  ],
  phone2: [
    {
      required: true,
      message: "وارد کردن شماره تماس الزامی میباشد",
    },
    {
      pattern:
        /^(098|0098|98|\+98|0)?9(0[0-5]|[1 3]\d|2[0-3]|9[0-9]|41)\d{7}$/g,
      message: "فرمت شماره تماس وارد شده نادرست میباشد",
    },
  ],
  degreeOfEducation: [
    {
      required: true,
      message: "وارد کردن مدرک تحصیلی الزامی میباشد",
    },
  ],
  gender: [
    {
      required: true,
      message: "مشخص کردن جنسیت پزشک الزامی میباشد",
    },
  ],
  workingFields: [
    {
      required: true,
      message: "وارد کردن زمینه تخصصی پزشک الزامی میباشد",
    },
  ],
  address: [
    {
      required: true,
      message: "وارد کردن آدرس مطب پزشک الزامی میباشد",
    },
    {
      min: 10,
      message: "آدرس مطب پزشک نادرست میباشد",
    },
  ],
  bio: [
    {
      required: true,
      message: "وارد کردن بیوگرافی از پزشک الزامی میباشد",
    },
    {
      min: 10,
      message: "بیوگرافی کوتاه است",
    },
  ],
};
