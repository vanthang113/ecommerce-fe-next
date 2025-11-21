"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function AdminPage() {
  const router = useRouter();
  useAuth();

  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);

  return null;
}
