const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      />
      <div className="relative bg-neutral-900 rounded-lg shadow-2xl border border-orange-500 max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

export default Modal