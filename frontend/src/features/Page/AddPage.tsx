import { useState } from "react";
import { useGetProjectQuery, useAddNewPageMutation } from "../api/apiSlice";

const AddPage = (projectid: number) => {
  const [getProject] = useGetProjectQuery();
  const [addNewPage] = useAddNewPageMutation();

  const [pageName, setPageName] = useState("name");

  // check if project id exists in database

  const checkProjectID = async () => {
    try {
      const project = await getProject(projectid).unwrap();
    } catch (error) {
      console.error();
    }
  };

  // apislice addNewPage query tarttee päivittää sisältämään project id
  const createNewpage = async () => {
    const page = await addNewPage({ projectid, pageName }).unwrap();
  };

  // create a page with project id
  // return page id or something i guess

  return (
    <>
      <button onClick={() => createNewpage()}>Add new page</button>
    </>
  );
};
export default AddPage;
