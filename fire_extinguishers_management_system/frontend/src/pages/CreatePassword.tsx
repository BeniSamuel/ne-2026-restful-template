import { FormEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import AuthHeader from "../components/AuthHeader";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import PasswordToggle from "../components/PasswordToggle";
import RegistrationLayout from "../layout/registration/Main";
import { authApi } from "../api/auth.api";
import { isStrongEnoughPassword } from "../utils/validators";

const CreatePassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("Inspector123!");
  const [confirmPassword, setConfirmPassword] = useState("Inspector123!");
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token.trim()) {
      toast.error("Setup token is required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!isStrongEnoughPassword(password)) {
      toast.error("Password must have at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await authApi.setupPassword({ token, password, confirmPassword });
      toast.success("Password setup completed. You can log in now.");
      navigate("/login");
    } catch {
      toast.error("Password setup failed. The token may be invalid, expired or already used.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RegistrationLayout>
      <form className="space-y-12" onSubmit={handleSubmit}>
        <AuthHeader subtitle="Activate your invited inspector account" title="Setup Password" />
        <div className="space-y-8">
          <FormInput label="Setup Token" onChange={setToken} value={token} />
          <FormInput
            label="Create Password"
            onChange={setPassword}
            rightElement={<PasswordToggle hidden={hidePassword} onClick={() => setHidePassword((value) => !value)} />}
            type={hidePassword ? "password" : "text"}
            value={password}
          />
          <FormInput
            label="Confirm Password"
            onChange={setConfirmPassword}
            rightElement={<PasswordToggle hidden={hidePassword} onClick={() => setHidePassword((value) => !value)} />}
            type={hidePassword ? "password" : "text"}
            value={confirmPassword}
          />
        </div>
        <FormButton disabled={loading} type="submit">
          {loading ? "Activating..." : "Activate account"}
        </FormButton>
      </form>
    </RegistrationLayout>
  );
};

export default CreatePassword;
