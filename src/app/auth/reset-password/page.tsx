import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return <Suspense fallback={<div className="max-w-sm mx-auto px-4 py-16 text-center text-gray-400">Chargement...</div>}><ResetPasswordForm /></Suspense>;
}
