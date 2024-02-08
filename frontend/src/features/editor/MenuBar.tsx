import { Fragment } from "react";
import MenuItem from "./MenuItem";
import { type Editor } from "@tiptap/react";
import OrderedList from "../../icons/OrderedList";
import CheckList from "../../icons/CheckList";
import Heading1 from "../../icons/Heading1";
import Heading2 from "../../icons/Heading2";
import BlockQuote from "../../icons/BlockQuote";
import Paragraph from "../../icons/Paragraph";
import Strike from "../../icons/Strike";
import {
  Bold,
  Code,
  CornerUpLeft,
  CornerUpRight,
  Edit3,
  Italic,
  List,
  Minus,
  Underline
} from "react-feather";
import { EditorInputModal } from "./EditorInputModal";

const MenuBar = ({ editor }: { editor: Editor; }) => {
  const items = [
    {
      icon: Bold,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: Italic,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: Strike,
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      icon: Underline,
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      icon: Edit3,
      title: "Highlight",
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
    },
    {
      type: "divider",
    },
    {
      icon: Heading1,
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      icon: Heading2,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: Paragraph,
      title: "Paragraph",
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive("paragraph"),
    },
    {
      icon: List,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: OrderedList,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      icon: CheckList,
      title: "Task List",
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive("taskList"),
    },
    {
      icon: Code,
      title: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
    {
      type: "divider",
    },
    {
      icon: BlockQuote,
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      icon: Minus,
      title: "Horizontal Rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      title: "Image",
    },
    {
      type: "divider",
    },
    {
      icon: CornerUpLeft,
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: CornerUpRight,
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <div className="flex flex-wrap gap-x-2 p-2 items-center bg-grayscale-100 border-grayscale-300 border-b rounded-t">
      {items.map((item, index) => (
        <Fragment key={index}>
          {item.type === "divider"
            ? <div className="w-px h-8 bg-grayscale-300" />
            : item.title === "Image"
              ? <EditorInputModal iconName={"Image"} title={item.title} modalTitle="Add image URL" modalText="To add images to the editor, type or paste the web address where the image is stored online. The address must end in an extension like .png, .gif, or .jpg." action={(url: string) => {
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }} />
              : <MenuItem {...item} />}
        </Fragment>
      ))
      }
    </div >
  );
};

export default MenuBar;
