import { Clock, Save, Tag, Trash2, Users, Edit2 } from "react-feather";

export type IconType = "Edit"| "Deadline" | "Delete" | "Labels" | "Members" | "Save" | "none";

type ButtonType = "button" | "reset" | "submit";

interface IconButtonProps {
    btnType?: ButtonType;
    iconName: IconType;
    btnText?: string;
    handleOnClick: () => void;
}

export const IconButton = ({iconName, btnText = "", btnType = "button", handleOnClick}: IconButtonProps) => {
  const getIconFromName = (iconName: IconType) => {
    switch (iconName) {
    case "Edit":
      return <Edit2 size={20} />;
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
    case "Edit":
      return "Edit";
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
      className={`btn-text-xs ${
        iconName === "Save" && "bg-success-100 hover:bg-success-200"
      } ${iconName === "Delete" && "bg-caution-100 hover:bg-caution-200"} ${
        iconName === "none" ? "sm:text-center pb-1.5" : "sm:text-left"
      } ${iconName === "Edit" && "bg-grayscale-0 hover:bg-grayscale-0"} ${
        btnText === "" ? "w-fit h-fit p-1 pb-0 place-items-center" : "w-full px-4 pt-2 pb-1"}`}
    >
      <span className="inline-flex">
        {getIconFromName(iconName)}
        <p
          className={`${
            iconName === "none" ? "visible" : "hidden"} ${
            btnText === "" ? "hidden" : "ms-[6px] visible"
          } sm:inline-block`}
        >
          {btnText}
        </p>
      </span>
    </button>
  );
};
