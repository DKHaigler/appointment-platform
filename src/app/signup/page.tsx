"use client";
import { useState } from "react";
import { signUp } from "@/features/auth/services/signup";


export default function SignupPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (password !== confirmPassword) {
        console.log("Passwords do not match");
        return;
      }

      const data = await signUp(email, password);

      console.log(data);
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

              <button type="submit" className="btn-primary" >
                Create Account
              </button>
            </form>
        </div>
    </main>
  );
}