import { DndContext, DragEndEvent, closestCenter} from "@dnd-kit/core";
import { SortableItem } from "./SortableItem";
import { useEffect, useState } from "react";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Page, useGetProjectQuery } from "../api/apiSlice";
import AddPage from "./AddPage";

export const DnDComponent = () => {
  const { data: getProjectData, isSuccess } = useGetProjectQuery(6);
  const [dataArray, setDataArray] = useState<Page[] | null>(null);

  useEffect(() => {
    if (isSuccess) {
      setDataArray(getProjectData.pages);
    }
  }, [isSuccess, getProjectData?.pages]);

  const setPosition = (e: DragEndEvent) => {
    const { active, over } = e;
    if (active.id !== over?.id) {
      setDataArray((element) => {
        const oldIndex = element?.findIndex((item) => item.id === active.id);
        const newIndex = element?.findIndex((item) => item.id === over?.id);

        return arrayMove(element!, oldIndex!, newIndex!);
      });
    }
  };
  return (
    <div className="border border-grayscale-400 max-w-sm">
      {dataArray && (
        <DndContext onDragEnd={setPosition} collisionDetection={closestCenter}>
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={dataArray.map((i) => i.id)}
          >
            <div className="p-6">
              <div className="grid grid-flow-row items-center text-center justify-center">
                <p className="">Names</p>
                {dataArray.map((value) => (
                  <SortableItem key={value?.id} id={value?.id}>
                    {value.name} id: {value.id}{" "}
                  </SortableItem>
                ))}
              </div>
              <div className="flex justify-center border border-grayscale-400">
                <AddPage projectid={6} buttonSelector={"menu"} />
              </div>
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
