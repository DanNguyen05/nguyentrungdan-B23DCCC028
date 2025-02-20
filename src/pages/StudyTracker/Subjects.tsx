// src/pages/StudyTracker/Subjects.tsx

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import { useModel } from 'umi';
import { SubjectCategory } from '@/models/study';
import { saveSubjects } from '@/services/studyService';

const Subjects: React.FC = () => {
  // Lấy state toàn cục từ model 'study'
  // subjects: danh sách môn học
  // refreshSubjects: hàm làm mới danh sách môn học từ localStorage
  const { subjects, refreshSubjects } = useModel('study') as any;
  
  // State để điều khiển hiển thị Modal và lưu trữ bản ghi môn học đang được chỉnh sửa
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectCategory | null>(null);
  // Khởi tạo form của Ant Design để dùng cho Modal
  const [form] = Form.useForm();

  /**
   * handleAddEdit:
   * - Xử lý khi người dùng submit form (thêm mới hoặc chỉnh sửa môn học).
   * - Nếu editingSubject khác null, tức là đang chỉnh sửa, cập nhật lại môn học đó.
   * - Nếu không, tạo môn học mới với id dựa trên thời gian hiện tại.
   * - Sau đó, lưu danh sách mới vào localStorage và refresh lại state.
   */
  const handleAddEdit = (values: any) => {
    let newSubjects: SubjectCategory[];
    if (editingSubject) {
      // Chế độ chỉnh sửa: cập nhật môn học có id trùng với editingSubject.id
      newSubjects = subjects.map((s: SubjectCategory) =>
        s.id === editingSubject.id ? { ...s, ...values } : s
      );
    } else {
      // Chế độ thêm mới: tạo một môn học mới với id là thời gian hiện tại
      newSubjects = [{ id: Date.now().toString(), ...values }, ...subjects];
    }
    // Lưu danh sách môn học mới vào localStorage thông qua hàm saveSubjects
    saveSubjects(newSubjects);
    // Refresh lại danh sách môn học từ localStorage
    refreshSubjects();
    // Đóng Modal, reset trạng thái chỉnh sửa và reset form
    setModalVisible(false);
    setEditingSubject(null);
    form.resetFields();
  };

  /**
   * handleEdit:
   * - Khi người dùng bấm nút Edit, đưa bản ghi hiện tại vào form để chỉnh sửa.
   */
  const handleEdit = (subject: SubjectCategory) => {
    setEditingSubject(subject);
    // Đưa dữ liệu môn học hiện tại vào form
    form.setFieldsValue(subject);
    // Mở Modal
    setModalVisible(true);
  };

  /**
   * handleDelete:
   * - Xử lý xóa môn học khỏi danh sách.
   */
  const handleDelete = (subject: SubjectCategory) => {
    // Lọc bỏ môn học có id trùng với subject.id
    const newSubjects = subjects.filter((s: SubjectCategory) => s.id !== subject.id);
    // Lưu danh sách mới và refresh state
    saveSubjects(newSubjects);
    refreshSubjects();
  };

  // Định nghĩa các cột cho bảng hiển thị danh sách môn học
  const columns = [
    {
      title: 'Subject Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      // Render các nút Edit và Delete cho mỗi dòng
      render: (_: any, record: SubjectCategory) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger style={{ marginLeft: 8 }} onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h3>Subjects</h3>
      {/* Nút để mở Modal thêm mới môn học */}
      <Button
        type="primary"
        onClick={() => {
          setModalVisible(true);
          setEditingSubject(null);
          form.resetFields();
        }}
      >
        Add Subject
      </Button>
      {/* Bảng hiển thị danh sách môn học */}
      <Table dataSource={subjects} columns={columns} rowKey="id" style={{ marginTop: 16 }} />
      {/* Modal chứa Form thêm/chỉnh sửa môn học */}
      <Modal
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handleAddEdit} layout="vertical">
          <Form.Item
            name="name"
            label="Subject Name"
            rules={[{ required: true, message: 'Please input subject name!' }]}
          >
            <Input />
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button htmlType="submit" type="primary">
              {editingSubject ? 'Save' : 'Add'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Subjects;
