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
import { DeleteModal } from "../../components/DeleteModal";

interface Component {
  type: "editor" | "kanban" | "calendar";
  uuid: string;
}

const BACKEND_WS_URL = (import.meta.env.VITE_BACKEND_URL as string)
  .replace(/(http)(s)?:\/\//, "ws$2://") + "collaboration";

export const PageWrapper = ({ pageId }: { pageId: string; }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [componentId, setComponentId] = useState("");
  const [componentType, setComponentType] = useState("");
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
        console.log("moiving up", uuid);
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

  // yarray.delete(0, yarray.length);

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
      <section className="flex flex-col gap-6 pb-4 sm:pb-6">
        <section className="h-fit w-full flex flex-row justify-end">
          <Modal modalTitle="Add component" btnStyling="py-2 btn-text-xs" btnText={"Add component"} btnIcon={<Plus size={18} />}>
            <AddComponentModal createComponent={addComponent} />
          </Modal>
        </section>

        {components.map((component, index) =>
          <article
            key={component.uuid}
            // use this when we find solution for mobile devices
            // className="group"
          >
            <section
            // invisible group-active:visible <- use this when we find solution for mobile devices
              className="w-full mb-1 inline-flex justify-between gap-x-2 [&>button]:py-1 [&>button]:bg-grayscale-0 hover:[&>button]:bg-grayscale-300"
            >
              <button
                title="Move Component Up"
                disabled={index === 0}
                onClick={() => moveComponentUp(component.uuid)}
                className="px-2 disabled:opacity-30 disabled:hover:bg-grayscale-0"
              >
                <ChevronUp size={22} />
              </button>
              <button
                title="Move Component Down"
                disabled={index === components.length - 1}
                onClick={() => moveComponentDown(component.uuid)}
                className="px-2 disabled:opacity-30 disabled:hover:bg-grayscale-0"
              >
                <ChevronDown size={22} />
              </button>
              <button
                title="Delete Component"
                onClick={() => {
                  setComponentId(component.uuid);
                  setComponentType(component.type);
                  setIsConfirmDeleteOpen(true);
                }}
                className="ms-auto px-3"
              >
                <Trash2 size={18} />
              </button>
            </section>
            {getComponent(component)}
          </article>
        )}
      </section>

      {isConfirmDeleteOpen && (
        <DeleteModal
          setConfirmDeleteEdit={setIsConfirmDeleteOpen}
          confirmDeleteEdit={isConfirmDeleteOpen}
          handleSubmitForModal={() => {
            if (componentId !== "" ) return deleteComponent(componentId);
          }}
          deleteModalText={`Are you sure you want to delete this ${componentType} component?`}
        />
      )}
    </>
  );
};
