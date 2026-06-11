import { FiEyeOff } from "react-icons/fi";

type PasswordToggleProps = {
  hidden: boolean;
  onClick: () => void;
};

const PasswordToggle = ({ hidden, onClick }: PasswordToggleProps) => (
  <button
    aria-label={hidden ? "Show password" : "Hide password"}
    className="ml-3 text-black"
    onClick={onClick}
    type="button"
  >
    <FiEyeOff aria-hidden="true" size={24} />
  </button>
);

export default PasswordToggle;
