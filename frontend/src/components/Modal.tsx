import { type ReactNode, useState } from "react";
import { X } from "react-feather";

interface ModalProps {
    btnText: string;
    btnStyling: string;
    modalTitle: string | null;
    children: ReactNode | ReactNode[];
}

export const Modal = ({ btnText, btnStyling, modalTitle, children}: ModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={btnStyling}>
        {btnText}
      </button>

      {isModalOpen &&
      <section className="">
        <dialog className="">
          <section className="">
            <button
              onClick={closeModal}
              className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0">
              <X size={20}/>
            </button>
            <h3 className="">
              {modalTitle}
            </h3>
          </section>
          <main className="">
            {children}
          </main>
        </dialog>
      </section>
      }
    </>
  );
};
