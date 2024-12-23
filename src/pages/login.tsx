import React, { FormEvent, useState } from "react";
import useAuth from "../services/useAuth.tsx";
import {
  InputLabel,
  Input,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState(localStorage.getItem("login-email") || "");
  const [password, setPassword] = useState(
    localStorage.getItem("login-email") || ""
  );
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    login(formData.get("email") as string, formData.get("password") as string);
  }

  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold ">
          Boulder Problem
        </a>
        <div className="w-full bg-base-100 dark:bg-base-200 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
              Connectez vous
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <TextField
                id="standard-basic"
                label="Votre email"
                fullWidth
                variant="standard"
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <InputLabel htmlFor="standard-adornment-password">
                Mot de passe
              </InputLabel>
              <Input
                id="standard-adornment-password"
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Sign in"
                )}
              </button>
              <p className=" text-red-500 text-center italic">{error}</p>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Vous n'avez pas de compte ?{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Créer un compte
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Login;
