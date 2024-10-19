import { VisitorTaskViewSwitcher } from "@/features/visitors/components/visitor-task-view-switcher";

const TasksVisitorPage = async () => {
  return (
    <div className="h-full flex flex-col">
      <VisitorTaskViewSwitcher />
    </div>
  )
};

export default TasksVisitorPage;