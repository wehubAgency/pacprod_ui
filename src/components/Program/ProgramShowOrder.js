import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Translate } from 'react-localize-redux';

const ProgramShowOrder = ({
  targetKeys, setTargetKeys, programShows, setProgramShows,
}) => {
  const [selectedShow, selectShow] = useState('');

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    setProgramShows(reorder(programShows, result.source.index, result.destination.index));
    setTargetKeys(reorder(targetKeys, result.source.index, result.destination.index));
  };

  const grid = 16;

  const getItemStyle = (isDragging, draggableStyle, id) => ({
    border: selectedShow === id ? '2px solid lightgrey' : '',
    borderRadius: '2px',
    userSelect: 'none',
    padding: grid,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? '#e6f7ff' : '#fafafa',
    ...draggableStyle,
  });

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#fafafa' : 'white',
    padding: grid,
    width: '100%',
  });

  return (
    <div>
      <h2>Ordonnez votre programme</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {programShows.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      style={getItemStyle(snap.isDragging, prov.draggableProps.style, item.id)}
                      onClick={() => selectShow(item.id)}
                      role="button"
                      tabIndex={0}
                    >
                      N°{index + 1}: {item.name}{' '}
                      {!item.enabled ? <Translate id="programShowOrder.disabled" /> : ''}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ProgramShowOrder;
