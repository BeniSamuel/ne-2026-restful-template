import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormButton from "../components/FormButton";
import RegistrationLayout from "../layout/registration/Main";

const VerifyCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/create-password");
  }

  return (
    <RegistrationLayout>
      <form className="space-y-20" onSubmit={handleSubmit}>
        <AuthHeader subtitle="Enter code sent on your email below" title="Fill in your code!" />
        <input
          className="mx-auto block w-full max-w-[520px] border-b-2 border-black bg-transparent pb-3 text-center text-3xl font-semibold tracking-[1.2rem] outline-none"
          maxLength={6}
          onChange={(event) => setCode(event.target.value)}
          value={code}
        />
        <FormButton type="submit">Continue</FormButton>
      </form>
    </RegistrationLayout>
  );
};

export default VerifyCode;
