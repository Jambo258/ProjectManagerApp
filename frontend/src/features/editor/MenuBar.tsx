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
      name: "B",
      icon: Bold,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      name: "i",
      icon: Italic,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      name: "A̶B̶",
      icon: Strike,
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      name: "U",
      icon: Underline,
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      name: "hi",
      icon: Edit3,
      title: "Highlight",
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
    },
    {
      type: "divider",
    },
    {
      name: "H1",
      icon: Heading1,
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      name: "H2",
      icon: Heading2,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      name: "P",
      icon: Paragraph,
      title: "Paragraph",
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive("paragraph"),
    },
    {
      name: "•li",
      icon: List,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      name: "li",
      icon: OrderedList,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      name: "☑li",
      icon: CheckList,
      title: "Task List",
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive("taskList"),
    },
    {
      name: "▣",
      icon: Code,
      title: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
    {
      type: "divider",
    },
    {
      name: "\"\"",
      icon: BlockQuote,
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      name: "――",
      icon: Minus,
      title: "Horizontal Rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      name: "image",
      title: "Image",
    },
    {
      type: "divider",
    },
    // {
    //   name: "text-wrap",
    //   title: "Hard Break",
    //   action: () => editor.chain().focus().setHardBreak().run(),
    // },
    // {
    //   name: "format-clear",
    //   title: "Clear Format",
    //   action: () => editor.chain().focus().clearNodes().unsetAllMarks()
    //     .run(),
    // },
    // {
    //   type: "divider",
    // },
    {
      name: "<",
      icon: CornerUpLeft,
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      name: ">",
      icon: CornerUpRight,
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <div className="flex flex-wrap gap-x-2 p-2 items-center bg-grayscale-100 border-grayscale-300 border-b rounded-t">
      {items.map((item, index) => (
        <Fragment key={index}>
          {item.type === "divider" ? <div className="w-px h-8 bg-grayscale-300" />
            : item.name === "image" ? <EditorInputModal iconName={"Image"} title={item.title} modalTitle="Add image URL" modalText="To add images to the editor, type or paste the web address where the image is stored online. The address must end in an extension like .png, .gif, or .jpg." action={(url: string) => {
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
