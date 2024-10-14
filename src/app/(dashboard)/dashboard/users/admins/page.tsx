"use client";

import { useGetUsers } from "@/services/user/get-users";
import { GetUsersQuery, UserType } from "@/services/user/types";
import { FC, useMemo, useState } from "react";

const AdminsPage: FC = () => {
  const [queryApi, setQueryApi] = useState<GetUsersQuery>({
    type: UserType.Admin,
    limit: 10,
    page: 0,
  });
  const { data: adminsData } = useGetUsers(queryApi);

  const admins = useMemo(() => {
    return adminsData?.content || [];
  }, [adminsData?.content]);

  console.log(1, admins);
  return <p>لیست ادمین</p>;
};

export default AdminsPage;
