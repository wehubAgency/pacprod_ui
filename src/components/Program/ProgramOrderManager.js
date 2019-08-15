import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Translate } from 'react-localize-redux';
import iaxios from '../../axios';

const ProgramOrderManager = ({
  shows, programs, setPrograms, program,
}) => {
  const [items, setItems] = useState(shows);
  const [oldOrder, setOldOrder] = useState([]);
  const [selectedShow, selectShow] = useState('');

  useEffect(() => {
    setItems(shows);
  }, [shows]);

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
    const newOrder = reorder(items, result.source.index, result.destination.index);
    setItems(reorder(newOrder));
    iaxios()
      .patch(`/programs/${program.id}/order`, {
        shows: newOrder.map(i => i.id),
      })
      .then((res) => {
        if (res === 'error') {
          setItems(oldOrder);
        } else {
          const index = programs.findIndex(p => p.id === program.id);
          const newData = [...programs];
          newData.splice(index, 1, res.data);
          setPrograms(newData);
        }
      });
  };

  const onBeforeDragStart = () => {
    setOldOrder([...items]);
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
      <h2>
        <Translate id="programOrderManager.orderProgram" />
      </h2>
      <DragDropContext onDragEnd={onDragEnd} onBeforeDragStart={onBeforeDragStart}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {items.map((item, index) => (
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

export default ProgramOrderManager;
