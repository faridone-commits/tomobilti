import { Suspense } from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return <Suspense fallback={<div className="max-w-sm mx-auto px-4 py-16 text-center text-gray-400">Chargement...</div>}><ForgotPasswordForm /></Suspense>;
}
