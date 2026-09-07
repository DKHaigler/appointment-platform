export default function Home() {


  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-xl text-center space-y-6">

      <h1 className="text-5xl font-bold leading-tight">Appointment Platform</h1>

      <p className="text-lg text-gray-600">
        Manage your appointments and let your clients book with ease.
      </p>

      <div className="flex justify-center gap-5 p-6">
        <a href="/signup" className="btn-primary">Create Account</a>
        <a href="/login" className="btn-secondary">Log In</a>
      </div>
      </div>
    </main>
  );
}