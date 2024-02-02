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
import { KanbanColumn } from "./KanbanColumn";
import { useEffect, useMemo, useState } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { KanbanTask } from "./KanbanTask";
import { LabelModal } from "./LabelModal";
import * as Y from "yjs";
import { SubModal } from "./SubModal";
import { nanoid } from "@reduxjs/toolkit";
import { type Member } from "../api/apiSlice";

export interface Column {
  Id: string | number;
  title: string;
}
export interface Labels {
  id: string | number;
  name: string;
  color: string;
  active: boolean;
}
export interface Task {
  Id: string | number;
  title: string;
  columnId: string | number;
  content: string;
  done: boolean;
  labels?: Labels[];
  members?: Member[];
}

export const Kanban = ({ykanban}: {ykanban: Y.Map<Y.Array<Task> | Y.Array<Column> | Y.Array<Labels>>}) => {
  const [isModalsOpen, setIsModalsOpen] = useState(false);
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const columnsIds = useMemo(
    () => columns.map((column) => column.Id),
    [columns]
  );
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [label, setLabel] = useState<Labels[]>([]);


  useEffect(() => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    const ylabels = ykanban.get("labels") as Y.Array<Labels>;

    setTasks(ytasks.toArray());
    setColumns(ycolumns.toArray());
    setLabel(ylabels.toArray());

    ytasks.observe(() => {
      const uniqueIds = new Set();
      const tasksArray = ytasks.toArray();
      ytasks.doc?.transact(() => {
        for (let i = tasksArray.length - 1; i >= 0; i--) {
          const item = tasksArray[i];
          if (uniqueIds.has(item.Id)) {
            ytasks.delete(i, 1);
          } else {
            uniqueIds.add(item.Id);
          }
        }
      });
      setTasks(ytasks.toArray());
    });
    ycolumns.observe(() => {
      const uniqueIds = new Set();
      const columnsArray = ycolumns.toArray();
      ycolumns.doc?.transact(() => {
        for (let i = columnsArray.length - 1; i >= 0; i--) {
          const item = columnsArray[i];
          if (uniqueIds.has(item.Id)) {
            ycolumns.delete(i, 1);
          } else {
            uniqueIds.add(item.Id);
          }
        }
      });
      setColumns(ycolumns.toArray());
    });
    ylabels.observe(() => {
      setLabel(ylabels.toArray());
    });
  },[ykanban]);


  const arrayOfColors = [
    { id: 1, name: "", color: "bg-green-100", active: false },
    { id: 2, name: "", color: "bg-green-200", active: false },
    { id: 3, name: "", color: "bg-green-300", active: false },
    { id: 4, name: "", color: "bg-purple-100", active: false },
    { id: 5, name: "", color: "bg-purple-200", active: false },
    { id: 6, name: "", color: "bg-purple-300", active: false },
    { id: 7, name: "", color: "bg-red-100", active: false },
    { id: 8, name: "", color: "bg-red-200", active: false },
    { id: 9, name: "", color: "bg-red-300", active: false },
    { id: 10, name: "", color: "bg-blue-100", active: false },
    { id: 11, name: "", color: "bg-blue-200", active: false },
    { id: 12, name: "", color: "bg-blue-300", active: false },
    { id: 13, name: "", color: "bg-yellow-100", active: false },
    { id: 14, name: "", color: "bg-yellow-200", active: false },
    { id: 15, name: "", color: "bg-yellow-300", active: false },
  ];

  const createNewColumn = () => {
    const newCol: Column = {
      Id: nanoid(),
      title: `Column ${columns.length + 1}`,
    };

    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    ycolumns.push([newCol]);
  };

  const createTask = (columnId: string | number) => {
    const newTask: Task = {
      Id: nanoid(),
      title: `Task ${tasks.length + 1}`,
      columnId,
      content: "Short task description goes here...",
      done: false,
      labels: [],
    };

    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    ytasks.push([newTask]);
  };

  const createLabel = (name: string, color: string) => {
    const newLabel: Labels= {
      id: nanoid(),
      name: name,
      color: color,
      active: false
    };

    const ylabels = ykanban.get("labels") as Y.Array<Labels>;
    ylabels.push([newLabel]);
  };

  const updateLabelStatus = (id:string | number, activeStatus: boolean) => {
    const ylabels = ykanban.get("labels") as Y.Array<Labels>;
    let changed = false;
    ylabels.forEach((label, i) => {
      if (label.id === id && changed === false) {
        changed = true;
        ylabels.doc?.transact(() => {
          ylabels.delete(i);
          ylabels.insert(i, [{ ...label, active:activeStatus }]);
        });
      }
    });
  };

  const editLabel = (id: string | number, name: string, color: string) => {
    const ylabels = ykanban.get("labels") as Y.Array<Labels>;
    let changed = false;
    ylabels.forEach((label, i) => {
      if (label.id === id && changed === false) {
        changed = true;
        ylabels.doc?.transact(() => {
          ylabels.delete(i);
          ylabels.insert(i, [{ ...label, name, color }]);
        });
      }
    });
  };

  const deleteLabel = (id: string | number) => {
    const ylabels = ykanban.get("labels") as Y.Array<Labels>;
    ylabels.forEach((label, i) => {
      if (label.id === id) {
        ylabels.delete(i);
      }
    });
  };

  const updateColumn = (id: string | number, title: string) => {
    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    let changed = false;
    ycolumns.forEach((column,i) => {
      if (column.Id === id && changed === false) {
        changed = true;
        ycolumns.doc?.transact(() => {
          ycolumns.delete(i);
          ycolumns.insert(i,[{...column, title}]);
        });
      }
    });
  };

  const updateTask = (id: string | number, content: string) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((task,i) => {
      if (task.Id === id && changed === false) {
        changed = true;
        ytasks.doc?.transact(() => {
          ytasks.delete(i);
          ytasks.insert(i,[{ ...task, content }]);
        });
      }
    });
  };

  const updateTaskMembers = (id: number | string, members: Member[]) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((task,i) => {
      if (task.Id === id && changed === false) {
        changed = true;
        ytasks.doc?.transact(() => {
          ytasks.delete(i);
          ytasks.insert(i,[{ ...task, members }]);
        });
      }
    });
  };

  const markTaskDone = (id: string | number) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((task,i) => {
      if (task.Id === id && changed === false) {
        changed = true;
        ytasks.doc?.transact(() => {
          ytasks.delete(i);
          ytasks.insert(i,[{ ...task, done: true }]);
        });
      }
    });
  };

  const updateTaskTitle = (id: string | number, title: string) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((task,i) => {
      if (task.Id === id && changed === false) {
        changed = true;
        ytasks.doc?.transact(() => {
          ytasks.delete(i);
          ytasks.insert(i,[{ ...task, title }]);
        });
      }
    });
  };

  const deleteColumn = (id: string | number) => {
    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    let changed = false;
    ycolumns.forEach((column,i) => {
      if (column.Id === id && changed === false) {
        changed = true;
        ycolumns.delete(i);
      }
    });

    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    const tasksToDelete = [] as number[];
    ytasks.forEach((task,index) => {
      if (task.columnId === id) {
        tasksToDelete.push(index);
      }
    });
    tasksToDelete.reverse().forEach(index => {
      ytasks.delete(index);
    });
  };

  const deleteTask = (id: string | number) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    ytasks.forEach((task,i) => {
      if (task.Id === id) {
        ytasks.delete(i);
      }
    });
  };

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column as Column);
      return;
    }
    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task as Task);
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

    if(active.data.current?.type !== "Column") {
      return;
    }

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) {
      return;
    }

    let activeColumnIndex = -1;
    let overColumnIndex = -1;
    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    ycolumns.forEach((task, i) => {
      if(task.Id === activeColumnId ) {
        activeColumnIndex = i;
      }
      if(task.Id === overColumnId ) {
        overColumnIndex = i;
      }
    });

    if(activeColumnIndex === -1 || overColumnIndex === -1 || activeColumnIndex === overColumnIndex) {
      return;
    }

    ycolumns.doc?.transact(() => {
      const task = ycolumns.get(activeColumnIndex);
      ycolumns.delete(activeColumnIndex);
      ycolumns.insert(overColumnIndex, [task]);
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
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) {
      return;
    }

    if (isOverTask) {
      const overTask = over.data.current?.task as Task;
      let activeIndex = -1;
      let overIndex = -1;

      const ytasks = ykanban.get("tasks") as Y.Array<Task>;
      ytasks.forEach((task,i) => {
        if (task.Id === activeId) {
          activeIndex = i;
        }
        if (task.Id === overId) {
          overIndex = i;
        }
      });

      if(activeIndex === -1 || overIndex === -1) {
        return;
      }

      if(activeIndex !== overIndex) {
        ytasks.doc?.transact(() => {
          const task = ytasks.get(activeIndex);
          ytasks.delete(activeIndex);
          ytasks.insert(overIndex > activeIndex && task.columnId !== overTask.columnId ? overIndex - 1 : overIndex, [{...task, columnId: overTask.columnId}]);
        });
      }

      // setTasks((elements) => {
      //   activeIndex = elements.findIndex((el) => el.Id === activeId);
      //   overIndex = elements.findIndex((el) => el.Id === overId);
      //   // elements[activeIndex].columnId = elements[overIndex].columnId;
      //   return arrayMove(elements, activeIndex, overIndex);
      // });
    }

    const isOverColumn = over.data.current?.type === "Column";

    if (isOverColumn) {
      // TODO drop in right index
      let activeIndex = -1;

      const ytasks = ykanban.get("tasks") as Y.Array<Task>;
      ytasks.forEach((task,i) => {
        if (task.Id === activeId) {
          activeIndex = i;
        }
      });

      if(activeIndex === -1) {
        return;
      }

      ytasks.doc?.transact(()=> {
        const task = ytasks.get(activeIndex);
        ytasks.delete(activeIndex);
        ytasks.insert(activeIndex, [{...task, columnId: overId}]);
      });

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

  return (
    <>
      <div className="grid grid-flow-col w-16">
        <SubModal
          btnText={"Labels"}
          modalTitle={"Labels"}
          iconName={"Labels"}
          setIsModalsOpen={setIsModalsOpen}
          isModalsOpen={isModalsOpen}
        >
          <LabelModal
            label={label}
            labels={arrayOfColors}
            setLabel={setLabel}
            setIsModalsOpen={setIsModalsOpen}
            isModalsOpen={isModalsOpen}
            createLabel={createLabel}
            updateLabelStatus={updateLabelStatus}
            editLabel={editLabel}
            deleteLabel={deleteLabel}
          />
        </SubModal>
        <button className="mb-3 mx-2" onClick={() => createNewColumn()}>
          Add Column
        </button>
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
                {columns.map((column) => (
                  <KanbanColumn
                    key={column.Id}
                    column={column}
                    updateColumn={updateColumn}
                    deleteColumn={deleteColumn}
                    tasks={tasks.filter((ele) => ele.columnId === column.Id)}
                    createTask={createTask}
                    updateTask={updateTask}
                    updateTaskTitle={updateTaskTitle}
                    updateTaskMembers={updateTaskMembers}
                    markTaskDone={markTaskDone}
                    deleteTask={deleteTask}
                    label={label}
                    setLabel={setLabel}
                    labels={arrayOfColors}
                    createLabel={createLabel}
                    editLabel={editLabel}
                    deleteLabel={deleteLabel}
                    updateLabelStatus={updateLabelStatus}
                    isModalsOpen={isModalsOpen}
                    setIsModalsOpen={setIsModalsOpen}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <div className="opacity-70 rotate-1">
                  <KanbanColumn
                    column={activeColumn}
                    updateColumn={updateColumn}
                    deleteColumn={deleteColumn}
                    tasks={tasks.filter(
                      (ele) => ele.columnId === activeColumn.Id
                    )}
                    createTask={createTask}
                    updateTask={updateTask}
                    updateTaskTitle={updateTaskTitle}
                    updateTaskMembers={updateTaskMembers}
                    markTaskDone={markTaskDone}
                    deleteTask={deleteTask}
                    label={label}
                    setLabel={setLabel}
                    labels={arrayOfColors}
                    createLabel={createLabel}
                    editLabel={editLabel}
                    deleteLabel={deleteLabel}
                    updateLabelStatus={updateLabelStatus}
                    isModalsOpen={isModalsOpen}
                    setIsModalsOpen={setIsModalsOpen}
                  />
                </div>
              )}
              {activeTask && (
                <div className="opacity-70 rotate-3">
                  <KanbanTask
                    task={activeTask}
                    updateTask={updateTask}
                    updateTaskTitle={updateTaskTitle}
                    updateTaskMembers={updateTaskMembers}
                    markTaskDone={markTaskDone}
                    deleteTask={deleteTask}
                    label={label}
                    setLabel={setLabel}
                    labels={arrayOfColors}
                    createLabel={createLabel}
                    editLabel={editLabel}
                    deleteLabel={deleteLabel}
                    updateLabelStatus={updateLabelStatus}
                    isModalsOpen={isModalsOpen}
                    setIsModalsOpen={setIsModalsOpen}
                  />
                </div>
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </>
  );
};
