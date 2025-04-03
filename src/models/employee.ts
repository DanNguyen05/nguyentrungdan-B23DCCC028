import { getDepartments, getEmployees, getPositions, getStatusList, initSampleData } from '@/services/Employee';
import { generateId } from '@/utils/utils';
import { useEffect, useState, useRef } from 'react';

export default () => {
  const [data, setData] = useState<Employee.Record[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [row, setRow] = useState<Employee.Record>();
  const [filter, setFilter] = useState<{
    position?: string;
    department?: string;
    search?: string;
  }>({});

  // Sử dụng useRef để theo dõi lần chạy đầu tiên
  const initialRender = useRef(true);

  // Danh sách chức vụ và phòng ban
  const [positions] = useState<Employee.PositionItem[]>(getPositions());
  const [departments] = useState<Employee.DepartmentItem[]>(getDepartments());
  const [statusList] = useState<Employee.StatusEnum[]>(getStatusList());

  // Lấy danh sách nhân viên từ localStorage
  const getEmployeeData = () => {
    // Khởi tạo dữ liệu mẫu nếu chưa có
    initSampleData();
    
    // Lấy danh sách nhân viên
    const employees = getEmployees();
    
    // Sắp xếp theo lương giảm dần
    employees.sort((a, b) => b.salary - a.salary);
    
    setData(employees);
  };

  // Lọc danh sách nhân viên theo điều kiện
  const getFilteredData = () => {
    let filteredData = [...data];
    
    // Lọc theo chức vụ
    if (filter.position) {
      filteredData = filteredData.filter((item: Employee.Record) => item.position === filter.position);
    }
    
    // Lọc theo phòng ban
    if (filter.department) {
      filteredData = filteredData.filter((item: Employee.Record) => item.department === filter.department);
    }
    
    // Tìm kiếm theo mã hoặc tên
    if (filter.search) {
      const searchValue = filter.search.toLowerCase();
      filteredData = filteredData.filter(
        (item: Employee.Record) => item.id.toLowerCase().includes(searchValue) || 
                item.name.toLowerCase().includes(searchValue)
      );
    }
    
    // Sắp xếp theo lương giảm dần
    filteredData.sort((a: Employee.Record, b: Employee.Record) => b.salary - a.salary);
    
    return filteredData;
  };
  
  // Tạo mã nhân viên mới 
  const generateEmployeeId = (): string => {
    // Lấy danh sách nhân viên trực tiếp từ localStorage để đảm bảo dữ liệu mới nhất
    const currentEmployees = getEmployees();
    
    // Tìm ID lớn nhất hiện tại để tạo ID mới
    const maxId = currentEmployees.reduce((max: number, employee: Employee.Record) => {
      // Trích xuất phần số từ mã nhân viên (bỏ 'NV' ở đầu)
      const idNumber = parseInt(employee.id.replace(/\D/g, ''), 10);
      return !isNaN(idNumber) && idNumber > max ? idNumber : max;
    }, 0);
    
    // Tạo ID mới bằng cách tăng giá trị lớn nhất lên 1
    return `NV${(maxId + 1).toString().padStart(3, '0')}`;
  };
  
  // Thêm mới nhân viên
  const addEmployee = (employee: Omit<Employee.Record, 'id'>) => {
    const newId = generateEmployeeId();
    
    const newEmployee: Employee.Record = {
      ...employee,
      id: newId,
    };
    
    // Tạo một bản sao mới của mảng dữ liệu hiện tại
    const currentData = [...data];
    
    // Thêm nhân viên mới vào mảng
    currentData.push(newEmployee);
    
    // Sắp xếp lại theo lương giảm dần
    currentData.sort((a, b) => b.salary - a.salary);
    
    // Lưu vào state và localStorage
    setData(currentData);
    localStorage.setItem('employees', JSON.stringify(currentData));
    
    return newEmployee;
  };
  
  // Cập nhật thông tin nhân viên
  const updateEmployee = (employee: Employee.Record) => {
    const index = data.findIndex((item: Employee.Record) => item.id === employee.id);
    if (index === -1) return;
    
    const newData = [...data];
    newData[index] = employee;
    
    setData(newData);
    localStorage.setItem('employees', JSON.stringify(newData));
  };
  
  // Xóa nhân viên
  const deleteEmployee = (id: string) => {
    const newData = data.filter((item: Employee.Record) => item.id !== id);
    setData(newData);
    localStorage.setItem('employees', JSON.stringify(newData));
  };
  
  // Kiểm tra xem có thể xóa nhân viên
  const canDeleteEmployee = (status: Employee.StatusEnum): boolean => {
    return status === 'Thử việc' || status === 'Đã thôi việc';
  };

  useEffect(() => {
    // Kiểm tra xem đây có phải là lần render đầu tiên không
    if (initialRender.current) {
      getEmployeeData();
      initialRender.current = false;
    }
  }, []);

  return {
    data,
    visible,
    setVisible,
    row,
    setRow,
    isEdit,
    setIsEdit,
    positions,
    departments,
    statusList,
    filter,
    setFilter,
    getFilteredData,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    canDeleteEmployee,
    getEmployeeData,
  };
}; 