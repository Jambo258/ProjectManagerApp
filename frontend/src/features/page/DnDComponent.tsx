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
import { SortablePage } from "./SortablePage";

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

  return (
    <>
      <button className="mb-3" onClick={() => createNewColumn()}>
        Add Column
      </button>
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
                />
              )}
              {activeTask && (
                <SortablePage
                  task={activeTask}
                  updateTaskTitle={updateTaskTitle}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
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
