export const DASHBOARD_URLS = {
  dashboard: "/dashboard",
  users: "/dashboard/users",
  admin_users: "/dashboard/users/admins",
  doctor_users: "/dashboard/users/doctors",
  doctors_users_detail: (id: number) => `/dashboard/users/doctors/${id}`,
  patient_users: "/dashboard/users/patients",
  categories: "/dashboard/categories",
  locations: "/dashboard/locations",
  schedules: "/dashboard/schedules",
  days_off: "/dashboard/daysoff",
  orders: "/dashboard/orders",
  transactions: "/dashboard/transactions",
  payments: "/dashboard/payments",
} as const;

export const DASHBOARD_MENU_URLS = [
  {
    key: DASHBOARD_URLS.dashboard,
    label: "داشبورد",
  },
  {
    key: DASHBOARD_URLS.users,
    label: "کاربران",
    children: [
      {
        key: DASHBOARD_URLS.admin_users,
        label: "لیست ادمین ها",
      },
      {
        key: DASHBOARD_URLS.doctor_users,
        label: "لیست پزشکان",
      },
      {
        key: DASHBOARD_URLS.patient_users,
        label: "لیست بیماران",
      },
    ],
  },
  {
    key: DASHBOARD_URLS.categories,
    label: "زمینه های تخصصی",
  },
  {
    key: DASHBOARD_URLS.locations,
    label: "لوکیشن سرویس دهنده",
  },
  {
    key: DASHBOARD_URLS.orders,
    label: "نوبت های رزرو",
  },
  {
    key: DASHBOARD_URLS.transactions,
    label: "تراکنش و پرداخت",
  },
];
