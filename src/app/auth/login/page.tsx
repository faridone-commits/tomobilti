import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto px-4 py-16 text-center text-gray-400">Chargement...</div>}>
      <LoginForm />
    </Suspense>
  );
}
