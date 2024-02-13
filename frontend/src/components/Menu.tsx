import { type ReactNode, useState, useRef, useEffect } from "react";
import { MoreVertical } from "react-feather";

interface MenuProps {
  btnPosition: string;
  menuPosition: string;
  children: ReactNode[];
}

export const Menu = ({ btnPosition, menuPosition, children }: MenuProps) => {
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

    const closeOnEscapePressed = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("keydown", closeOnEscapePressed);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", closeOnEscapePressed);
    };
  }, []);

  return (
    <section
      ref={menuRef}
      className={`${btnPosition} flex flex-col place-items-end`}
    >

      <button
        className="max-w-fit h-fit p-0 bg-grayscale-0 hover:bg-grayscale-0"
        onClick={toggleMenu}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          setIsMenuOpen(false);
        }}
      >
        <MoreVertical size={20} />
      </button>

      {isMenuOpen &&
        <dialog className={`${menuPosition} mt-1 w-fit flex flex-col z-30 border-2 border-grayscale-200 shadow-md rounded overflow-x-hidden overflow-y-auto outline-none focus:outline-none`}>
          <section className="grid grid-cols-1 divide-y divide-grayscale-200">
            {children.map((child, index) => {
              return (
                child ?
                  <section
                    key={index}
                    className="py-0 heading-xs text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
                  >
                    {child}
                  </section>
                  : null
              );
            })}
          </section>
        </dialog>}

    </section>
  );
};
