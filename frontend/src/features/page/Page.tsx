import { useParams } from "react-router-dom";
import Editor from "../editor/Editor";
import Calendar from "../calendar/Calendar";

export const Page = () => {
  const pageId = useParams().pageId!;
  return (
    <section className="p-4 sm:p-12 max-h-full">
      <Editor key={pageId} pageId={pageId} />
      <Calendar></Calendar>
    </section>
  );
};
