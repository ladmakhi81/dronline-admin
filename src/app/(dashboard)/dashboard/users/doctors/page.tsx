"use client";

import { useGetUsers } from "@/services/user/get-users";
import { GetUsersQuery, UserType } from "@/services/user/types";
import { FC, useMemo, useState } from "react";

const DoctorsPage: FC = () => {
  const [queryApi, setQueryApi] = useState<GetUsersQuery>({
    type: UserType.Admin,
    limit: 10,
    page: 0,
  });
  const { data: doctorsData } = useGetUsers(queryApi);

  const doctors = useMemo(() => {
    return doctorsData?.content || [];
  }, [doctorsData?.content]);

  console.log(1, doctors);
  return <p>لیست پزشک</p>;
};

export default DoctorsPage;
