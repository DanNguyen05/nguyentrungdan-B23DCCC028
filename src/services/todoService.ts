// services/todoService.ts
import { Todo } from '../models/Todo';

const TODOS_KEY = 'todos';

export const getTodos = (): Todo[] => {
  const todos = localStorage.getItem(TODOS_KEY);
  if (todos) {
    try {
      return JSON.parse(todos) as Todo[];
    } catch (error) {
      console.error('Lỗi parse todos:', error);
      return [];
    }
  }
  return [];
};

export const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
};
