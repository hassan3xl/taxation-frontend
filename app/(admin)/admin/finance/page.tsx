"use client";

import { useAdminGetPayments } from "@/lib/hooks/admin.hook";
import React from "react";

const FinancePage = () => {
  const { data: payments } = useAdminGetPayments();
  console.log("payments", payments);
  return <div></div>;
};

export default FinancePage;
