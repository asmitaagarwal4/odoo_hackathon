"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, HelpCircle } from "lucide-react"
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Login() {
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();
  // Register form state
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }
      // console.log("Login response:", res);
      const data = await res.json();
      const token = data.token;
      const decoded = jwtDecode(token);
      const user = {
        id: decoded.user.id,
        role: decoded.user.role,
        token: token
      };

      setIsLoading(false);
      alert("Logged in!");
       navigate("/dashboard", { state: { user } });
      // ...handle successful login (e.g., redirect, store token)...
    } catch (err) {
      setIsLoading(false);
      alert("Login failed: " + err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Registering user:", {
          name: `${registerFirstName} ${registerLastName}`,
          email: registerEmail,
          password: registerPassword,
        })
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${registerFirstName} ${registerLastName}`,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      // const data = await res.json();
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }
      const data = await res.json();
      const token = data.token;
      const decoded = jwtDecode(token);
      const user = {
        id: decoded.user.id,
        role: decoded.user.role,
        token:token
      };
      setIsLoading(false);
      alert("Account created!");
      navigate("/dashboard", { state: { user } });
      // ...handle successful registration...
    } catch (err) {
      setIsLoading(false);
      alert("Registration failed: " + err.message);
    }
  };


  return (
    <>
      {/* <div className="min-h-screen bg-white flex items-center justify-center p-4"> */}
        <div className="w-lvw max-w-md text-black">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 text-sage-500 mr-2" />
            <h1 className="text-2xl font-bold text-sage-800">QuickDesk</h1>
          </div>
          <p className="text-black">Simple help desk solution</p>
        </div>
        <Card className="border-sage-200 shadow-lg w-full  hover-lift">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-sage-800">Welcome</CardTitle>
            <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-sage-50">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-sage-50 data-[state=active]:text-white bg-[#52796f] text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-sage-50 data-[state=active]:text-white bg-[#52796f] text-white"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="border-sage-200 focus:border-sage-500 focus:ring-sage-500"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="border-sage-200 focus:border-sage-500 focus:ring-sage-500 pr-10"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-white" />
                        ) : (
                          <Eye className="h-4 w-4 text-white" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link to="/forgot-password" className="text-sm text-sage-600 hover:text-sage-800 underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full hover:bg-[#354f52] shadow-md hover:shadow-lg transition-all bg-[#52796f] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        required
                        className="border-sage-200 focus:border-sage-500 focus:ring-sage-500"
                        value={registerFirstName}
                        onChange={e => setRegisterFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        required
                        className="border-sage-200 focus:border-sage-500 focus:ring-sage-500"
                        value={registerLastName}
                        onChange={e => setRegisterLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="john.doe@company.com"
                      required
                      className="border-sage-200 focus:border-sage-500 focus:ring-sage-500"
                      value={registerEmail}
                      onChange={e => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="registerPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        required
                        className="border-sage-200 focus:border-sage-500 focus:ring-sage-500 pr-10"
                        value={registerPassword}
                        onChange={e => setRegisterPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-white" />
                        ) : (
                          <Eye className="h-4 w-4 text-white" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#52796f] hover:bg-[#354f52] text-white shadow-md hover:shadow-lg transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      {/* </div> */}
      </div>
    </>
  )
}

export default Login;