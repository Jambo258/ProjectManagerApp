import { Clock, Save, Tag, Trash2, Users } from "react-feather";

type IconType = "Deadline" | "Delete" | "Labels" | "Members" | "Save";

interface IconButtonProps {
    iconName: IconType;
    btnText: string;
    handleOnClick: () => void;
}

export const IconButton = ({iconName, btnText, handleOnClick}: IconButtonProps) => {
  const getIconFromName = (iconName: IconType) => {
    switch (iconName) {
    case "Deadline":
      return <Clock size={20} />;
    case "Delete":
      return <Trash2 size={20} />;
    case "Labels":
      return <Tag size={20} />;
    case "Members":
      return <Users size={20} />;
    case "Save":
      return <Save size={20} />;
    }
  };

  const getAriaLabelText = (iconName: IconType) => {
    switch (iconName) {
    case "Deadline":
      return "Deadline";
    case "Delete":
      return "Delete task";
    case "Labels":
      return "Labels";
    case "Members":
      return "Members";
    case "Save":
      return "Save changes";
    }
  };

  return (
    <button
      type="button"
      onClick={handleOnClick}
      aria-label={getAriaLabelText(iconName)}
      className={`flex px-4 py-2 btn-text-xs ${iconName === "Save" && "bg-success-100 hover:bg-success-200"} ${iconName === "Delete" && "bg-caution-100 hover:bg-caution-200"}`}
    >
      {getIconFromName(iconName)}
      <p className="ms-[6px]">{btnText}</p>
    </button>
  );
};
