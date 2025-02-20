// src/models/study.ts

import { useState } from 'react';
import {
  getSubjects,
  getStudyProgress,
  getStudyGoals,
  saveSubjects,
  saveStudyProgress,
  saveStudyGoals,
} from '@/services/studyService';

/**
 * Định nghĩa các interface cho Study Tracker
 */
export interface SubjectCategory {
  id: string;
  name: string;
}

export interface StudyProgress {
  id: string;
  subjectId: string; // Liên kết với SubjectCategory
  studyDate: string; // ISO string (ngày giờ)
  duration: number;  // Thời lượng học (phút)
  content: string;
  notes?: string;
}

/**
 * Interface cho mục tiêu học tập, bổ sung startDate và endDate để xác định khoảng thời gian áp dụng
 */
export interface StudyGoal {
  id: string;
  subjectId: string;         // Môn học cụ thể, hoặc 'overall' cho mục tiêu tổng
  targetDuration: number;    // Mục tiêu (phút)
  startDate?: string;        // Ngày bắt đầu (ISO string)
  endDate?: string;          // Ngày kết thúc (ISO string)
}

/**
 * Custom hook chính cho Study Tracker.
 * Umi sẽ tự động nhận diện model này với key 'study'
 * vì nó nằm trực tiếp trong thư mục src/models.
 */
export default () => {
  // Khởi tạo state bằng dữ liệu lấy từ localStorage
  const [subjects, setSubjects] = useState<SubjectCategory[]>(getSubjects());
  const [progressList, setProgressList] = useState<StudyProgress[]>(getStudyProgress());
  const [goals, setGoals] = useState<StudyGoal[]>(getStudyGoals());

  // Hàm refreshSubjects: Cập nhật danh sách môn học từ localStorage
  const refreshSubjects = () => {
    setSubjects(getSubjects());
  };

  // Hàm refreshProgress: Cập nhật danh sách tiến độ học tập từ localStorage
  const refreshProgress = () => {
    setProgressList(getStudyProgress());
  };

  // Hàm refreshGoals: Cập nhật danh sách mục tiêu học tập từ localStorage
  const refreshGoals = () => {
    setGoals(getStudyGoals());
  };

  /**
   * Hàm addOrUpdateSubject (ví dụ): Thêm hoặc sửa môn học.
   * Đây chỉ là ví dụ, bạn có thể tự xây dựng các hàm tương tự cho progress hay goals.
   */
  const addOrUpdateSubject = (subject: SubjectCategory) => {
    const newSubjects = subjects.some(s => s.id === subject.id)
      ? subjects.map(s => (s.id === subject.id ? subject : s))
      : [subject, ...subjects];
    saveSubjects(newSubjects);
    refreshSubjects();
  };

  // Trả về toàn bộ state và các hàm refresh để các component khác sử dụng thông qua useModel('study')
  return {
    subjects,
    setSubjects,
    refreshSubjects,

    progressList,
    setProgressList,
    refreshProgress,

    goals,
    setGoals,
    refreshGoals,

    addOrUpdateSubject,
  };
};
