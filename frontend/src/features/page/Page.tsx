import { useParams } from "react-router-dom";
import { PageWrapper } from "./PageWrapper";

export const Page = () => {
  const pageId = useParams().pageId!;

  return <PageWrapper key={pageId} pageId={pageId} />;
};
