/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from "axios";
const baseURL = "http://127.0.0.1:3001/";

const createNewProject = async (name: string) => {
  const data = { name };
  const request = axios.post(baseURL + "projects/", data);
  const result = await request;
  return result;
};

const newPage = async (name: string, projectid: number, content: object) => {
  const data = { name, projectid, content };
  const request = axios.post(baseURL + "pages/", data);
  const result = await request;
  return result.data;
};
export default { createNewProject, newPage };
