const Modal = ({ children, closeModal }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center">
      <div
        className="absolute top-0 left-0 bg-black/60 w-full h-full"
        onClick={closeModal}
      />
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default Modal;
