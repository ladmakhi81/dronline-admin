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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DASHBOARD_MENU_URLS = (t: any) => [
  {
    key: DASHBOARD_URLS.dashboard,
    label: t("dashboard"),
  },
  {
    key: DASHBOARD_URLS.users,
    label: t("users"),
    children: [
      {
        key: DASHBOARD_URLS.admin_users,
        label: t("admins"),
      },
      {
        key: DASHBOARD_URLS.doctor_users,
        label: t("doctors"),
      },
      {
        key: DASHBOARD_URLS.patient_users,
        label: t("patients"),
      },
    ],
  },
  {
    key: DASHBOARD_URLS.categories,
    label: t("categories"),
  },
  {
    key: DASHBOARD_URLS.locations,
    label: t("locations"),
  },
  {
    key: DASHBOARD_URLS.orders,
    label: t("orders"),
  },
  {
    key: DASHBOARD_URLS.transactions,
    label: t("transactions"),
  },
];
