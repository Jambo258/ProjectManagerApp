/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useAddNewPageMutation } from "../api/apiSlice";

const AddPage = (projectid: any) => {
  const [addNewPage] = useAddNewPageMutation();

  const defaultPageName = "New page";

  const createNewpage = async () => {
    try {
      const page = await addNewPage({
        projectid: projectid,
        pageName: defaultPageName,
      }).unwrap();
      console.log(page);
    } catch (error) {
      console.error("failed to create a new page", error);
    }
  };

  return (
    <>
      <button onClick={() => createNewpage()}>Add new page</button>
    </>
  );
};
export default AddPage;
