import { Fragment, useEffect, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider, } from "@hocuspocus/provider";

import Editor from "../editor/Editor";
import { nanoid } from "@reduxjs/toolkit";
import { type Column, Kanban, type Label, type Task } from "../kanban/Kanban";

interface Component {
  type: "editor" | "kanban";
  uuid: string;
}

const BACKEND_WS_URL = (import.meta.env.VITE_BACKEND_URL as string)
  .replace(/(http)(s)?:\/\//, "ws$2://") + "collaboration";

export const PageWrapper = ({pageId}: {pageId: string}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [values, setValues] = useState<Component[]>([]);
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
  const ymap = ydoc.getMap<Y.XmlFragment | Y.Map<Y.Array<Task> | Y.Array<Column> | Y.Array<Label>>>();

  useEffect(() => {
    const yarray = ydoc.getArray<Component>("components");
    yarray.observe(() => {
      setValues(yarray.toArray());
    });
  },[ydoc]);


  const addComponent = (type = "kanban") => {
    const uuid = nanoid();
    if(type === "editor") {
      ymap.set(uuid, new Y.XmlFragment());
      yarray.push([{type, uuid}]);
    } else if(type === "kanban") {
      const kanbanMap = ymap.set(uuid, new Y.Map<Y.Array<Task> | Y.Array<Column> | Y.Array<Label>>());
      kanbanMap.set("tasks", new Y.Array<Task>);
      kanbanMap.set("columns", new Y.Array<Column>);
      kanbanMap.set("labels", new Y.Array<Label>);
      yarray.push([{type, uuid}]);
    }
  };

  const deleteComponent = (uuid: string) => {
    ymap.delete(uuid);
    yarray.forEach((component,i) => {
      if( component.uuid === uuid) {
        yarray.delete(i,1);
      }
    });
  };

  const moveComponent = (uuid: string) => {
    yarray.forEach((component,i) => {
      if(i === 0) {
        return;
      }
      if( component.uuid === uuid) {
        console.log("moiving up", uuid);
        yarray.delete(i,1);
        yarray.insert(i-1, [component]);
      }
    });
  };

  // yarray.delete(0, yarray.length);

  const getComponent = (component: Component) => {
    const yContent = ymap.get(component.uuid);
    if(!yContent) {
      return <p>Missing content in ymap</p>;
    }    else if( component.type === "editor" && yContent instanceof Y.XmlFragment) {
      return <Editor key={component.uuid} pageId={pageId} provider={provider} yxmlfragment={yContent} isAuthenticated={isAuthenticated} />;
    } else if (component.type === "kanban" && yContent instanceof Y.Map) {
      return <Kanban ykanban={yContent} />;
    } else {
      return <p>Unknown component type = {component.type}</p>;
    }
  };

  return (
    <section className="p-12 max-h-full overflow-auto">
      <button onClick={() => addComponent("editor")}>New editor</button>
      <button onClick={() => addComponent("kanban")}>New kanban</button>
      {values.map((component) =>
        <Fragment key={component.uuid}>
          {getComponent(component)}
          <button onClick={() => moveComponent(component.uuid)}>Move Up</button>
          <button onClick={() => deleteComponent(component.uuid)}>Delete</button>
        </Fragment>
      )}
    </section>
  );
};
