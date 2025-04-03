import { generateId } from '@/utils/utils';

// Mã nhân viên bắt đầu từ NV001
const generateEmployeeId = (): string => {
  const id = generateId();
  return `NV${id.toString().padStart(3, '0')}`;
};

// Mock data cho chức vụ
export const getPositions = (): Employee.PositionItem[] => {
  return [
    { id: '1', name: 'Giám đốc' },
    { id: '2', name: 'Trưởng phòng' },
    { id: '3', name: 'Nhân viên' },
    { id: '4', name: 'Thực tập sinh' },
  ];
};

// Mock data cho phòng ban
export const getDepartments = (): Employee.DepartmentItem[] => {
  return [
    { id: '1', name: 'Phòng Nhân sự' },
    { id: '2', name: 'Phòng Kỹ thuật' },
    { id: '3', name: 'Phòng Kinh doanh' },
    { id: '4', name: 'Phòng Tài chính' },
  ];
};

// Danh sách trạng thái nhân viên
export const getStatusList = (): Employee.StatusEnum[] => {
  return ['Thử việc', 'Đã ký hợp đồng', 'Nghỉ phép', 'Đã thôi việc'];
};

// Lấy danh sách nhân viên
export const getEmployees = (): Employee.Record[] => {
  const dataLocal: any = JSON.parse(localStorage.getItem('employees') as any) || [];
  return dataLocal;
};

// Khởi tạo dữ liệu tum lum =))
export const initSampleData = () => {
  const existingData = localStorage.getItem('employees');
  if (!existingData) {
    const sampleData: Employee.Record[] = [
      {
        id: 'NV001',
        name: 'Nguyễn Văn A',
        position: 'Giám đốc',
        department: 'Phòng Nhân sự',
        salary: 20000000,
        status: 'Đã ký hợp đồng',
      },
      {
        id: 'NV002',
        name: 'Trần Thị B',
        position: 'Trưởng phòng',
        department: 'Phòng Kỹ thuật',
        salary: 15000000,
        status: 'Đã ký hợp đồng',
      },
      {
        id: 'NV003',
        name: 'Lê Văn C',
        position: 'Nhân viên',
        department: 'Phòng Kinh doanh',
        salary: 10000000,
        status: 'Thử việc',
      },
      {
        id: 'NV004',
        name: 'Phạm Thị D',
        position: 'Thực tập sinh',
        department: 'Phòng Tài chính',
        salary: 5000000,
        status: 'Đã thôi việc',
      },
    ];
    localStorage.setItem('employees', JSON.stringify(sampleData));
  }
}; 