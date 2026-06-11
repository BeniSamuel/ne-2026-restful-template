import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import PasswordToggle from "../components/PasswordToggle";
import { authApi } from "../api/auth.api";
import RegistrationLayout from "../layout/registration/Main";
import { useUserStore } from "../store/user.store";
import { FcGoogle } from "react-icons/fc";
import { FiCheck } from "react-icons/fi";
import { isEmail, isStrongEnoughPassword } from "../utils/validators";

const Login = () => {
  const navigate = useNavigate();
  const rememberMe = useUserStore((state) => state.rememberMe);
  const setRememberMe = useUserStore((state) => state.setRememberMe);
  const [email, setEmail] = useState("admin@tzw.test");
  const [password, setPassword] = useState("Admin123!");
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  function fillAdminDemo() {
    setEmail("admin@tzw.test");
    setPassword("Admin123!");
    toast.success("Admin demo credentials filled");
  }

  function fillInspectorDemo() {
    setEmail("inspector@tzw.test");
    setPassword("Inspector123!");
    toast.success("Inspector demo credentials filled");
  }

  function fillUserDemo() {
    setEmail("user@tzw.test");
    setPassword("User123!");
    toast.success("User demo credentials filled");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isEmail(email) || !isStrongEnoughPassword(password)) {
      toast.error("Enter a valid email and a password with at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await authApi.login({ email, password });
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RegistrationLayout>
      <motion.form
        animate={{ opacity: 1, y: 0 }}
        className="space-y-20"
        initial={{ opacity: 0, y: 18 }}
        onSubmit={handleSubmit}
      >
        <AuthHeader subtitle="Access inspections, maintenance and reports" title="TZW Safety Login" />

        <div className="space-y-9">
          <FormInput label="Email" onChange={setEmail} type="email" value={email} />
          <div>
            <FormInput
              label="Password"
              onChange={setPassword}
              rightElement={<PasswordToggle hidden={hidePassword} onClick={() => setHidePassword((value) => !value)} />}
              type={hidePassword ? "password" : "text"}
              value={password}
            />
            <div className="mt-5 flex items-center justify-between gap-4 text-base">
              <label className="flex items-center gap-3 font-medium">
                <input checked={rememberMe} className="hidden" onChange={(event) => setRememberMe(event.target.checked)} type="checkbox" />
                <span className="flex h-5 w-5 items-center justify-center rounded-sm border border-black">
                  {rememberMe ? <FiCheck aria-hidden="true" size={16} /> : null}
                </span>
                Remember me
              </label>
              <Link className="font-medium text-black/45" to="/forgot-password">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <FormButton disabled={loading} type="submit">
            {loading ? "Logging in..." : "Log in"}
          </FormButton>
          <FormButton onClick={() => toast("External login is disabled for the exam demo")} variant="soft">
            <FcGoogle aria-hidden="true" size={18} /> External login disabled
          </FormButton>
          <div className="grid gap-3 text-sm font-semibold text-black/45">
            <button className="hover:text-black" onClick={fillAdminDemo} type="button">Fill admin demo credentials</button>
            <button className="hover:text-black" onClick={fillInspectorDemo} type="button">Fill inspector demo credentials</button>
            <button className="hover:text-black" onClick={fillUserDemo} type="button">Fill user demo credentials</button>
          </div>
        </div>

        <p className="text-center text-base font-medium text-black/45">
          Don&apos;t have an account?{" "}
          <Link className="text-black" to="/signup">
            Sign up
          </Link>
        </p>
      </motion.form>
    </RegistrationLayout>
  );
};

export default Login;
