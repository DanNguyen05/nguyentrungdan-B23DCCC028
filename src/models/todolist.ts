// src/models/todolist.ts
import { useState } from 'react';
import { Todo } from '@/models/Todo';
import { getTodos, saveTodos } from '@/services/todoService';


export default () => {
  const [data, setData] = useState<Todo[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [row, setRow] = useState<Todo | null>(null);

  // Lấy danh sách todo từ localStorage
  const getDataTodo = () => {
    const todos = getTodos();
    setData(todos);
  };

  return {
    data,
    setData,
    visible,
    setVisible,
    isEdit,
    setIsEdit,
    row,
    setRow,
    getDataTodo,
  };
};
