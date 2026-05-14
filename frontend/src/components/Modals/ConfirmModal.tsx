import { IoMdClose } from "react-icons/io";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  isLoading?: boolean;
  type?: "danger" | "warning";
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  isLoading,
  type,
}: ConfirmModalProps) => {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md shadow-sm relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          type="button"
          className="text-black cursor-pointer absolute top-5 right-5"
        >
          <IoMdClose className="w-6 h-6" />
        </button>

        {/* Title */}
        <h1 className="font-semibold text-gray-900 mb-2">{title}</h1>

        {/* Description */}
        <p className="text-base text-gray-500 mb-6">{description}</p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            type="button"
            className="w-full h-11 border border-gray-300 text-gray-600 text-base font-medium rounded-md hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            type="button"
            className={`w-full h-11 text-base font-medium rounded-md transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-white ${type === "danger" ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}`}
          >
            {isLoading ? "Loading..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
