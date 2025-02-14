// src/pages/TodoList/FormTodo.tsx
import React from 'react';
import { Button, Form, Input, Switch } from 'antd';
import { useModel } from 'umi';
import { Todo } from '@/models/Todo';
import { saveTodos } from '@/services/todoService';

const FormTodo: React.FC = () => {
  const { data, getDataTodo, row, isEdit, setVisible } = useModel('todolist');

  return (
    <Form
      // Nếu row có dữ liệu (sửa) thì điền dữ liệu ban đầu, ngược lại là giá trị mặc định
      initialValues={row || { title: '', completed: false }}
      onFinish={(values) => {
        let newData: Todo[];
        if (isEdit && row) {
          // Cập nhật Todo đã có
          newData = data.map((item: Todo) =>
            item.id === row.id ? { ...item, ...values } : item
          );
        } else {
          // Thêm mới Todo với id là thời gian hiện tại
          const newTodo: Todo = {
            id: Date.now().toString(),
            title: values.title,
            completed: values.completed,
          };
          newData = [newTodo, ...data];
        }
        // Lưu vào localStorage
        saveTodos(newData);
        setVisible(false);
        getDataTodo();
      }}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please input your title!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Completed" name="completed" valuePropName="checked">
        <Switch />
      </Form.Item>

      <div className="form-footer" style={{ textAlign: 'right' }}>
        <Button htmlType="submit" type="primary">
          {isEdit ? 'Save' : 'Insert'}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => setVisible(false)}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default FormTodo;
