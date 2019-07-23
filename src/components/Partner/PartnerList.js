import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import iaxios from '../../axios';

const propTypes = {
  partners: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
  setPartners: PropTypes.func.isRequired,
  selectedPartner: PropTypes.string.isRequired,
  selectPartner: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};

const PartnerList = ({
  partners,
  setPartners,
  selectedPartner,
  selectPartner,
  translate,
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
    border:
      selectedPartner === id ? '2px solid lightgrey' : '1px solid lightgrey',
    borderRadius: '2px',
    userSelect: 'none',
    padding: grid,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? '#e6f7ff' : '#fafafa',
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? '#fafafa' : 'white',
    padding: grid,
    width: '100%',
  });

  const onBeforeDragStart = () => {
    setOldOrder([...partners]);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    setPartners(
      reorder(partners, result.source.index, result.destination.index),
    );
    iaxios()
      .patch(`/partners/${result.draggableId}/order`, {
        order: result.destination.index,
      })
      .then((res) => {
        if (res === 'error') {
          setPartners(oldOrder);
        }
      });
  };

  return (
    <div>
      <DragDropContext
        onDragEnd={onDragEnd}
        onBeforeDragStart={onBeforeDragStart}
      >
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {partners.map((partner, index) => (
                <Draggable
                  key={partner.id}
                  draggableId={partner.id}
                  index={index}
                >
                  {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      style={getItemStyle(
                        snap.isDragging,
                        prov.draggableProps.style,
                        partner.id,
                      )}
                      onClick={() => selectPartner(partner.id)}
                      role="button"
                      tabIndex={0}
                    >
                      {partner.name}{' '}
                      {!partner.enabled && ` (${translate('disabled')})`}
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

PartnerList.propTypes = propTypes;

export default withLocalize(PartnerList);
