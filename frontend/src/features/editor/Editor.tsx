// React
import { useEffect } from "react";

// Hocuspocus, YJS, Tiptap
import { HocuspocusProvider, } from "@hocuspocus/provider";
import * as Y from "yjs";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

// Redux
import { useAppSelector } from "../../app/hooks";
import { type User, useGetProjectPageQuery } from "../api/apiSlice";

// Components
import MenuBar from "./MenuBar";
import { userColor } from "../user/userColor";

const getInitialUser = (user: User) => {
  const userColors = userColor(user.id);
  return {
    name: user.name,
    textColor: userColors.textColor,
    borderColor: userColors.border,
    bgColor: userColors.bg
  };
};

interface IProps {
  pageId: string;
  provider: HocuspocusProvider;
  isAuthenticated: boolean;
  yxmlfragment: Y.XmlFragment;
}

const Editor = ({ pageId, provider, yxmlfragment, isAuthenticated }: IProps) => {

  const { data: page } = useGetProjectPageQuery(Number(pageId));

  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({
        history: false,
        bulletList: {
          itemTypeName: "listItem",
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          itemTypeName: "listItem",
          keepMarks: true,
          keepAttributes: true,
        }
      }),
      Highlight,
      Underline,
      TaskList.configure({
        itemTypeName: "taskItem",
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: "flex gap-2 list-none -ms-4",
        }
      }),
      Placeholder.configure({
        emptyEditorClass: "first:before:content-[attr(data-placeholder)] text-[#CDCDCD] h-0 pointer-events-none float-left",
        placeholder: "Write something...",
      }),
      Image,
      Link.configure({
        linkOnPaste: true,
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Collaboration.configure({
        fragment: yxmlfragment,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: getInitialUser(useAppSelector(state => state.auth.user!)),
        render: (user: Record<string, string>) => {
          const cursor = document.createElement("span");

          cursor.classList.add("tiptap-collaboration-cursor-caret");
          cursor.classList.add(user.borderColor);

          const label = document.createElement("div");

          label.classList.add("tiptap-collaboration-cursor-label");
          label.classList.add(user.bgColor);
          label.classList.add(user.textColor);

          label.insertBefore(document.createTextNode(user.name), null);
          cursor.insertBefore(label, null);

          return cursor;
        }
      }),
    ],
    editorProps: {
      attributes: {
        class: "tiptap ProseMirror-selectednode prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-2 bg-grayscale-100 focus:outline-none min-h-[10rem]",
      },
    },
  });

  useEffect(() => {
    editor?.setEditable(isAuthenticated && provider.authorizedScope !== "readonly");
  }, [editor, isAuthenticated, provider.authorizedScope]);

  return (
    <div className="border border-grayscale-300 rounded">
      {editor?.isEditable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
      <div className="flex justify-between border-t border-grayscale-300 bg-grayscale-100 rounded-b">
        <div className="flex items-center label-text">
          <p className={`${provider.isAuthenticated ? "text-green-200" : "text-red-200"} text-xl ms-2 mr-1 mb-1`}>●</p>
          {provider.isAuthenticated
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ? `${editor?.storage.collaborationCursor.users.length} user${editor?.storage.collaborationCursor.users.length === 1 ? "" : "s"} online editing page ${page !== undefined ? page.name : pageId}`
            : "offline"}
        </div>
      </div>
    </div>
  );
};

export default Editor;
