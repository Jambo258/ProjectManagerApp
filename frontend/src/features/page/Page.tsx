import { useParams } from "react-router-dom";
import Editor from "../editor/Editor";
import "react-calendar/dist/Calendar.css";
import Calendar from "../calendar/Calendar";

export const Page = () => {
  const pageId = useParams().pageId!;
  return (
    <section className="p-12 max-h-full overflow-auto">
      <Editor key={pageId} pageId={pageId} />
      <Calendar></Calendar>
    </section>
  );
};
