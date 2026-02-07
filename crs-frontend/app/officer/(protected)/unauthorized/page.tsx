export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-600">403 - Unauthorized</h1>
      <p className="text-slate-500 mt-2">
        You do not have permission to view the AI Analysis dashboard.
      </p>
      <a href="/officer/dashboard" className="mt-4 text-blue-600 underline">
        Return to Dashboard
      </a>
    </div>
  );
}
