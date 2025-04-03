import { Button, Card, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import { useModel } from 'umi';
import { useState, useCallback, useEffect } from 'react';
import FormEmployee from './Form';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const EmployeeList: React.FC = () => {
  const {
    visible,
    setVisible,
    setRow,
    isEdit,
    setIsEdit,
    positions,
    departments,
    filter,
    setFilter,
    getFilteredData,
    deleteEmployee,
    canDeleteEmployee,
    getEmployeeData,
  } = useModel('employee');

  // Load data on component mount
  useEffect(() => {
    getEmployeeData();
  }, []);

  // Format tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Hiển thị trạng thái dưới dạng tag với màu sắc khác nhau
  const renderStatus = (status: Employee.StatusEnum) => {
    let color = '';
    switch (status) {
      case 'Thử việc':
        color = 'orange';
        break;
      case 'Đã ký hợp đồng':
        color = 'green';
        break;
      case 'Nghỉ phép':
        color = 'blue';
        break;
      case 'Đã thôi việc':
        color = 'red';
        break;
      default:
        color = 'default';
    }
    return <Tag color={color}>{status}</Tag>;
  };

  // Hiển thị hộp thoại xác nhận trước khi xóa
  const showDeleteConfirm = useCallback((id: string, name: string, status: Employee.StatusEnum) => {
    if (!canDeleteEmployee(status)) {
      message.error('Chỉ được phép xóa nhân viên có trạng thái Thử việc hoặc Đã thôi việc');
      return;
    }

    confirm({
      title: 'Xác nhận xóa nhân viên',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa nhân viên ${name} (${id}) không?`,
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        deleteEmployee(id);
        message.success(`Xóa nhân viên ${name} thành công!`);
      },
    });
  }, [canDeleteEmployee, deleteEmployee]);

  // Handle add employee button click
  const handleAddClick = useCallback(() => {
    setRow(undefined);
    setIsEdit(false);
    setVisible(true);
  }, [setIsEdit, setRow, setVisible]);

  // Handle edit employee button click 
  const handleEditClick = useCallback((record: Employee.Record) => {
    setRow(record);
    setIsEdit(true);
    setVisible(true);
  }, [setIsEdit, setRow, setVisible]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  // Cột dữ liệu cho bảng
  const columns = [
    {
      title: 'Mã nhân viên',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number) => formatCurrency(salary),
      align: 'right' as const,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Employee.StatusEnum) => renderStatus(status),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record: Employee.Record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleEditClick(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            onClick={() => showDeleteConfirm(record.id, record.name, record.status)}
            disabled={!canDeleteEmployee(record.status)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý nhân viên">
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Button
            type="primary"
            onClick={handleAddClick}
          >
            Thêm nhân viên
          </Button>

          <Select
            allowClear
            placeholder="Lọc theo chức vụ"
            style={{ width: 200 }}
            onChange={(value) => setFilter({ ...filter, position: value })}
            value={filter.position}
          >
            {positions.map((pos) => (
              <Select.Option key={pos.id} value={pos.name}>
                {pos.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            allowClear
            placeholder="Lọc theo phòng ban"
            style={{ width: 200 }}
            onChange={(value) => setFilter({ ...filter, department: value })}
            value={filter.department}
          >
            {departments.map((dept) => (
              <Select.Option key={dept.id} value={dept.name}>
                {dept.name}
              </Select.Option>
            ))}
          </Select>

          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo mã, họ tên"
            style={{ width: 250 }}
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            allowClear
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal thêm/sửa nhân viên */}
      <Modal
        title={isEdit ? 'Cập nhật thông tin nhân viên' : 'Thêm mới nhân viên'}
        visible={visible}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose
      >
        <FormEmployee />
      </Modal>
    </Card>
  );
};

export default EmployeeList; 