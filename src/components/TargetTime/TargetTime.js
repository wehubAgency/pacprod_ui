import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { throttle } from 'lodash';
import { Icon, Checkbox } from 'antd';
import moment from 'moment';

const DEFAULT_ACTIVE_HOUR = true;
const DEFAULT_HOURS = new Array(24).fill(DEFAULT_ACTIVE_HOUR);
const DEFAULT_WEEK = new Array(7).fill(DEFAULT_HOURS);

const TargetTime = (props) => {
  const localFormatWeek = (week, origin = false) => {
    const isoWeekStart = moment().isoWeekday(0);
    const localWeekStart = moment().weekday(0);
    const weekBegin = localWeekStart.day() - isoWeekStart.day();

    /* eslint-disable no-unreachable */
    switch (weekBegin) {
      case 1:
        return week;
        break;
      case 6:
        let saturday;

        if (origin) {
          saturday = week[0];
          week.splice(6, 0, saturday);
          week.shift();
          return week;
        }

        saturday = week.splice(5, 1).pop();
        week.unshift(saturday);
        return week;
        break;
      default:
        return week.reverse();
    }
  };

  const getInitialStateWeek = (week = DEFAULT_WEEK) => {
    if (week === null) week = DEFAULT_WEEK;
    return localFormatWeek(week).map((day) => {
      let newDay;
      if (typeof day === 'string') {
        const dayArr = day.split(',');
        const boolArr = dayArr.map(d => d === 'true');
        newDay = [...boolArr];
      } else {
        newDay = [...day];
      }
      return {
        hours: newDay,
        isActive: newDay.some(hour => hour === true),
      };
    });
  };

  const [week, setWeek] = useState(getInitialStateWeek(props.week));
  const [mouseDown, setMouseDown] = useState(false);
  const [initialStateCell, setInitialStateCell] = useState(null);
  const [bufferChangeCell, setBufferChangeCell] = useState([]);
  // const [lastWeekElement, setLastWeekElement] = useState(
  //   props.week ? props.week.length : 0,
  // );

  const cells = [];

  useEffect(() => {
    if (props.onInit) {
      props.onInit(localFormatWeek(DEFAULT_WEEK), true);
    }
    if (!props.readonly) {
      document.addEventListener('mouseup', handleMouseOut, false);
      return () => {
        document.removeEventListener('mouseup', handleMouseOut);
        changeStateCell.cancel();
      };
    }
    /* eslint-disable-next-line */
  }, []);

  const setActiveHourDay = (newWeek, selectDay, selectHour, active) => newWeek.map((day, index) => {
    if (index === selectDay) {
      return {
        ...day,
        isActive: !active
          ? day.hours.some((hour, indexHour) => hour === true && indexHour !== selectHour)
          : true,
        hours: day.hours.map((hour, indexHour) => {
          if (indexHour === selectHour) {
            return active;
          }
          return hour;
        }),
      };
    }
    return day;
  });

  const getLocalDay = indexDay => moment()
    .weekday(indexDay)
    .format('dd')
    .toUpperCase();

  const handleMouseOut = () => {
    if (!mouseDown) return;
    setMouseDown(false);
  };

  const changeStateCell = throttle((selectDay, selectHour, selectCell) => {
    const cell = cells[selectCell];
    const containClassActive = cell.classList.contains('targettime__time-cell--active');

    if (initialStateCell && !containClassActive) {
      cell.classList.add('targettime__time-cell--active');
    } else if (initialStateCell === false && containClassActive) {
      cell.classList.remove('targettime__time-cell--active');
    }

    const newBufferChangeCell = [...bufferChangeCell, { day: selectDay, hour: selectHour }];
    setBufferChangeCell(newBufferChangeCell);
  }, 20);

  const handleMouseDown = (selectDay, indexHour, selectCell, hour) => {
    if (!props.readonly) {
      changeStateCell(selectDay, indexHour, selectCell);
      setMouseDown(true);
      setInitialStateCell(!hour);
    }
  };

  const handleMouseEnter = (selectDay, indexHour, selectCell) => {
    if (!props.readonly) {
      if (!mouseDown) return;
      changeStateCell(selectDay, indexHour, selectCell);
    }
  };

  const handleMouseUp = () => {
    if (!props.readonly) {
      let newWeek = [...week];
      bufferChangeCell.forEach((cell) => {
        newWeek = setActiveHourDay(newWeek, cell.day, cell.hour, initialStateCell);
      });

      setMouseDown(false);
      setInitialStateCell(null);
      setWeek(newWeek);
      setBufferChangeCell([]);
      props.onChange(localFormatWeek(newWeek.map(day => day.hours), true));
    }
  };

  const changeStateHour = (selectHour, isActiveHour) => {
    if (!props.readonly) {
      const newWeek = week.map(currentDay => ({
        ...currentDay,
        hours: currentDay.hours.map((hour, indexHour) => {
          if (indexHour === selectHour) {
            return !isActiveHour;
          }
          return hour;
        }),
      }));
      setWeek(newWeek);
      props.onChange(localFormatWeek(newWeek.map(day => day.hours), true));
    }
  };

  const renderTimeCheckbox = (text, selectHour) => {
    let isActiveHour;

    isActiveHour = week.map(currentDay => currentDay.hours.some((hour, indexHour) => indexHour === selectHour && hour === true));
    isActiveHour = isActiveHour.some(hour => hour === true);
    // const checked = isActiveHour ? 'checked' : '';

    return (
      <label className="targettime__hour-checkbox">
        <Checkbox
          checked={isActiveHour}
          onChange={() => changeStateHour(selectHour, isActiveHour)}
        />
        <div>{text}</div>
      </label>
    );
  };

  const changeStateDayTime = (selectIndexDay) => {
    if (!props.readonly) {
      const newWeek = week.map((currentDay, indexDay) => {
        if (indexDay === selectIndexDay) {
          const active = !currentDay.isActive;
          return {
            ...currentDay,
            isActive: active,
            hours: currentDay.hours.map(() => active),
          };
        }
        return currentDay;
      });
      setWeek(newWeek);
      props.onChange(localFormatWeek(newWeek.map(day => day.hours), true));
    }
  };

  const renderDayCheckbox = selectIndexDay => (
    <label className="label--checkbox">
      <Checkbox
        checked={week[selectIndexDay].isActive}
        onChange={() => changeStateDayTime(selectIndexDay)}
      />
      {getLocalDay(selectIndexDay)}
    </label>
  );

  const renderToggle = () => (
    <div className="targettime__toggle">
      <div className="targettime__toggle__icon--active">
        <Icon type="plus" />
      </div>
      <div className="targettime__toggle__icon--inactive">
        <Icon type="remove" />
      </div>
    </div>
  );

  const renderTime = (hours, selectDay, lastWeekElement = false) => hours.map((hour, indexHour) => {
    const timeClass = classNames('targettime__time-cell', {
      'targettime__time-cell--active': hour,
      'targettime__time-cell__time-checkbox': lastWeekElement,
    });
    const selectCell = `${selectDay} - ${indexHour}`;

    if (lastWeekElement) {
      const hourStart = moment()
        .hour(indexHour)
        .format('HH');
      const hourEnd = moment()
        .hour(indexHour)
        .add(1, 'h')
        .format('HH');
      const label = `${hourStart} ${hourEnd}`;
      return (
          <td className={timeClass} key={`${indexHour}-last`}>
            {renderTimeCheckbox(label, indexHour)}
          </td>
      );
    }

    /* eslint no-return-assign: 0 */
    return (
        <td
          className={timeClass}
          ref={cell => (cells[selectCell] = cell)}
          key={indexHour}
          onMouseDown={() => handleMouseDown(selectDay, indexHour, selectCell, hour)}
          onMouseUp={() => handleMouseUp(selectDay, indexHour, selectCell)}
          onMouseMove={() => handleMouseEnter(selectDay, indexHour, selectCell)}
        >
          {renderToggle()}
        </td>
    );
  });

  const renderGrid = () => {
    const arrayWeek = [];
    const lastIndexWeek = week.length - 1;
    const dayClass = classNames('targettime__week-row');

    week.forEach((day, indexDay) => {
      arrayWeek.push(
        <tr className={dayClass} key={indexDay}>
          <td className="targettime__day-checkbox">{renderDayCheckbox(indexDay)}</td>
          {renderTime(day.hours, indexDay)}
        </tr>,
      );

      if (lastIndexWeek === indexDay) {
        arrayWeek.push(
          <tr className={dayClass} key={`${indexDay}-last`}>
            <td className="targettime__empty-checkbox" />
            {renderTime(day.hours, indexDay, true)}
          </tr>,
        );
      }
    });
    return arrayWeek;
  };

  return (
    <table className="targettime" style={props.style}>
      <tbody>{renderGrid()}</tbody>
    </table>
  );
};

export default TargetTime;
