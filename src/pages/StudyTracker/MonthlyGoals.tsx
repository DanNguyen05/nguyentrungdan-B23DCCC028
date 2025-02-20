// src/pages/StudyTracker/MonthlyGoals.tsx

import React, { useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Select, DatePicker } from 'antd';
import { useModel } from 'umi';
import type { RangeValue } from 'rc-picker/lib/interface';
import moment from 'moment';
// Import interface StudyGoal và StudyProgress từ model
import { StudyGoal, StudyProgress } from '@/models/study';
// Import hàm lưu mục tiêu học tập từ service
import { saveStudyGoals } from '../../services/studyService';

const { Option } = Select;
const { RangePicker } = DatePicker;

const MonthlyGoals: React.FC = () => {
  // Lấy state và các hàm refresh từ model 'study'
  // Dữ liệu bao gồm danh sách môn học (subjects), tiến độ học tập (progressList) và mục tiêu (goals)
  const { subjects, progressList, goals, refreshGoals } = useModel('study') as any;
  // State điều khiển hiển thị Modal và lưu mục tiêu đang được chỉnh sửa (nếu có)
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [form] = Form.useForm();

  /**
   * Hàm calculateAchieved:
   * - Tính tổng thời lượng học (Achieved) cho môn học (subjectId) 
   *   trong khoảng thời gian [startDate, endDate] (nếu có).
   * - Nếu không có startDate/endDate thì tính tổng thời lượng của tất cả các buổi học của môn đó.
   */
  const calculateAchieved = (subjectId: string, startDate?: string, endDate?: string): number => {
    // Lọc ra các bản ghi tiến độ học tập của môn học có subjectId cho trước
    let filtered: StudyProgress[] = progressList.filter(
      (p: StudyProgress) => p.subjectId === subjectId
    );
    // Nếu có khoảng thời gian (startDate và endDate) được chỉ định
    if (startDate && endDate) {
      // Lấy thời gian dưới dạng số (mili giây)
      const sd = new Date(startDate).getTime();
      const ed = new Date(endDate).getTime();
      // Lọc các buổi học có thời gian học nằm trong khoảng [sd, ed]
      filtered = filtered.filter((p) => {
        const pd = new Date(p.studyDate).getTime();
        return pd >= sd && pd <= ed;
      });
    }
    // Trả về tổng thời lượng học (duration) của các buổi học đã lọc
    return filtered.reduce((sum, cur) => sum + cur.duration, 0);
  };

  /**
   * Hàm handleAddEdit:
   * - Xử lý khi người dùng submit form thêm mới hoặc chỉnh sửa mục tiêu học tập.
   * - Nếu đang chỉnh sửa (editingGoal khác null), cập nhật mục tiêu hiện có.
   * - Nếu không, tạo mới mục tiêu với id dựa trên thời gian hiện tại.
   * - Lưu kết quả vào localStorage qua hàm saveStudyGoals và refresh lại state.
   */
  const handleAddEdit = (values: any) => {
    let newGoals: StudyGoal[];
    if (editingGoal) {
      // Chế độ chỉnh sửa: cập nhật mục tiêu có id trùng với editingGoal.id
      newGoals = goals.map((g: StudyGoal) => {
        if (g.id === editingGoal.id) {
          return {
            ...g,
            subjectId: values.subjectId,
            targetDuration: values.targetDuration,
            // Nếu người dùng chọn khoảng thời gian, chuyển sang ISO string
            startDate: values.rangeDate ? values.rangeDate[0].toISOString() : undefined,
            endDate: values.rangeDate ? values.rangeDate[1].toISOString() : undefined,
          };
        }
        return g;
      });
    } else {
      // Chế độ thêm mới: tạo một mục tiêu mới với id là thời gian hiện tại
      const newGoal: StudyGoal = {
        id: Date.now().toString(),
        subjectId: values.subjectId,
        targetDuration: values.targetDuration,
        startDate: values.rangeDate ? values.rangeDate[0].toISOString() : undefined,
        endDate: values.rangeDate ? values.rangeDate[1].toISOString() : undefined,
      };
      newGoals = [newGoal, ...goals];
    }
    // Lưu danh sách mục tiêu mới vào localStorage
    saveStudyGoals(newGoals);
    // Refresh state từ localStorage
    refreshGoals();
    // Đóng Modal và reset form, xóa trạng thái chỉnh sửa
    setModalVisible(false);
    setEditingGoal(null);
    form.resetFields();
  };

  /**
   * Hàm handleEdit:
   * - Khi người dùng bấm nút Edit trên một mục tiêu, đưa dữ liệu hiện tại vào form.
   * - Nếu có startDate và endDate, chuyển chúng về dạng moment để RangePicker hiển thị.
   */
  const handleEdit = (goal: StudyGoal) => {
    setEditingGoal(goal);
    const rangeValue: RangeValue<moment.Moment> | undefined =
      goal.startDate && goal.endDate
        ? [moment(goal.startDate), moment(goal.endDate)]
        : undefined;
    // Đưa dữ liệu vào form với các trường: subjectId, targetDuration và rangeDate
    form.setFieldsValue({
      subjectId: goal.subjectId,
      targetDuration: goal.targetDuration,
      rangeDate: rangeValue,
    });
    setModalVisible(true);
  };

  /**
   * Hàm handleDelete:
   * - Xóa một mục tiêu khỏi danh sách dựa trên id.
   * - Sau đó lưu lại và refresh state.
   */
  const handleDelete = (goal: StudyGoal) => {
    const newGoals = goals.filter((g: StudyGoal) => g.id !== goal.id);
    saveStudyGoals(newGoals);
    refreshGoals();
  };

  // Định nghĩa các cột hiển thị trong bảng mục tiêu học tập
  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subjectId',
      key: 'subjectId',
      // Hiển thị tên môn học thay vì id
      render: (subjectId: string) => {
        const subj = subjects.find((s: any) => s.id === subjectId);
        return subj ? subj.name : subjectId;
      },
    },
    {
      title: 'Time Range',
      key: 'timeRange',
      // Hiển thị khoảng thời gian dạng "YYYY-MM-DD ~ YYYY-MM-DD" nếu có, ngược lại hiển thị 'No Range'
      render: (_: any, record: StudyGoal) => {
        if (record.startDate && record.endDate) {
          const sd = moment(record.startDate).format('YYYY-MM-DD');
          const ed = moment(record.endDate).format('YYYY-MM-DD');
          return `${sd} ~ ${ed}`;
        }
        return 'No Range';
      },
    },
    {
      title: 'Target Duration (min)',
      dataIndex: 'targetDuration',
      key: 'targetDuration',
    },
    {
      title: 'Achieved (min)',
      key: 'achieved',
      // Tính tổng thời lượng đạt được bằng hàm calculateAchieved
      render: (_: any, record: StudyGoal) => {
        return calculateAchieved(record.subjectId, record.startDate, record.endDate);
      },
    },
    {
      title: 'Status',
      key: 'status',
      // So sánh Achieved với Target để hiển thị trạng thái hoàn thành
      render: (_: any, record: StudyGoal) => {
        const achieved = calculateAchieved(record.subjectId, record.startDate, record.endDate);
        return achieved >= record.targetDuration ? 'Completed' : 'Incomplete';
      },
    },
    {
      title: 'Action',
      key: 'action',
      // Hiển thị nút Edit và Delete cho mỗi dòng
      render: (_: any, record: StudyGoal) => (
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
      <h3>Monthly Goals</h3>
      {/* Nút mở Modal để thêm mục tiêu mới */}
      <Button
        type="primary"
        onClick={() => {
          setModalVisible(true);
          setEditingGoal(null);
          form.resetFields();
        }}
      >
        Set Study Goal
      </Button>

      {/* Bảng hiển thị danh sách mục tiêu */}
      <Table dataSource={goals} columns={columns} rowKey="id" style={{ marginTop: 16 }} />

      {/* Modal chứa Form đặt mục tiêu */}
      <Modal
        title={editingGoal ? 'Edit Study Goal' : 'Set Study Goal'}
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

          {/* Chọn khoảng thời gian với RangePicker */}
          <Form.Item
            name="rangeDate"
            label="Time Range"
            tooltip="Choose the date range for this goal"
          >
            <RangePicker />
          </Form.Item>

          {/* Nhập mục tiêu thời lượng học */}
          <Form.Item
            name="targetDuration"
            label="Target Duration (min)"
            rules={[{ required: true, message: 'Please input target duration!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Button htmlType="submit" type="primary">
              {editingGoal ? 'Save' : 'Set'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MonthlyGoals;
