import React, { useEffect } from 'react';
import { Button, Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useModel } from 'umi';
import FormTodo from './FormTodo';
import { Todo } from '@/models/Todo';
import { saveTodos } from '@/services/todoService';

const TodoList: React.FC = () => {
  const { data, getDataTodo, setRow, isEdit, setVisible, setIsEdit, visible } = useModel('todolist');

  useEffect(() => {
    getDataTodo();
  }, []);

  const columns: ColumnsType<Todo> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Completed',
      dataIndex: 'completed',
      key: 'completed',
      width: 100,
      render: (_, record) => (record.completed ? 'Yes' : 'No'),
    },
    {
      title: 'Action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <div>
          <Button
            onClick={() => {
              setVisible(true);
              setRow(record);
              setIsEdit(true);
            }}
          >
            Edit
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            type="primary"
            onClick={() => {
              const todos = data.filter((item: Todo) => item.id !== record.id);
              saveTodos(todos);
              getDataTodo();
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setVisible(true);
          setIsEdit(false);
          setRow(null);
        }}
      >
        Add Todo
      </Button>

      <Table dataSource={data} columns={columns} rowKey="id" />

      <Modal
        destroyOnClose
        footer={false}
        title={isEdit ? 'Edit Todo' : 'Add Todo'}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <FormTodo />
      </Modal>
    </div>
  );
};

export default TodoList;
