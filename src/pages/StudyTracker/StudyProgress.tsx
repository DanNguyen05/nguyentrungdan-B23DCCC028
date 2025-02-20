// src/pages/StudyTracker/StudyProgress.tsx

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Select } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
// Import interface của StudyProgress từ model
import { StudyProgress } from '@/models/study';
// Import hàm lưu tiến độ học tập từ service
import { saveStudyProgress } from '@/services/studyService';

const { Option } = Select;

const StudyProgressComponent: React.FC = () => {
  // Sử dụng useModel('study') để lấy state toàn cục của Study Tracker,
  // bao gồm danh sách môn học (subjects), tiến độ học tập (progressList) và hàm refresh (refreshProgress)
  const { subjects, progressList, refreshProgress } = useModel('study') as any;

  // State điều khiển hiển thị Modal và lưu trạng thái bản ghi đang được chỉnh sửa
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProgress, setEditingProgress] = useState<StudyProgress | null>(null);
  // Khởi tạo form của Ant Design
  const [form] = Form.useForm();

  /**
   * handleAddEdit:
   * Xử lý khi người dùng submit form thêm mới hoặc chỉnh sửa tiến độ học tập.
   * - Nếu có bản ghi đang được chỉnh sửa (editingProgress không null), cập nhật bản ghi đó.
   * - Nếu không, tạo một bản ghi mới với id dựa trên thời gian hiện tại.
   * Sau đó, lưu danh sách mới vào localStorage thông qua saveStudyProgress và refresh lại state.
   */
  const handleAddEdit = (values: any) => {
    let newProgressList: StudyProgress[];
    if (editingProgress) {
      // Chế độ chỉnh sửa: cập nhật bản ghi có id trùng với editingProgress.id
      newProgressList = progressList.map((p: StudyProgress) =>
        p.id === editingProgress.id
          ? { ...p, ...values, studyDate: values.studyDate.toISOString() }
          : p
      );
    } else {
      // Chế độ thêm mới: tạo bản ghi mới với id là thời gian hiện tại
      const newRecord: StudyProgress = {
        id: Date.now().toString(),
        subjectId: values.subjectId,
        studyDate: values.studyDate.toISOString(),
        duration: values.duration,
        content: values.content,
        notes: values.notes,
      };
      newProgressList = [newRecord, ...progressList];
    }
    // Lưu danh sách mới vào localStorage
    saveStudyProgress(newProgressList);
    // Refresh lại state của tiến độ học tập
    refreshProgress();
    // Đóng Modal và reset trạng thái chỉnh sửa cũng như form
    setModalVisible(false);
    setEditingProgress(null);
    form.resetFields();
  };

  /**
   * handleEdit:
   * Khi người dùng bấm nút Edit, đưa bản ghi cần chỉnh sửa vào form.
   * Chuyển giá trị studyDate sang dạng moment để DatePicker có thể hiển thị đúng.
   */
  const handleEdit = (record: StudyProgress) => {
    setEditingProgress(record);
    form.setFieldsValue({
      ...record,
      studyDate: moment(record.studyDate), // Chuyển studyDate từ ISO string sang moment object
    });
    setModalVisible(true);
  };

  /**
   * handleDelete:
   * Xóa bản ghi tiến độ học tập dựa trên id.
   * Sau đó, lưu danh sách mới vào localStorage và refresh state.
   */
  const handleDelete = (record: StudyProgress) => {
    const newProgressList = progressList.filter((p: StudyProgress) => p.id !== record.id);
    saveStudyProgress(newProgressList);
    refreshProgress();
  };

  // Định nghĩa các cột cho bảng hiển thị tiến độ học tập
  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subjectId',
      key: 'subjectId',
      // Render hiển thị tên môn học dựa trên subjectId
      render: (subjectId: string) => {
        const subj = subjects.find((s: any) => s.id === subjectId);
        return subj ? subj.name : subjectId;
      },
    },
    {
      title: 'Study Date',
      dataIndex: 'studyDate',
      key: 'studyDate',
      // Chuyển đổi ISO string thành định dạng 'YYYY-MM-DD HH:mm'
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Duration (min)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Action',
      key: 'action',
      // Render nút Edit và Delete cho mỗi bản ghi
      render: (_: any, record: StudyProgress) => (
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
      <h3>Study Progress</h3>
      {/* Nút mở Modal để thêm mới tiến độ học tập */}
      <Button
        type="primary"
        onClick={() => {
          setModalVisible(true);
          setEditingProgress(null);
          form.resetFields();
        }}
      >
        Add Study Progress
      </Button>
      {/* Bảng hiển thị danh sách tiến độ học tập */}
      <Table dataSource={progressList} columns={columns} rowKey="id" style={{ marginTop: 16 }} />
      {/* Modal chứa Form thêm/chỉnh sửa tiến độ học tập */}
      <Modal
        title={editingProgress ? 'Edit Study Progress' : 'Add Study Progress'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handleAddEdit} layout="vertical">
          {/* Chọn môn học */}
          <Form.Item
            name="subjectId"
            label="Subject"
            rules={[{ required: true, message: 'Please select a subject!' }]}
          >
            <Select placeholder="Select subject">
              {subjects.map((s: any) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* Chọn ngày giờ học */}
          <Form.Item
            name="studyDate"
            label="Study Date"
            rules={[{ required: true, message: 'Please choose the study date!' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          {/* Nhập thời lượng học (phút) */}
          <Form.Item
            name="duration"
            label="Duration (min)"
            rules={[{ required: true, message: 'Please input duration!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          {/* Nhập nội dung học */}
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please input content!' }]}
          >
            <Input />
          </Form.Item>
          {/* Nhập ghi chú (nếu có) */}
          <Form.Item name="notes" label="Notes">
            <Input />
          </Form.Item>
          {/* Nút Submit cho form */}
          <div style={{ textAlign: 'right' }}>
            <Button htmlType="submit" type="primary">
              {editingProgress ? 'Save' : 'Add'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StudyProgressComponent;
