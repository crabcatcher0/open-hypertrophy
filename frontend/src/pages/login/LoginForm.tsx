import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCoreApiLogin } from "@/gen";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function LoginForm() {
  let navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const login = useCoreApiLogin({
    mutation: {
      onSuccess(data, variables, context) {
        navigate("/");
      },
    },
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="username"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {login.error && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {
                // @ts-ignore
                login.error.status === 400 && login.error.response.data.detail
              }
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={login.isPending}
            onClick={() => login.mutate({ data: { username, password } })}
          >
            {login.isPending ? "Loading..." : "Login"}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up/" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}