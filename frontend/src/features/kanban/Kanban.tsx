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
import * as Y from "yjs";
import { nanoid } from "@reduxjs/toolkit";
import { useGetProjectQuery, type Member } from "../api/apiSlice";
import { Plus } from "react-feather";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export interface Column {
  Id: string | number;
  title: string;
}

export interface Labels {
  id: string | number;
  name: string;
  color: string;
  hover?: string;
}

export interface Task {
  Id: string;
  title: string;
  columnId: string | number;
  content: string;
  labels?: Labels[];
  deadline?: number | undefined;
  members: Member[];
}

export const Kanban = ({
  ykanban,
}: {
  ykanban: Y.Map<Y.Array<Task> | Y.Array<Column> | Y.Array<Labels>>;
}) => {
  const [isModalsOpen, setIsModalsOpen] = useState(false);
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const columnsIds = useMemo(
    () => columns.map((column) => column.Id),
    [columns]
  );
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [labels, setLabels] = useState<Labels[]>([]);

  const projectId = parseInt(useParams().projectId!);
  const { data: project } = useGetProjectQuery(projectId);
  const user = useAppSelector((state) => state.auth.user);

  const isUserViewer = useMemo(() =>
    project?.users.some(projectUser => projectUser.id === user?.id && projectUser.role === "viewer") ?? true
  ,[project, user]);

  useEffect(() => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    const ylabels = ykanban.get("labels") as Y.Array<Labels>;

    setTasks(ytasks.toArray());
    setColumns(ycolumns.toArray());
    setLabels(ylabels.toArray());

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
      setLabels(ylabels.toArray());
    });
  }, [ykanban]);

  const arrayOfColors = [
    { id: 1, name: "", color: "bg-green-100", hover: "hover:bg-green-100" },
    { id: 2, name: "", color: "bg-green-200", hover: "hover:bg-green-200" },
    { id: 3, name: "", color: "bg-green-300", hover: "hover:bg-green-300" },
    { id: 4, name: "", color: "bg-purple-100", hover: "hover:bg-purple-100" },
    { id: 5, name: "", color: "bg-purple-200", hover: "hover:bg-purple-200" },
    { id: 6, name: "", color: "bg-purple-300", hover: "hover:bg-purple-300" },
    { id: 7, name: "", color: "bg-red-100", hover: "hover:bg-red-100" },
    { id: 8, name: "", color: "bg-red-200", hover: "hover:bg-red-200" },
    { id: 9, name: "", color: "bg-red-300", hover: "hover:bg-red-300" },
    { id: 10, name: "", color: "bg-blue-100", hover: "hover:bg-blue-100" },
    { id: 11, name: "", color: "bg-blue-200", hover: "hover:bg-blue-200" },
    { id: 12, name: "", color: "bg-blue-300", hover: "hover:bg-blue-300" },
    { id: 13, name: "", color: "bg-yellow-100", hover: "hover:bg-yellow-100" },
    { id: 14, name: "", color: "bg-yellow-200", hover: "hover:bg-yellow-200" },
    { id: 15, name: "", color: "bg-yellow-300", hover: "hover:bg-yellow-300" },
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
      content: "",
      labels: [],
      members: [],
    };

    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    ytasks.push([newTask]);
  };

  const createLabel = (name: string, color: string) => {
    const newLabel: Labels = {
      id: nanoid(),
      name: name,
      color: color
    };

    const ylabels = ykanban.get("labels") as Y.Array<Labels>;
    ylabels.push([newLabel]);
  };

  const updateLabelStatus = (taskId: string, id: string) => {
    const ylabels = ykanban.get("labels") as Y.Array<Labels>;

    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    const findLabelIndex = ylabels
      .toArray()
      .findIndex((label) => label.id === id);
    let changed = false;
    ytasks.forEach((task, i) => {
      if (task.Id === taskId && changed === false) {
        const findIndex = task.labels?.findIndex((label) => label.id === id);
        changed = true;
        ytasks.doc?.transact(() => {
          ytasks.delete(i);
          ytasks.insert(i, [
            {
              ...task,
              labels:
                findIndex !== -1
                  ? task.labels
                  : [...task.labels!, ylabels.get(findLabelIndex)],
            },
          ]);
        });
      }
    });
  };

  const deleteLabelStatus = (taskId: string, id: string) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;

    let changed = false;

    ytasks.forEach((task, i) => {
      if (task.Id === taskId && changed === false) {
        const findIndex = task.labels?.findIndex((label) => label.id === id);
        changed = true;

        ytasks.doc?.transact(() => {
          if (findIndex !== -1) {
            const updatedLabels = task.labels?.filter(
              (label) => label.id !== id
            );

            ytasks.delete(i);
            ytasks.insert(i, [
              {
                ...task,
                labels: updatedLabels,
              },
            ]);
          }
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
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    ytasks.forEach((task, i) => {
      const findIndex = task.labels?.findIndex((label) => label.id === id);

      if (findIndex !== -1) {
        ytasks.doc?.transact(() => {
          ytasks.delete(i);
          ytasks.insert(i, [
            {
              ...task,
              labels: task.labels?.map((label) =>
                label.id === id ? { ...label, name: name, color: color } : label
              ),
            },
          ]);
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
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    ytasks.forEach((task, i) => {
      const updatedLabels = task.labels?.filter((label) => label.id !== id);

      ytasks.doc?.transact(() => {
        ytasks.delete(i);
        ytasks.insert(i, [
          {
            ...task,
            labels: updatedLabels,
          },
        ]);
      });
    });
  };

  const updateColumn = (id: string | number, title: string) => {
    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    let changed = false;
    ycolumns.forEach((column, i) => {
      if (column.Id === id && changed === false) {
        changed = true;
        ycolumns.doc?.transact(() => {
          ycolumns.delete(i);
          ycolumns.insert(i, [{ ...column, title }]);
        });
      }
    });
  };

  const updateTask = (id: string | number, content: string) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((task, i) => {
      if (task.Id === id && changed === false) {
        changed = true;
        ytasks.doc?.transact(() => {
          ytasks.delete(i);
          ytasks.insert(i, [{ ...task, content }]);
        });
      }
    });
  };

  const addTaskMember = (id: number | string, newMember: Member) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((task, i) => {
      if (task.Id === id && changed === false) {
        changed = true;
        ytasks.doc?.transact(() => {
          ytasks.delete(i);
          ytasks.insert(i, [{ ...task, members: [...task.members, newMember] }]);
        });
      }
    });
  };

  const removeTaskMember = (id: number | string, newMember: Member) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((task, i) => {
      const updatedMembers = task.members.filter((member) => member.id !== newMember.id);
      if (task.Id === id && changed === false) {
        changed = true;
        ytasks.doc?.transact(() => {
          ytasks.delete(i);
          ytasks.insert(i, [{ ...task, members: updatedMembers}]);
        });
      }
    });
  };

  const setTaskDeadline = (
    id: string | number,
    deadline: number | undefined
  ) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((task, i) => {
      if (task.Id === id && changed === false) {
        changed = true;
        ytasks.doc?.transact(() => {
          ytasks.delete(i);
          ytasks.insert(i, [{ ...task, deadline: deadline }]);
        });
      }
    });
  };

  const removeTaskDeadline = (id: string | number) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((task, i) => {
      if (task.Id === id && changed === false) {
        changed = true;
        ytasks.doc?.transact(() => {
          ytasks.delete(i);
          ytasks.insert(i, [
            {
              ...task,
              deadline: undefined,
            },
          ]);
        });
      }
    });
  };

  const updateTaskTitle = (id: string | number, title: string) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    let changed = false;
    ytasks.forEach((task, i) => {
      if (task.Id === id && changed === false) {
        changed = true;
        ytasks.doc?.transact(() => {
          ytasks.delete(i);
          ytasks.insert(i, [{ ...task, title }]);
        });
      }
    });
  };

  const deleteColumn = (id: string | number) => {
    const ycolumns = ykanban.get("columns") as Y.Array<Column>;
    let changed = false;
    ycolumns.forEach((column, i) => {
      if (column.Id === id && changed === false) {
        changed = true;
        ycolumns.delete(i);
      }
    });

    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    const tasksToDelete = [] as number[];
    ytasks.forEach((task, index) => {
      if (task.columnId === id) {
        tasksToDelete.push(index);
      }
    });
    tasksToDelete.reverse().forEach((index) => {
      ytasks.delete(index);
    });
  };

  const deleteTask = (id: string | number) => {
    const ytasks = ykanban.get("tasks") as Y.Array<Task>;
    ytasks.forEach((task, i) => {
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

    if (active.data.current?.type !== "Column") {
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
      if (task.Id === activeColumnId) {
        activeColumnIndex = i;
      }
      if (task.Id === overColumnId) {
        overColumnIndex = i;
      }
    });

    if (
      activeColumnIndex === -1 ||
      overColumnIndex === -1 ||
      activeColumnIndex === overColumnIndex
    ) {
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
      ytasks.forEach((task, i) => {
        if (task.Id === activeId) {
          activeIndex = i;
        }
        if (task.Id === overId) {
          overIndex = i;
        }
      });

      if (activeIndex === -1 || overIndex === -1) {
        return;
      }

      if (activeIndex !== overIndex) {
        ytasks.doc?.transact(() => {
          const task = ytasks.get(activeIndex);
          ytasks.delete(activeIndex);
          ytasks.insert(
            overIndex > activeIndex && task.columnId !== overTask.columnId
              ? overIndex - 1
              : overIndex,
            [{ ...task, columnId: overTask.columnId }]
          );
        });
      }
    }

    const isOverColumn = over.data.current?.type === "Column";

    if (isOverColumn) {
      // TODO drop in right index
      let activeIndex = -1;

      const ytasks = ykanban.get("tasks") as Y.Array<Task>;
      ytasks.forEach((task, i) => {
        if (task.Id === activeId) {
          activeIndex = i;
        }
      });

      if (activeIndex === -1) {
        return;
      }

      ytasks.doc?.transact(() => {
        const task = ytasks.get(activeIndex);
        ytasks.delete(activeIndex);
        ytasks.insert(activeIndex, [{ ...task, columnId: overId }]);
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
      <div className="m-auto flex w-full overflow-x-auto overflow-y-auto border rounded border-grayscale-300 p-2 me-2">
        <DndContext
          sensors={sensors}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
        >
          <div className="flex gap-2 w-fit">
            <div className="flex gap-4">
              <SortableContext items={columnsIds}>
                {columns.map((column) => (
                  <KanbanColumn
                    project={project}
                    removeTaskDeadline={removeTaskDeadline}
                    setTaskDeadline={setTaskDeadline}
                    deleteLabel={deleteLabel}
                    editLabel={editLabel}
                    deleteLabelStatus={deleteLabelStatus}
                    updateLabelStatus={updateLabelStatus}
                    createLabel={createLabel}
                    deleteTask={deleteTask}
                    key={column.Id}
                    column={column}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    updateTask={updateTask}
                    updateTaskTitle={updateTaskTitle}
                    tasks={tasks.filter((ele) => ele.columnId === column.Id)}
                    labels={labels}
                    labelColors={arrayOfColors}
                    setIsModalsOpen={setIsModalsOpen}
                    isModalsOpen={isModalsOpen}
                    addTaskMember={addTaskMember}
                    removeTaskMember={removeTaskMember}
                    isUserViewer={isUserViewer}
                  />
                ))}
              </SortableContext>
              {!isUserViewer &&
              <button
                className="w-fit min-w-fit h-[50px] px-6 py-2 mt-0.5 inline-flex items-center gap-2 rounded-sm btn-text-xs"
                onClick={() => createNewColumn()}
              >
                <Plus size={18} />
                Add column
              </button>
              }
            </div>
          </div>
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <div className="opacity-70 rotate-1">
                  <KanbanColumn
                    tasks={tasks.filter(
                      (ele) => ele.columnId === activeColumn.Id
                    )}
                    project={project}
                    removeTaskDeadline={removeTaskDeadline}
                    setTaskDeadline={setTaskDeadline}
                    deleteLabelStatus={deleteLabelStatus}
                    deleteLabel={deleteLabel}
                    editLabel={editLabel}
                    updateLabelStatus={updateLabelStatus}
                    createLabel={createLabel}
                    createTask={createTask}
                    column={activeColumn}
                    deleteColumn={deleteColumn}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    updateColumn={updateColumn}
                    updateTaskTitle={updateTaskTitle}
                    labels={labels}
                    labelColors={arrayOfColors}
                    setIsModalsOpen={setIsModalsOpen}
                    isModalsOpen={isModalsOpen}
                    addTaskMember={addTaskMember}
                    removeTaskMember={removeTaskMember}
                    isUserViewer={isUserViewer}
                  />
                </div>
              )}
              {activeTask && (
                <div className="opacity-70 rotate-3">
                  <KanbanTask
                    project={project}
                    removeTaskDeadline={removeTaskDeadline}
                    setTaskDeadline={setTaskDeadline}
                    deleteLabelStatus={deleteLabelStatus}
                    deleteLabel={deleteLabel}
                    editLabel={editLabel}
                    updateLabelStatus={updateLabelStatus}
                    createLabel={createLabel}
                    task={activeTask}
                    updateTaskTitle={updateTaskTitle}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                    labels={labels}
                    labelColors={arrayOfColors}
                    setIsModalsOpen={setIsModalsOpen}
                    isModalsOpen={isModalsOpen}
                    addTaskMember={addTaskMember}
                    removeTaskMember={removeTaskMember}
                    isUserViewer={true}
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
