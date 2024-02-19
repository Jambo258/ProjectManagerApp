import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
import { useGetProjectQuery } from "../api/apiSlice";
import { useAppSelector } from "../../app/hooks";

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

  const projectId = parseInt(useParams().projectId!);
  const { data: project } = useGetProjectQuery(projectId);
  const userId = useAppSelector(state => state.auth.user?.id);

  const isUserViewer = useMemo(() =>
    project?.users.some(user => user.id === userId && user.role === "viewer") ?? true
  ,[project, userId]);

  const yarray = ydoc.getArray<Component>("components");
  const ymap = ydoc.getMap<Y.XmlFragment | Y.Map<Event> | Y.Map<Y.Array<Task> | Y.Array<Column> | Y.Array<Labels>>>();

  useEffect(() => {
    const ycomponents = ydoc.getArray<Component>("components");
    setComponents(ycomponents.toArray());

    ycomponents.observe(() => {
      const uniqueIds = new Set();
      const componentsArray = ycomponents.toArray();
      ydoc.transact(() => {
        for (let i = componentsArray.length - 1; i >= 0; i--) {
          const item = componentsArray[i];
          if (uniqueIds.has(item.uuid)) {
            ycomponents.delete(i);
          } else {
            uniqueIds.add(item.uuid);
          }
        }
      });
      setComponents(ycomponents.toArray());
    });
  }, [ydoc]);

  const addComponent = (type: string) => {
    const uuid = nanoid();
    if (type === "editor") {
      ydoc.transact(() => {
        ymap.set(uuid, new Y.XmlFragment());
        yarray.push([{ type, uuid }]);
      });
    } else if (type === "kanban") {
      ydoc.transact(() => {
        const kanbanMap = ymap.set(uuid, new Y.Map<Y.Array<Task> | Y.Array<Column> | Y.Array<Labels>>());
        kanbanMap.set("tasks", new Y.Array<Task>);
        kanbanMap.set("columns", new Y.Array<Column>);
        kanbanMap.set("labels", new Y.Array<Labels>);
        yarray.push([{ type, uuid }]);
      });
    } else if (type === "calendar") {
      ydoc.transact(() => {
        ymap.set(uuid, new Y.Map<Event>);
        yarray.push([{ type, uuid }]);
      });
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
    const componentsArray = yarray.toArray();
    const index = componentsArray.findIndex((component) => component.uuid === uuid);
    if( index !== -1 && index !== 0) {
      ydoc.transact(() => {
        yarray.delete(index);
        yarray.insert(index-1, [componentsArray[index]]);
      });
    }
  };

  const moveComponentDown = (uuid: string) => {
    const componentsArray = yarray.toArray();
    const index = componentsArray.slice(0,-1).findIndex((component) => component.uuid === uuid);
    if( index !== -1) {
      ydoc.transact(() => {
        yarray.delete(index);
        yarray.insert(index+1, [componentsArray[index]]);
      });
    }
  };

  const getComponent = (component: Component) => {
    const yContent = ymap.get(component.uuid);
    if (!yContent) {
      return <p>Missing content in ymap</p>;
    } else if (component.type === "editor" && yContent instanceof Y.XmlFragment) {
      return <Editor key={component.uuid} pageId={pageId} provider={provider} yxmlfragment={yContent} isAuthenticated={isAuthenticated} />;
    } else if (component.type === "kanban" && yContent instanceof Y.Map) {
      return <Kanban ykanban={yContent as Y.Map<Y.Array<Task> | Y.Array<Column> | Y.Array<Labels>>} />;
    } else if (component.type === "calendar" && yContent instanceof Y.Map) {
      return <Calendar yevents={yContent as Y.Map<Event>} />;
    } else {
      return <p>Unknown component type = {component.type}</p>;
    }
  };

  return (
    <>
      <section className="flex flex-col gap-6 pb-4 sm:pb-6">
        {!isUserViewer &&
        <section className="h-fit w-full flex flex-row justify-end">
          <Modal modalTitle="Add component" btnStyling="py-2 btn-text-xs" btnText={"Add component"} btnIcon={<Plus size={18} />}>
            <AddComponentModal createComponent={addComponent} />
          </Modal>
        </section>
        }

        {components.map((component, index) =>
          <article
            key={component.uuid}
            // use this when we find solution for mobile devices
            // className="group"
          >
            {!isUserViewer &&
            <section
            // invisible group-active:visible <- use this when we find solution for mobile devices
              className="w-full px-1 mb-1 inline-flex justify-between gap-x-2 [&>button]:py-1 [&>button]:bg-grayscale-0 hover:[&>button]:bg-grayscale-300"
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
            }
            {getComponent(component)}
          </article>
        )}
      </section>

      {isConfirmDeleteOpen && (
        <DeleteModal
          setConfirmDeleteEdit={setIsConfirmDeleteOpen}
          confirmDeleteEdit={isConfirmDeleteOpen}
          handleSubmitForModal={() => {
            if (componentId !== "") return deleteComponent(componentId);
          }}
          deleteModalText={`Are you sure you want to delete this ${componentType} component?`}
        />
      )}
    </>
  );
};
