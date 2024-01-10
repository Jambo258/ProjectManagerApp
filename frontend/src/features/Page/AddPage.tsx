import { useAddNewPageMutation } from "../api/apiSlice";

const AddPage = (projectid: number) => {
  const [addNewPage] = useAddNewPageMutation();

  const defaultPageName = "New page";

  // check if project id exists in database

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
