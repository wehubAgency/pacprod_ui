import React from 'react';
import { Translate } from 'react-localize-redux';
import { Button, Popconfirm, Icon } from 'antd';
import InlineSVG from 'svg-inline-react';
import FilterDropdown from '../components/FilterDropdown';
import moment from '../moment';
import * as CustomCells from '../components/Cells';

export default (data, transId, actions = []) => {
  const columns = Object.entries(data).map(([key, el]) => {
    const newEl = { ...el };
    newEl.title = <Translate id={`${transId}.${newEl.title}`} />;
    if (newEl.render) {
      switch (newEl.render.type) {
        case 'custom': {
          const Comp = CustomCells[newEl.render.id];
          return {
            ...newEl,
            render: (infos) => (
              <Comp infos={infos} style={{ ...newEl.render.style }} />
            ),
          };
        }
        case 'image':
          return {
            ...newEl,
            render: (image) => {
              const { style } = newEl.render;
              return image ? (
                <img src={image} style={{ ...style }} alt={key} />
              ) : null;
            },
          };
        case 'svg': {
          return {
            ...newEl,
            render: (svg) => (
              <InlineSVG
                src={svg}
                element="div"
                style={{ width: 75, height: 75 }}
              />
            ),
          };
        }
        case 'ellipsis':
          return {
            ...newEl,
            render: (text) => {
              if (text.length > newEl.render.size) {
                return `${text.substring(0, newEl.render.size)}...`;
              }
              return text;
            },
          };
        case 'date':
          return {
            ...newEl,
            render: (infos) => moment(infos).format(newEl.render.format),
          };
        case 'stringarray': {
          return {
            ...newEl,
            render: (strings) =>
              Array.isArray(strings) ? strings.join(', ') : '',
          };
        }
        default:
          return null;
      }
    }
    return {
      ...newEl,
      filterDropdown: (props) => <FilterDropdown {...props} />,
      filterIcon: (filtered) => (
        <Icon
          type="search"
          style={{ color: filtered ? '#1890ff' : undefined }}
        />
      ),
      onFilter: (value, record) =>
        record[newEl.dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    };
  });
  if (actions.length > 0) {
    columns.push({
      title: 'Actions',
      render: (el) => (
        <span>
          {actions.map((a) => {
            switch (a.type) {
              case 'edit':
                return (
                  <Button
                    key={a.type}
                    data-id={el.id}
                    shape="circle"
                    onClick={a.func}
                    icon="edit"
                  />
                );
              case 'disable':
                return (
                  <Button
                    key={a.type}
                    shape="circle"
                    onClick={() => a.func(el.id)}
                    icon={el.enabled ? 'stop' : 'check'}
                  />
                );
              case 'remove':
                return (
                  <Popconfirm
                    key={a.type}
                    title={a.confirm}
                    onConfirm={() => a.func(el.id)}
                    overlayStyle={{ maxWidth: 300 }}
                  >
                    <Button shape="circle" icon="delete" />
                  </Popconfirm>
                );
              default:
                return (
                  <Button
                    key={a.type}
                    data-id={el.id}
                    shape="circle"
                    onClick={a.func}
                    icon={a.icon}
                  />
                );
            }
          })}
        </span>
      ),
    });
  }
  return columns;
};
