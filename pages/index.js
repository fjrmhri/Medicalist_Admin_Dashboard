import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Arahkan pengguna ke halaman login segera setelah landing page dimuat
    router.push("/Login");
  }, [router]);

  return null;
}
