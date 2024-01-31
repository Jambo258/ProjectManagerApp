import { useParams } from "react-router-dom";
import { PageWrapper } from "./PageWrapper";

export const Page = () => {
  const pageId = useParams().pageId!;

  return (
    <section className="p-4 sm:p-12 max-h-full">
      <PageWrapper key={pageId} pageId={pageId} />;
    </section>
  );
};
