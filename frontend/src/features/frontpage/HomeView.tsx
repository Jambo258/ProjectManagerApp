import ProjectManagerApp from "../../assets/screenshots/ProjectManagerApp.png";
export const HomeView = () => {
  return (
    <main className="flex flex-col m-auto mt-6 items-center max-w-[1000px]">
      
      <p className="heading-xl mt-8 px-6 w-full leading-10 mb-4">
        Take control of your workflows
      </p>
      
      <div className="max-w-[1000px] body-text-lg px-6 mb-10">
        <p>
          with our cutting-edge{" "}
          <span className="font-semibold">Project Management App</span> - your
          ultimate solution for streamlined collaboration, efficient task
          tracking, and seamless communication. Empower your team to achieve
          project milestones with ease, all within a user-friendly interface
          designed to enhance productivity and project success.
        </p>
      </div>

      <div className="h-auto max-w-[1000px] w-full px-6">
        <img src={ProjectManagerApp} alt="Project Management App" />
      </div>
    </main>
  );
};
