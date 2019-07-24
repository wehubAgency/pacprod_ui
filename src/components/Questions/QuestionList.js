import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import iaxios from '../../axios';

const propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
      question: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  setItems: PropTypes.func.isRequired,
  selectedQuestion: PropTypes.string.isRequired,
  selectQuestion: PropTypes.func.isRequired,
  quiz: PropTypes.string.isRequired,
};

const QuestionList = ({
  items, setItems, selectedQuestion, selectQuestion, quiz,
}) => {
  const [oldOrder, setOldOrder] = useState([]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const grid = 16;

  const getItemStyle = (isDragging, draggableStyle, id) => ({
    border: selectedQuestion === id ? '1px solid #1890ff' : '1px solid lightgrey',
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

  const onBeforeDragStart = () => {
    setOldOrder([...items]);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    setItems(reorder(items, result.source.index, result.destination.index));
    iaxios()
      .patch(`/questions/${result.draggableId}/order`, {
        order: result.destination.index,
        quiz,
      })
      .then((res) => {
        if (res === 'error') {
          setItems(oldOrder);
        }
      });
  };

  return (
    <div className="styled-scrollbar" style={{ maxHeight: 700, overflow: 'auto' }}>
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
                      onClick={() => selectQuestion(item.id)}
                      role="button"
                      tabIndex={0}
                    >
                      {item.question}
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

QuestionList.propTypes = propTypes;

export default QuestionList;
