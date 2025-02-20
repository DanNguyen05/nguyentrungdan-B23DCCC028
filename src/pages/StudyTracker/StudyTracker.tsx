// src/pages/StudyTracker/StudyTracker.tsx
import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { useModel } from 'umi';
import Subjects from './Subjects';
import StudyProgressComponent from './StudyProgress';
import MonthlyGoals from './MonthlyGoals';

const { TabPane } = Tabs;

const StudyTracker: React.FC = () => {
  // Lấy các hàm refresh từ model 'study'
  const { refreshSubjects, refreshProgress, refreshGoals } = useModel('study') as any;

  // Khi component mount, gọi các hàm refresh để load dữ liệu từ localStorage
  useEffect(() => {
    refreshSubjects();
    refreshProgress();
    refreshGoals();
  }, []);

  return (
    <div>
      <h2>Study Tracker</h2>
      {/* Sử dụng Tabs để phân chia các chức năng */}
      <Tabs defaultActiveKey="subjects">
        <TabPane tab="Subjects" key="subjects">
          <Subjects />
        </TabPane>
        <TabPane tab="Study Progress" key="progress">
          <StudyProgressComponent />
        </TabPane>
        <TabPane tab="Monthly Goals" key="goals">
          <MonthlyGoals />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StudyTracker;
