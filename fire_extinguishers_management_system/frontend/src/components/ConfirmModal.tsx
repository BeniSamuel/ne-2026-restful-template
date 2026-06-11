import { motion } from "framer-motion";
import FormButton from "./FormButton";

type ConfirmModalProps = {
  confirmText?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
};

const ConfirmModal = ({ confirmText = "Confirm", message, onCancel, onConfirm, open, title }: ConfirmModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-[24px] bg-white p-7 shadow-2xl"
        initial={{ opacity: 0, scale: 0.96 }}
      >
        <h3 className="text-xl font-bold text-black">{title}</h3>
        <p className="mt-4 text-sm font-medium leading-6 text-black/55">{message}</p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <FormButton className="h-12" onClick={onCancel} variant="soft">
            Close
          </FormButton>
          <FormButton className="h-12" onClick={onConfirm}>
            {confirmText}
          </FormButton>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmModal;
