import { Fragment, useEffect, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider, } from "@hocuspocus/provider";

import Editor from "../editor/Editor";
import { nanoid } from "@reduxjs/toolkit";

interface Component {
  type: string;
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
  const ymap = ydoc.getMap<Y.XmlFragment>();

  useEffect(() => {
    yarray.observe(() => {
      setValues(yarray.toArray());
    });
  });


  const addComponent = () => {
    const uuid = nanoid();
    ymap.set(uuid, new Y.XmlFragment());
    yarray.push([{type: "editor", uuid}]);
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

  return (
    <section className="p-12 max-h-full overflow-auto">
      <button onClick={addComponent}>New editor</button>
      {values.map((component) =>
        <Fragment key={component.uuid}>
          <Editor key={component.uuid} pageId={pageId} provider={provider} yxmlfragment={ymap.get(component.uuid)!} isAuthenticated={isAuthenticated} />
          <button onClick={() => moveComponent(component.uuid)}>Move Up</button>
          <button onClick={() => deleteComponent(component.uuid)}>Delete</button>
        </Fragment>
      )}
    </section>
  );
};
