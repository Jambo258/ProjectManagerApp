import { useEffect, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider, } from "@hocuspocus/provider";

import Editor from "../editor/Editor";
import { nanoid } from "@reduxjs/toolkit";
import { type Column, Kanban, type Labels, type Task } from "../kanban/Kanban";
import { AddComponentModal } from "./AddComponentModal";
import { Modal } from "../../components/Modal";
import { Plus, ChevronDown, ChevronUp, Trash2 } from "react-feather";
import Calendar, { type Event } from "../calendar/Calendar";

interface Component {
  type: "editor" | "kanban" | "calendar";
  uuid: string;
}

const BACKEND_WS_URL = (import.meta.env.VITE_BACKEND_URL as string)
  .replace(/(http)(s)?:\/\//, "ws$2://") + "collaboration";

export const PageWrapper = ({ pageId }: { pageId: string; }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [components, setComponents] = useState<Component[]>([]);
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

  const yarray = ydoc.getArray<Component>("components");
  const ymap = ydoc.getMap<Y.XmlFragment | Y.Array<Event> | Y.Map<Y.Array<Task> | Y.Array<Column> | Y.Array<Labels>>>();

  useEffect(() => {
    const yarray = ydoc.getArray<Component>("components");
    yarray.observe(() => {
      setComponents(yarray.toArray());
    });
  }, [ydoc]);

  const addComponent = (type: string) => {
    const uuid = nanoid();
    if (type === "editor") {
      ymap.set(uuid, new Y.XmlFragment());
      yarray.push([{ type, uuid }]);
    } else if (type === "kanban") {
      const kanbanMap = ymap.set(uuid, new Y.Map<Y.Array<Task> | Y.Array<Column> | Y.Array<Labels>>());
      kanbanMap.set("tasks", new Y.Array<Task>);
      kanbanMap.set("columns", new Y.Array<Column>);
      kanbanMap.set("labels", new Y.Array<Labels>);
      yarray.push([{ type, uuid }]);
    } else if (type === "calendar") {
      yarray.push([{ type, uuid }]);
      ymap.set(uuid, new Y.Array<Event>);
    }
  };

  const deleteComponent = (uuid: string) => {
    ymap.delete(uuid);
    yarray.forEach((component, i) => {
      if (component.uuid === uuid) {
        yarray.delete(i, 1);
      }
    });
  };

  const moveComponentUp = (uuid: string) => {
    yarray.forEach((component, i) => {
      if (i === 0) {
        return;
      }
      if (component.uuid === uuid) {
        yarray.delete(i, 1);
        yarray.insert(i - 1, [component]);
      }
    });
  };

  const moveComponentDown = (uuid: string) => {
    yarray.forEach((component, i) => {
      if (i === yarray.length - 1) {
        return;
      }
      if (component.uuid === uuid) {
        yarray.delete(i, 1);
        yarray.insert(i + 1, [component]);
      }
    });
  };

  const getComponent = (component: Component) => {
    const yContent = ymap.get(component.uuid);
    if (!yContent) {
      return <p>Missing content in ymap</p>;
    } else if (component.type === "editor" && yContent instanceof Y.XmlFragment) {
      return <Editor key={component.uuid} pageId={pageId} provider={provider} yxmlfragment={yContent} isAuthenticated={isAuthenticated} />;
    } else if (component.type === "kanban" && yContent instanceof Y.Map) {
      return <Kanban ykanban={yContent} />;
    } else if (component.type === "calendar" && yContent instanceof Y.Array) {
      return <Calendar yevents={yContent} />;
    } else {
      return <p>Unknown component type = {component.type}</p>;
    }
  };

  return (
    <>
      <section className="flex flex-col gap-1">
        <section className="h-fit w-full flex flex-row justify-end">
          <Modal modalTitle="Add component" btnStyling="py-2 btn-text-xs" btnText={"Add component"} btnIcon={<Plus size={18} />}>
            <AddComponentModal createComponent={addComponent} />
          </Modal>
        </section>

        {components.map((component) =>
          <article
            key={component.uuid}
            // className="group"
          >
            {/* invisible group-active:visible <- use this when we find solution for mobile devices */}
            <section className={"w-full px-1 mb-1 inline-flex justify-between gap-x-2 [&>button]:py-1 [&>button]:bg-grayscale-0"}>
              <button
                title="Move Up"
                onClick={() => moveComponentUp(component.uuid)}
                className="px-2"
              >
                <ChevronUp size={22} />
              </button>
              <button
                title="Move Down"
                onClick={() => moveComponentDown(component.uuid)}
                className="me-auto px-2"
              >
                <ChevronDown size={22} />
              </button>
              <button
                title="Delete Component"
                onClick={() => deleteComponent(component.uuid)}
                className="px-3"
              >
                <Trash2 size={18} />
              </button>
            </section>
            {getComponent(component)}
          </article>
        )}
      </section>
    </>
  );
};
