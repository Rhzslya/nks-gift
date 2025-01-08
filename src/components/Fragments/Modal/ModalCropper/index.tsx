"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  useState,
  useRef,
  MouseEventHandler,
  ReactNode,
  useEffect,
} from "react";

const ModalCropper = ({
  children,
  onClose,
  escClosable = true,
}: {
  children: ReactNode;
  onClose: () => void;
  escClosable?: boolean;
}) => {
  const overlay = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (escClosable) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsClosing(true);
          setTimeout(() => onClose(), 300);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [escClosable, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const close: MouseEventHandler = (e) => {
    if (e.target === overlay.current) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={overlay}
        className="absolute inset-0 z-50 bg-black/60 place-content-center"
        onClick={close}
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isClosing ? 0 : 1, scale: isClosing ? 0 : 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-lg shadow-lg p-6 bg-white max-w-[40%] m-auto "
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalCropper;
