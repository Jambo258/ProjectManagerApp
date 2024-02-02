import { useContext } from "react";
import { ModalContext } from "../../components/Modal";

interface Component {
  name: string,
  type: "editor" | "kanban" | "calendar";
  description: string,
  btnTxt: string
}

interface AddComponentModalProps {
  addComponent: (type: string) => void
}

const components: Component[] = [
  {
    name: "Kanban board",
    type: "kanban",
    description: "Visualize and manage project wih an interactive Kanban board.",
    btnTxt: "Add kanban board"
  },
  {
    name: "Text editor",
    type: "editor",
    description: "Create and edit content effortlessly with an interactive text editor.",
    btnTxt: "Add text editor"
  },
  {
    name: "Calendar",
    type: "calendar",
    description: "Stay organized and plan your meetings effectively with a calendar.",
    btnTxt: "Add calendar"
  }
];

export const AddComponentModal = ({addComponent}: AddComponentModalProps) => {
  const {closeModal} = useContext(ModalContext);

  const handleClick = (type: string) => {
    addComponent(type);
    closeModal();
  };

  const componentItem = (index: number, component: Component) => {
    return (
      <section key={index} className="w-[48%] sm:w-[31%] max-w-[300px] flex flex-col gap-2 items-stretch text-left mb-4">
        <div className="w-full aspect-[4/3] bg-grayscale-300" />
        <h4 className="heading-xs px-1">
          {component.name}
        </h4>
        <p className="body-text-sm mb-2 px-1 min-h-16">
          {component.description}
        </p>
        <button className="py-2 btn-text-xs"
          onClick={() => handleClick(component.type)}>
          {component.btnTxt}
        </button>
      </section>
    );
  };
  
  return (
    <section className="flex flex-row flex-wrap gap-[3%] w-full overflow-auto">
      {components.map((component, index) => componentItem(index, component))}     
    </section>
  );
};
