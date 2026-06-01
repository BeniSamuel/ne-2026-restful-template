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
import { FcGoogle } from "react-icons/fc";
import { isEmail, isStrongEnoughPassword, required } from "../utils/validators";

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Beni");
  const [lastName, setLastName] = useState("Samuel");
  const [email, setEmail] = useState("benisamuel566@gmail.com");
  const [password, setPassword] = useState("benisamuel566@");
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!required(firstName) || !required(lastName) || !isEmail(email) || !isStrongEnoughPassword(password)) {
      toast.error("Fill all fields with a valid email and password");
      return;
    }

    setLoading(true);
    try {
      await authApi.signup({ email, firstName, lastName, password });
      toast.success("Account created. You can log in now.");
      navigate("/login");
    } catch {
      toast.error("Signup failed. The email may already exist.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RegistrationLayout>
      <motion.form
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16"
        initial={{ opacity: 0, y: 18 }}
        onSubmit={handleSubmit}
      >
        <AuthHeader subtitle="Enter your details below" title="Welcome Back!" />

        <div className="space-y-9">
          <FormInput label="First name" onChange={setFirstName} value={firstName} />
          <FormInput label="Last name" onChange={setLastName} value={lastName} />
          <FormInput label="Email" onChange={setEmail} type="email" value={email} />
          <FormInput
            label="Password"
            onChange={setPassword}
            rightElement={<PasswordToggle hidden={hidePassword} onClick={() => setHidePassword((value) => !value)} />}
            type={hidePassword ? "password" : "text"}
            value={password}
          />
        </div>

        <div className="space-y-5">
          <FormButton disabled={loading} type="submit">
            {loading ? "Creating account..." : "Sign up"}
          </FormButton>
          <FormButton onClick={() => toast("Google signup is a placeholder for exam templates")} variant="soft">
            <FcGoogle aria-hidden="true" size={18} /> Sign up with Google
          </FormButton>
        </div>

        <p className="text-center text-base font-medium text-black/45">
          Already on the platform?{" "}
          <Link className="text-black" to="/login">
            Log in
          </Link>
        </p>
      </motion.form>
    </RegistrationLayout>
  );
};

export default Signup;
