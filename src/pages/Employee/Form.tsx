import { Button, Form, Input, InputNumber, Select, message } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { useState, useEffect } from 'react';

const FormEmployee: React.FC = () => {
  const {
    row,
    isEdit,
    setVisible,
    positions,
    departments,
    statusList,
    addEmployee,
    updateEmployee,
  } = useModel('employee');

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Reset form khi modal đóng/mở hoặc khi chuyển giữa thêm/sửa
  useEffect(() => {
    form.resetFields();
  }, [form, row, isEdit]);

  // Kiểm tra không được chứa ký tự đặc biệt
  const validateName = (_: any, value: string) => {
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialChars.test(value)) {
      return Promise.reject('Họ tên không được chứa ký tự đặc biệt');
    }
    return Promise.resolve();
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      if (isEdit && row) {
        updateEmployee({ ...values, id: row.id });
        message.success(`Cập nhật thông tin nhân viên ${values.name} thành công!`);
      } else {
        const newEmployee = addEmployee(values);
        message.success(`Thêm nhân viên ${values.name} thành công!`);
      }
      
      setVisible(false);
    } finally {
      setSubmitting(false);
      form.resetFields();
    }
  };

  return (
    <Form
      form={form}
      initialValues={
        isEdit
          ? row
          : {
              status: 'Thử việc', // Mặc định là thử việc
            }
      }
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Họ tên"
        name="name"
        rules={[
          ...rules.required,
          { max: 50, message: 'Họ tên tối đa 50 ký tự' },
          { validator: validateName },
        ]}
      >
        <Input placeholder="Nhập họ tên nhân viên" />
      </Form.Item>

      <Form.Item
        label="Chức vụ"
        name="position"
        rules={[...rules.required]}
      >
        <Select placeholder="Chọn chức vụ">
          {positions.map((pos) => (
            <Select.Option key={pos.id} value={pos.name}>
              {pos.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Phòng ban"
        name="department"
        rules={[...rules.required]}
      >
        <Select placeholder="Chọn phòng ban">
          {departments.map((dept) => (
            <Select.Option key={dept.id} value={dept.name}>
              {dept.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Lương"
        name="salary"
        rules={[...rules.required]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
          placeholder="Nhập lương nhân viên"
          min={0}
        />
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        rules={[...rules.required]}
      >
        <Select placeholder="Chọn trạng thái">
          {statusList.map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <div className="form-footer">
        <Button htmlType="submit" type="primary" loading={submitting}>
          {isEdit ? 'Cập nhật' : 'Thêm mới'}
        </Button>
        <Button onClick={() => {
          setVisible(false);
          form.resetFields();
        }} disabled={submitting}>
          Hủy
        </Button>
      </div>
    </Form>
  );
};

export default FormEmployee; 