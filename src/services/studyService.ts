// src/services/studyService.ts
import { SubjectCategory, StudyProgress, StudyGoal } from '@/models/study';

// Các key lưu trữ trong localStorage
const SUBJECTS_KEY = 'subjects';
const PROGRESS_KEY = 'progress';
const GOALS_KEY = 'goals';

/**
 * Hàm getSubjects: Lấy danh sách môn học từ localStorage.
 * Nếu chưa có, lưu danh sách mặc định gồm Toán, Văn, Anh, Khoa học, Công nghệ, Lập trình.
 */
export const getSubjects = (): SubjectCategory[] => {
  const data = localStorage.getItem(SUBJECTS_KEY);
  try {
    if (data) {
      return JSON.parse(data);
    } else {
      // Danh sách mặc định
      const defaultSubjects: SubjectCategory[] = [
        { id: 'toan', name: 'Toán' },
        { id: 'van', name: 'Văn' },
        { id: 'anh', name: 'Anh' },
        { id: 'khoahoc', name: 'Khoa học' },
        { id: 'congnghe', name: 'Công nghệ' },
        { id: 'laptrinh', name: 'Lập trình' },
      ];
      localStorage.setItem(SUBJECTS_KEY, JSON.stringify(defaultSubjects));
      return defaultSubjects;
    }
  } catch (error) {
    console.error('Error parsing subjects:', error);
    return [];
  }
};

/**
 * Hàm saveSubjects: Lưu danh sách môn học vào localStorage.
 */
export const saveSubjects = (subjects: SubjectCategory[]): void => {
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
};

/**
 * Hàm getStudyProgress: Lấy danh sách tiến độ học tập từ localStorage.
 */
export const getStudyProgress = (): StudyProgress[] => {
  const data = localStorage.getItem(PROGRESS_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error parsing study progress:', error);
    return [];
  }
};

/**
 * Hàm saveStudyProgress: Lưu danh sách tiến độ học tập vào localStorage.
 */
export const saveStudyProgress = (progress: StudyProgress[]): void => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

/**
 * Hàm getStudyGoals: Lấy danh sách mục tiêu học tập từ localStorage.
 */
export const getStudyGoals = (): StudyGoal[] => {
  const data = localStorage.getItem(GOALS_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error parsing study goals:', error);
    return [];
  }
};

/**
 * Hàm saveStudyGoals: Lưu danh sách mục tiêu học tập vào localStorage.
 */
export const saveStudyGoals = (goals: StudyGoal[]): void => {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};
