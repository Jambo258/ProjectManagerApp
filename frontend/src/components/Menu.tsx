import {ReactNode, useState, useRef, useEffect} from "react";
import { X, MoreVertical } from "react-feather";

interface MenuProps {
    children: ReactNode[];
}

export const Menu = ({children}: MenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
    <section ref={menuRef} className="flex flex-col place-items-end fixed right-6">
      <button className="max-w-fit py-0 px-2 mb-1 bg-grayscale-0 hover:bg-grayscale-0"
        onClick={toggleMenu}>
        <MoreVertical size={20} />
      </button>
      {isMenuOpen ? (
        <dialog className="w-fit relative flex flex-col z-30 border-[1px] border-grayscale-200 shadow-md rounded overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <section className="flex w-full justify-end">
            <button
              onClick={closeMenu}
              className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0">
              <X size={20}/>
            </button>
          </section>
          <section className="grid-cols-1">
            {children.map((child) => {
              return  <>
                <hr className="border-grayscale-300"/>
                <button type="button" className="py-0 ps-1 pe-4 heading-xs text-dark-font bg-grayscale-0 hover:bg-grayscale-0">{child}</button>
              </>;
            })}
          </section>
        </dialog>
      ) : null}
    </section>
  );
};
