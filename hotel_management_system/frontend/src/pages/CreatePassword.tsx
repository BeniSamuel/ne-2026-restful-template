import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import PasswordToggle from "../components/PasswordToggle";
import RegistrationLayout from "../layout/registration/Main";

const CreatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("benisamuel566@");
  const [confirmPassword, setConfirmPassword] = useState("benisamuel566@");
  const [hidePassword, setHidePassword] = useState(true);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/login");
  }

  return (
    <RegistrationLayout>
      <form className="space-y-20" onSubmit={handleSubmit}>
        <AuthHeader subtitle="Enter password details below" title="Create Password!" />
        <div className="space-y-9">
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
        <FormButton type="submit">Confirm</FormButton>
      </form>
    </RegistrationLayout>
  );
};

export default CreatePassword;
