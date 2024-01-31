import { Clock, Save, Tag, Trash2, Users } from "react-feather";

export type IconType = "Deadline" | "Delete" | "Labels" | "Members" | "Save" | "none";

type ButtonType = "button" | "reset" | "submit";

interface IconButtonProps {
    btnType?: ButtonType;
    iconName: IconType;
    btnText: string;
    handleOnClick: () => void;
}

export const IconButton = ({iconName, btnText, btnType = "button", handleOnClick}: IconButtonProps) => {
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
    case "none":
      return;
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
    case "none":
      return btnText;
    }
  };

  return (
    <button
      type={btnType}
      onClick={handleOnClick}
      aria-label={getAriaLabelText(iconName)}
      className={`w-full px-4 pt-2 pb-1 btn-text-xs ${iconName === "Save" && "bg-success-100 hover:bg-success-200"} ${iconName === "Delete" && "bg-caution-100 hover:bg-caution-200"} ${iconName === "none" ? "sm:text-center" : "sm:text-left"}`}
    >
      <span className="inline-flex">
        {getIconFromName(iconName)}
        <p className={`ms-[6px] ${iconName === "none" ? "visible" : "hidden"} sm:inline-block`}>{btnText}</p>
      </span>
    </button>
  );
};
