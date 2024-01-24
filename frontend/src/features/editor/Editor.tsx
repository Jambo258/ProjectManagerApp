import "./editor.css";

import { useEffect, useState } from "react";
import { HocuspocusProvider, } from "@hocuspocus/provider";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import * as Y from "yjs";

import MenuBar from "./MenuBar";
import { useAppSelector } from "../../app/hooks";

const colors = ["#958DF1", "#F98181", "#FBBC88", "#FAF594", "#70CFF8", "#94FADB", "#B9F18D"];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const getInitialUser = (name: string | undefined) => {
  return {
    name: name,
    color: getRandomColor(),
  };
};

interface IProps {
  pageId: string;
}

const BACKEND_WS_URL = (import.meta.env.VITE_BACKEND_URL as string)
  .replace(/(http)(s)?:\/\//, "ws$2://") + "collaboration";

const Editor = ({ pageId }: IProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ydoc] = useState(() => new Y.Doc());
  // useMemo maybe?
  const [provider] = useState(
    () => new HocuspocusProvider({
      url: BACKEND_WS_URL,
      name: pageId,
      document: ydoc,
      token: "token",
      onAuthenticated: () => setIsAuthenticated(true),
      onAuthenticationFailed: () => setIsAuthenticated(false),
      connect: true,
    })
  );

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
      TaskList.configure({
        itemTypeName: "taskItem",
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: "tiptap-task-item",
        }
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: getInitialUser(useAppSelector(state => state.auth.user?.name)),
      }),
    ],
    editorProps: {
      attributes: {
        class: "tiptap prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-2 bg-grayscale-100 focus:outline-none min-h-[10rem]",
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
            ? `${editor?.storage.collaborationCursor.users.length} user${editor?.storage.collaborationCursor.users.length === 1 ? "" : "s"} online editing page ${pageId}`
            : "offline"}
        </div>
      </div>
    </div>
  );
};

export default Editor;
