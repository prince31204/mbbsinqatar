"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2 } from "lucide-react";

interface RegistrationForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
      } else {
        // Redirect to OTP verification
        router.push(
          `/otp-verification?email=${encodeURIComponent(form.email)}`,
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#8A1538] rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Create Account</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Start your MBBS journey in Qatar
          </p>
        </div>

        {error && (
          <div className="bg-white border border-[#E5E7EB] text-[#5B0F26] px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            {
              name: "name",
              label: "Full Name",
              type: "text",
              placeholder: "John Doe",
            },
            {
              name: "email",
              label: "Email Address",
              type: "email",
              placeholder: "your@email.com",
            },
            {
              name: "phone",
              label: "Phone Number",
              type: "tel",
              placeholder: "+91 9876543210",
            },
            {
              name: "password",
              label: "Password",
              type: "password",
              placeholder: "Min 8 characters",
            },
            {
              name: "confirmPassword",
              label: "Confirm Password",
              type: "password",
              placeholder: "Repeat your password",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                {field.label}
              </label>
              <input
                required
                type={field.type}
                name={field.name}
                value={form[field.name as keyof RegistrationForm]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-transparent"
              />
            </div>
          ))}

          <p className="text-xs text-[#6B7280]">
            By registering, you agree to our{" "}
            <Link href="#" className="text-[#8A1538] underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-[#8A1538] underline">
              Privacy Policy
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8A1538] text-white py-3.5 rounded-xl font-semibold hover:bg-[#5B0F26] disabled:opacity-60 transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#4B5563]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#8A1538] hover:text-[#5B0F26] font-semibold"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
