"use client"
import { supabase } from "../lib/supabase-client";
import { useAuth } from "../context/AuthContext";
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';

const Login = () => {
  const { setProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error || !data?.user) {
      toast("Error!",{
        description: "Failed to sign in. Please check your credentials.",
        className: "bg-red-600 text-white text-sm px-6 py-4 rounded-lg w-[400px]", // Custom color and size
        unstyled: true,
      })
      return;
    }

    const user = data.user;

    const { data: profile, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (userError) {
      navigate("/landing")
      toast("Couldn't fetch profile");
      return;
    }
     toast("Success!",{
        description: "Welcome, back",
        className: "bg-green-600 text-white text-sm px-6 py-4 rounded-lg w-[400px]", // Custom color and size
        unstyled: true,
      })

    setProfile(profile);
    navigate("/notes");
    setFormData({ email: "", password: "" });

  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <FileText className="h-8 w-8" />
            <span className="text-2xl font-semibold">Notes</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sign In Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700">
                Sign in
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-xs text-gray-500">
          <a href="#" className="text-blue-600 hover:text-blue-700">Help</a>
          {' • '}
          <a href="#" className="text-blue-600 hover:text-blue-700">Privacy</a>
          {' • '}
          <a href="#" className="text-blue-600 hover:text-blue-700">Terms</a>
        </div>
      </div>
    </div>
  );
};

export default Login;