"use client";

import { useEffect, useState } from "react";
import { ListWithCards } from "@/types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { useAction } from "@/hooks/use-action";
import { updateCardOrder } from "@/actions/update-card-order";
import { toast } from "sonner";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
};

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)

    result.splice(endIndex, 0, removed)
    return result
}

export const ListContainer = ({
    data,
    boardId,
}: ListContainerProps) => {
    // orderdData stores the list of
    const [orderedData, setOrderedData] = useState(data);
    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Card reordered");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    useEffect(() => {
        setOrderedData(data);
    }, [data]);
    const onDragEnd = (result: any) => {
        // the result is the resulting, state of the draging
        const { destination, source, type } = result;
        if (!destination) {
            return;
        }
        //Dropped in the same position
        if (
            destination.droppableId === source.droppableId && destination.index === source.index
        ) {
            return;
        }

        // user moves a list

        if (type ==
            "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index
            ).map((item, index) => ({ ...item, position: index }));

            setOrderedData(items);
            // TODO: Trigger Sever Action


        }

        // User moves a card
        if (type == "card") {
            // Ordered data is a list of lists with cards
            let newOrderedData = [...orderedData];
            // Source and destination list
            // get the source and destination list
            const sourceList = newOrderedData.find(list => list.id === source.droppableId)
            const destinationList = newOrderedData.find(list => list.id === destination.droppableId)
            // if no source or desination list found
            if (!sourceList || !destinationList) {
                return;
            }
            // check if carcs exist the sourceList
            if (!sourceList.cards) {
                sourceList.cards = []
            }

            // check cards exist on the destList
            if (!destinationList.cards) {
                destinationList.cards = []
            }

            // moving card inthe same in this list
            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(sourceList.cards, source.index, destination.index)
                reorderedCards.forEach((card, idx) => {
                    card.order = idx
                })
                sourceList.cards = reorderedCards
                setOrderedData(newOrderedData)
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: reorderedCards,
                });
                // TODO: Trigger server action
            } else {
                // Remove card from the sourceList
                const [moveCard] = sourceList.cards.splice(source.index, 1)
                moveCard.listId = destination.droppableId;
                destinationList.cards.splice(destination.index, 0, moveCard)

                sourceList.cards.forEach((card, idx) => {
                    card.order = idx;
                })

                // Update the order for each card in the desination list

                destinationList.cards.forEach((card, idx) => {
                    card.order = idx
                })
                setOrderedData(newOrderedData)
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: destinationList.cards,
                });

            }
            // if moving the card into a different list


        }

    }
    return (

        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {
                    (provided) => (
                        <ol {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex gap-x-3 h-full">
                            {orderedData.map((list, index) => {
                                return (
                                    <ListItem
                                        key={list.id}
                                        index={index}
                                        data={list}
                                    />
                                )
                            })}
                            {provided.placeholder}
                            <ListForm />
                            <div className="flex-shrink-0 w-1" />
                        </ol>
                    )
                }
            </Droppable>
        </DragDropContext>

    );
};
