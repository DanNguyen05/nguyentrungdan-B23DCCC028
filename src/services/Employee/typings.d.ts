declare namespace Employee {
  type StatusEnum = 'Thử việc' | 'Đã ký hợp đồng' | 'Nghỉ phép' | 'Đã thôi việc';

  interface Record {
    id: string;
    name: string;
    position: string; 
    department: string;
    salary: number;
    status: StatusEnum;
  }

  interface PositionItem {
    id: string;
    name: string;
  }

  interface DepartmentItem {
    id: string;
    name: string;
  }
} 