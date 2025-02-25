import React, { useState, useContext, useEffect } from "react";

import Context from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCheck,
  faTrashAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

export default function TodoListItem({ id, important, done, label, date }) {
  const [btnArr, setBtnArr] = useState([
    {
      action: "important",
      icon: <FontAwesomeIcon icon={faBolt} />,
      isActive: important,
    },
    {
      action: "done",
      icon: <FontAwesomeIcon icon={faCheck} />,
      isActive: done,
    },
    { action: "delete", icon: <FontAwesomeIcon icon={faTrashAlt} /> },
  ]);
  const [editMode, setEditMode] = useState(false);
  const { updateTodoList, updateTodoLabel } = useContext(Context);

  const todoAction = (action) => {
    // срабатывает при клике и передает в глобальный стейт
    const newArr = btnArr.map((el) => {
      if (action == el.action) {
        updateTodoList(id, action);
        return {
          ...el,
          isActive: !el.isActive,
        };
      } else return el;
    });
    action == "done" && setEditMode(false);

    setBtnArr(newArr);
  };

  const btn = btnArr.map((el, index) => {
    const classs = el.isActive && el.action != "delete" ? "activeButton" : null;
    if (done && el.action == "important") {
      el.isActive = false;
      return false;
    }
    return (
      <Buttons
        label={el.icon}
        key={index}
        classs={classs}
        action={el.action}
        todoAction={todoAction}
      />
    );
  });

  const [newLabelBuffer, setNewLabelBuffer] = useState(label);
  const onInput = (e) => setNewLabelBuffer(e.target['value'])
  const rows = newLabelBuffer.split('\n').length

  const updateLabel = () => {
    const newValue = newLabelBuffer.trim()
    editMode && updateTodoLabel(id, newValue);
    setNewLabelBuffer(newValue)
    setEditMode(!editMode);
  };

  return (
    <div className={`TodoListItem ${done && "doneTodo"}`} key={id}>
      <div className="TodoListItemTop">
        <div className="TodoListItemDate">{date}</div>
        <div className="TodoListItemBtn">{btn}</div>
      </div>

      <div className={`TodoListItemLine ${important && "importantLine"}`}></div>
      <div className="content">
        {!done && (
          <div className={`editMode ${editMode && "editModeActive"}`}>
            <FontAwesomeIcon icon={faEdit} onClick={() => updateLabel()} />
          </div>
        )}

        <textarea disabled={!editMode} rows={rows} onInput={onInput}>
          {label}
        </textarea>
      </div>
    </div>
  );
}

function Buttons({ label, classs, todoAction, action }) {
  const classss = action == "delete" ? `delBtn ${classs}` : classs;
  return (
    <div className={classss} onClick={() => todoAction(action)}>
      {label}
    </div>
  );
}
