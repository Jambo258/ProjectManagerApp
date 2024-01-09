import { Loader } from "react-feather";
import { useGetProjectsQuery } from "../../features/api/apiSlice";

export const HomeView = () => {
  const { data: projects = [], isLoading, isSuccess, isError } = useGetProjectsQuery();

  let projectList;

  if (isLoading) {
    projectList = <p className="mb-4"><Loader className="animate-spin" /></p>;
  } else if (isSuccess) {
    projectList = <ul className="list-decimal mb-4">{projects.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
  } else if (isError) {
    projectList = <p className="mb-4">Failed to load project list</p>;
  }

  return (
    <main className="grid grid-flow-col max-w-7xl m-auto mt-12">
      <div className="w-96 h-96 bg-grayscale-300 hidden mx-6 lg:flex" />
      <div className="body-text-lg mx-8">
        <p className="heading-xl mb-8">
          Lorem ipsum, dolor sit amet consectetur!
        </p>
        <p className="mb-4">
          Introducing our cutting-edge <span className="font-semibold">Project Management App</span> - your ultimate solution for streamlined collaboration, efficient task tracking,
          and seamless communication. Empower your team to achieve project milestones with ease, all within a user-friendly interface designed to enhance productivity and project success.</p>
        <p className="mb-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat nobis dignissimos repudiandae, at maxime impedit omnis corporis dolores vero modi quisquam aut a explicabo.
        </p>
        {projectList}
      </div>
    </main>
  );
};
