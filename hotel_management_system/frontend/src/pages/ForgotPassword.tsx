import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import RegistrationLayout from "../layout/registration/Main";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("benisamuel566@gmail.com");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/verify-code");
  }

  return (
    <RegistrationLayout>
      <form className="space-y-20" onSubmit={handleSubmit}>
        <AuthHeader subtitle="Enter your details below" title="Provide your email!" />
        <FormInput label="Email" onChange={setEmail} type="email" value={email} />
        <FormButton type="submit">Continue</FormButton>
      </form>
    </RegistrationLayout>
  );
};

export default ForgotPassword;
