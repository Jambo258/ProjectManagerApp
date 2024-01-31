import { type ReactNode, useState, useRef, useEffect } from "react";
import { MoreVertical } from "react-feather";

interface MenuProps {
  children: ReactNode[];
}

export const TaskModal = ({ children }: MenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section
      ref={menuRef}
      className="relative right-6 flex flex-col place-items-end"
    >
      <button
        className="max-w-fit py-0 px-2 mb-1 bg-grayscale-0 hover:bg-grayscale-0"
        onClick={toggleMenu}
      >
        <MoreVertical size={20} />
      </button>

      {isMenuOpen && (
        <dialog className="w-16 absolute right-10 top-7 flex border-2 z-30 border-grayscale-200 shadow-md rounded outline-none focus:outline-none">
          <section className="grid grid-cols-1 divide-y divide-grayscale-200">
            {children.map((child, index) => {
              return (
                <section
                  key={index}
                  className="py-0 ps-1 pe-4 heading-xs text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
                >
                  {child}
                </section>
              );
            })}
          </section>
        </dialog>
      )}
    </section>
  );
};