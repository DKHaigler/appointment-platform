"use client";
import { useState } from "react";
import { signUp } from "@/features/auth/services/signup";


export default function SignupPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      setError("");
      
      if (password !== confirmPassword) {
        setError("Passwords do not match");
          return;
        }
        
      setLoading(true);
      try {
          const data = await signUp(email, password, fullName);
          setSuccess(true);
         
        } catch (error) {
            if(error instanceof Error){
                setError(error.message);
            } else {
                setError("Something went wrong. Please try again.")
            }
        } finally {
          setLoading(false);
     }

    }

    if (success) {
      return (
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center space-y-4">
            <h1 className="text-3xl font-bold">Check your email</h1>
    
            <p className="text-gray-600">
              We sent a confirmation link to {email}. Please verify your email to
              finish creating your account.
            </p>
          </div>
        </main>
      );
    }
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">

            <h1 className="text-3xl font-bold text-center">Create your account</h1>
            <p className="mt-2 text-center text-gray-600">
              Create your account to start managing your appointments.
            </p>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input className="form-input" 
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="form-label">Email</label>
                <input className="form-input" 
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="form-label">Password</label>
                <input className="form-input" 
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input className="form-input" 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  />
              </div>
              
              {error && (
                <p>{error}</p>
              )}
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
        </div>
    </main>
  );
}