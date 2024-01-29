import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableItem } from "./SortableItem";
import { useMemo, useState } from "react";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { SortableItemContent } from "./SortableItemContent";
import { Modal } from "../../components/Modal";
import { CreateLabelModal } from "./CreateLabelModal";

export interface Column {
  Id: string | number;
  title: string;
}
export interface Label {
  id: string | number;
  name: string;
  color: string;
}
export interface Task {
  Id: string | number;
  title: string;
  columnId: string | number;
  content: string;
  done: boolean;
  labels?: Label[];
}

export const DnDComponent = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const columnsIds = useMemo(
    () => columns.map((element) => element.Id),
    [columns]
  );
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [label, SetLabel] = useState<Label[]>([]);

  console.log(label);
  const arrayOfColors = [
    { id: 1, name:"", color: "bg-green-100" },
    { id: 2, name: "", color: "bg-green-200" },
    { id: 3, name: "", color: "bg-green-300" },
    { id: 4, name: "", color: "bg-purple-100" },
    { id: 5, name: "", color: "bg-purple-200" },
    { id: 6, name: "", color: "bg-purple-300" },
    { id: 7, name: "", color: "bg-red-100" },
    { id: 8, name: "", color: "bg-red-200" },
    { id: 9, name: "", color: "bg-red-300" },
    { id: 10, name: "", color: "bg-blue-100" },
    { id: 11, name: "", color: "bg-blue-200" },
    { id: 12, name: "", color: "bg-blue-300" },
    { id: 13, name: "", color: "bg-yellow-100" },
    { id: 14, name: "", color: "bg-yellow-200" },
    { id: 15, name: "", color: "bg-yellow-300" },
  ];

  const createNewColumn = () => {
    const newCol: Column = {
      Id: Math.floor(Math.random() * 10001),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, newCol]);
  };

  const createTask = (columnId: string | number) => {
    const newTask: Task = {
      Id: Math.floor(Math.random() * 10001),
      title: `Task ${tasks.length + 1}`,
      columnId,
      content: "Lorem ipsum",
      done: false,
      labels: [
        { id: 1, name: "frontend", color: "bg-green-100" },
        { id: 2, name: "Design", color: "bg-yellow-100" },
      ],
    };

    setTasks([...tasks, newTask]);
  };

  const updateColumn = (id: string | number, title: string) => {
    const newColumns = columns.map((element) => {
      if (element.Id !== id) {
        return element;
      }
      return { ...element, title: title };
    });
    setColumns(newColumns);
  };

  const updateTask = (id: string | number, content: string) => {
    const newTasks = tasks.map((element) => {
      if (element.Id !== id) {
        return element;
      }
      return { ...element, content: content };
    });
    setTasks(newTasks);
  };

  const markTaskDone = (id: string | number) => {
    const Tasks = tasks.map((element) => {
      if (element.Id !== id) {
        return element;
      }
      return { ...element, done: true };
    });
    setTasks(Tasks);
  };

  const updateTaskTitle = (id: string | number, title: string) => {
    const newTasks = tasks.map((element) => {
      if (element.Id !== id) {
        return element;
      }
      return { ...element, title: title };
    });
    setTasks(newTasks);
  };

  const deleteColumn = (id: string | number) => {
    const filteredColumns = columns.filter((element) => element.Id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((element) => element.columnId !== id);
    setTasks(newTasks);
  };

  const deleteTask = (id: string | number) => {
    const newTasks = tasks.filter((element) => element.Id !== id);
    setTasks(newTasks);
  };

  const onDragStart = (e: DragStartEvent) => {
    console.log(e);
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }
    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = e;

    if (!over) {
      return;
    }
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) {
      return;
    }
    setColumns((elements) => {
      const activeColumnIndex = elements.findIndex(
        (col) => col.Id === activeColumnId
      );
      const overColumnIndex = elements.findIndex(
        (col) => col.Id === overColumnId
      );

      return arrayMove(elements, activeColumnIndex, overColumnIndex);
    });
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      return;
    }

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = active.data.current?.type === "Task";

    if (!isActiveTask) {
      return;
    }

    if (isActiveTask && isOverTask) {
      setTasks((elements) => {
        const activeIndex = elements.findIndex((el) => el.Id === activeId);
        const overIndex = elements.findIndex((el) => el.Id === overId);
        // elements[activeIndex].columnId = elements[overIndex].columnId;

        return arrayMove(elements, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveTask && isOverColumn) {
      setTasks((elements) => {
        const activeIndex = elements.findIndex((el) => el.Id === activeId);

        elements[activeIndex].columnId = overId;

        return arrayMove(elements, activeIndex, activeIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  console.log(columns);
  console.log(tasks);

  return (
    <>
      <div className="grid grid-flow-col w-16">
        <Modal
          btnText={"Create Label"}
          btnStyling={"mb-3 mx-2"}
          modalTitle={"Create Label"}
        >
          <CreateLabelModal
            // color={color}
            label={label}
            labels={arrayOfColors}
            setLabel={SetLabel}
            // setColor={setColor}
          />
        </Modal>
        <button className="mb-3 mx-2" onClick={() => createNewColumn()}>
          Add Column
        </button>
        <div className="grid grid-flow-col">
          Labels
          {label.map((elements) => (
            <div
              className={`m-1 w-16 text-center rounded-md ${elements.color}`}
              key={elements.id}
            >
              {elements.name}
            </div>
          ))}
        </div>
      </div>
      <div className="m-auto flex w-full overflow-x-auto overflow-y-auto border border-grayscale-400 p-2">
        <DndContext
          sensors={sensors}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
        >
          <div className="m-auto flex gap-2">
            <div className="flex gap-4">
              <SortableContext items={columnsIds}>
                {columns.map((element) => (
                  <SortableItem
                    deleteTask={deleteTask}
                    key={element.Id}
                    column={element}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    updateTask={updateTask}
                    updateTaskTitle={updateTaskTitle}
                    markTaskDone={markTaskDone}
                    tasks={tasks.filter((ele) => ele.columnId === element.Id)}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <SortableItem
                  tasks={tasks.filter(
                    (ele) => ele.columnId === activeColumn.Id
                  )}
                  createTask={createTask}
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  updateColumn={updateColumn}
                  updateTaskTitle={updateTaskTitle}
                  markTaskDone={markTaskDone}
                />
              )}
              {activeTask && (
                <SortableItemContent
                  task={activeTask}
                  updateTaskTitle={updateTaskTitle}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  markTaskDone={markTaskDone}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </>
  );
};
