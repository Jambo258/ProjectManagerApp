import { useParams } from "react-router-dom";
import Editor from "../editor/Editor";

export const Page = () => {
  const pageId = useParams().pageId!;
  return (
    <section className="p-12 max-h-full overflow-auto">
      <Editor key={pageId} pageId={pageId} />
    </section>
  );
};
