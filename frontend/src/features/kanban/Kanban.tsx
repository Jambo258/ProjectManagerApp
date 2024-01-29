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
import { useEffect, useMemo, useState } from "react";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { SortableItemContent } from "./SortableItemContent";
import { Modal } from "../../components/Modal";
import { CreateLabelModal } from "./CreateLabelModal";
import * as Y from "yjs";

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

export const Kanban = ({ykanban}: {ykanban: Y.Map<Y.Array<Task> | Y.Array<Column> | Y.Array<Label>>}) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const columnsIds = useMemo(
    () => columns.map((element) => element.Id),
    [columns]
  );
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [label, SetLabel] = useState<Label[]>([]);


  useEffect(() => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    const ylabels = ykanban.get("labels") as Y.Array<Label>;

    setTasks(ytasks.toArray());
    setColumns(ycolumns.toArray());
    SetLabel(ylabels.toArray());

    ytasks.observe(() => {
      setTasks(ytasks.toArray());
    });
    ycolumns.observe(() => {
      setColumns(ycolumns.toArray());
    });
    ylabels.observe(() => {
      SetLabel(ylabels.toArray());
    });
  },[ykanban]);


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

    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    ycolumns.push([newCol]);
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

    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    ytasks.push([newTask]);
  };

  const updateColumn = (id: string | number, title: string) => {
    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    let changed = false;
    ycolumns.forEach((element,i) => {
      if (element.Id === id && changed === false) {
        changed = true;
        ycolumns.delete(i);
        ycolumns.insert(i,[{...element, title}]);
      }
    });
  };

  const updateTask = (id: string | number, content: string) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((element,i) => {
      if (element.Id === id && changed === false) {
        changed = true;
        ytasks.delete(i);
        ytasks.insert(i,[{ ...element, content }]);
      }
    });
  };

  const markTaskDone = (id: string | number) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((element,i) => {
      if (element.Id === id && changed === false) {
        changed = true;
        ytasks.delete(i);
        ytasks.insert(i,[{ ...element, done: true }]);
      }
    });
  };

  const updateTaskTitle = (id: string | number, title: string) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((element,i) => {
      if (element.Id === id && changed === false) {
        changed = true;
        ytasks.delete(i);
        ytasks.insert(i,[{ ...element, title }]);
      }
    });
  };

  const deleteColumn = (id: string | number) => {
    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    ycolumns.forEach((element,i) => {
      if (element.Id === id) {
        ycolumns.delete(i);
      }
    });

    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    const tasksToDelete = [] as number[];
    ytasks.forEach((element,index) => {
      if (element.columnId === id) {
        tasksToDelete.push(index);
      }
    });
    tasksToDelete.reverse().forEach(index => {
      ytasks.delete(index);
    });
  };

  const deleteTask = (id: string | number) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    ytasks.forEach((element,i) => {
      if (element.Id === id) {
        ytasks.delete(i);
      }
    });
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

    let activeColumnIndex = 0;
    let overColumnIndex = 0;
    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    ycolumns.forEach((element, i) => {
      if(element.Id === activeColumnId ) {
        activeColumnIndex = i;
      }
      if(element.Id === overColumnId ) {
        overColumnIndex = i;
      }
    });

    if(activeColumnIndex === overColumnIndex) {
      return;
    }

    const element = ycolumns.get(activeColumnIndex);
    ycolumns.delete(activeColumnIndex);
    ycolumns.insert(overColumnIndex, [element]);
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
      let activeIndex = 0;
      let overIndex = 0;

      const ytasks = ykanban.get("tasks") as Y.Array<Task>;
      ytasks.forEach((element,i) => {
        if (element.Id === activeId) {
          activeIndex = i;
        }
        if (element.Id === overId) {
          overIndex = i;
        }
      });

      if(activeIndex !==  overIndex) {
        const task = ytasks.get(activeIndex);
        ytasks.delete(activeIndex);
        ytasks.insert(overIndex, [task]);
      }

      // setTasks((elements) => {
      //   activeIndex = elements.findIndex((el) => el.Id === activeId);
      //   overIndex = elements.findIndex((el) => el.Id === overId);
      //   // elements[activeIndex].columnId = elements[overIndex].columnId;

      //   return arrayMove(elements, activeIndex, overIndex);
      // });
    }

    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveTask && isOverColumn) {
      let activeIndex = 0;

      const ytasks = ykanban.get("tasks") as Y.Array<Task>;
      ytasks.forEach((element,i) => {
        if (element.Id === activeId) {
          activeIndex = i;
        }
      });

      const task = ytasks.get(activeIndex);
      ytasks.delete(activeIndex);
      ytasks.insert(activeIndex, [{...task, columnId: overId}]);

      // setTasks((elements) => {
      //   const activeIndex = elements.findIndex((el) => el.Id === activeId);

      //   elements[activeIndex].columnId = overId;

      //   return arrayMove(elements, activeIndex, activeIndex);
      // });
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
