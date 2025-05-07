
import React, { useState } from 'react';
import { useAuth, ROLES } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, CheckSquare, Clock, Filter, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock tasks data
const mockTasks = [
  { 
    id: '1', 
    title: 'Prepare worship songs', 
    eventId: '1',
    eventTitle: 'Sunday Service',
    assigned: 'John Smith', 
    department: 'Worship', 
    status: 'completed', 
    priority: 'high', 
    deadline: '2024-05-11T08:00:00',
    description: 'Select worship songs for the service and prepare sheet music for the team.'
  },
  { 
    id: '2', 
    title: 'Set up chairs', 
    eventId: '1',
    eventTitle: 'Sunday Service', 
    assigned: 'Emily Johnson', 
    department: 'Logistics', 
    status: 'in-progress', 
    priority: 'medium', 
    deadline: '2024-05-12T06:00:00',
    description: 'Arrange chairs in the main hall according to the layout plan.'
  },
  { 
    id: '3', 
    title: 'Prepare welcome speech', 
    eventId: '2',
    eventTitle: 'Johnson Wedding', 
    assigned: 'Michael Brown', 
    department: 'Hospitality', 
    status: 'pending', 
    priority: 'low', 
    deadline: '2024-05-17T18:00:00',
    description: 'Write and practice a welcome speech for the wedding guests.'
  },
  { 
    id: '4', 
    title: 'Set up sound system', 
    eventId: '1',
    eventTitle: 'Sunday Service', 
    assigned: 'David Wilson', 
    department: 'Audio/Visual', 
    status: 'in-progress', 
    priority: 'high', 
    deadline: '2024-05-12T07:00:00',
    description: 'Set up and test microphones, speakers, and audio equipment.'
  },
  { 
    id: '5', 
    title: 'Prepare communion elements', 
    eventId: '1',
    eventTitle: 'Sunday Service', 
    assigned: 'Sarah Adams', 
    department: 'Worship', 
    status: 'completed', 
    priority: 'high', 
    deadline: '2024-05-11T20:00:00',
    description: 'Prepare bread and wine for communion service.'
  }
];

// Define departments for filtering
const departments = ["All", "Worship", "Logistics", "Hospitality", "Audio/Visual", "Cleaning"];

const Tasks = () => {
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  
  const isAdmin = hasPermission([ROLES.ADMIN]);
  const isDepartmentHead = hasPermission([ROLES.DEPARTMENT_HEAD]);
  const isSupervisor = hasPermission([ROLES.SUPERVISOR]);
  const canAssignTasks = isAdmin || isDepartmentHead || isSupervisor;

  // Filter tasks based on search, filters, and active tab
  const filteredTasks = mockTasks.filter(task => {
    // Text search
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Priority filter
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    
    // Department filter
    const matchesDepartment = filterDepartment === "All" || task.department === filterDepartment;
    
    // Tab filter
    const matchesTab = activeTab === "all" || 
                      (activeTab === "assigned" && (isAdmin || task.assigned === user?.name)) ||
                      (activeTab === "pending" && task.status === "pending") ||
                      (activeTab === "completed" && task.status === "completed");
    
    return matchesSearch && matchesPriority && matchesDepartment && matchesTab;
  });

  const handleCompleteTask = (taskId: string) => {
    // In a real app, this would update the task status via API
    toast({
      title: "Task Completed",
      description: "Task has been marked as complete.",
    });
  };

  return (
    <Layout>
      <div>
        <div className="page-header">
          <h1 className="page-title">Tasks</h1>
          {canAssignTasks && (
            <Button>
              <CheckSquare className="mr-2 h-4 w-4" />
              Assign New Task
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="assigned">
              {isAdmin ? "Tasks by User" : "My Tasks"}
            </TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>{filterPriority === "all" ? "Priority" : filterPriority}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <span>Department: {filterDepartment}</span>
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "all" ? "All Tasks" : 
               activeTab === "assigned" ? (isAdmin ? "Tasks by User" : "My Tasks") : 
               activeTab === "pending" ? "Pending Tasks" : 
               "Completed Tasks"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-md border bg-white flex flex-col sm:flex-row sm:items-center justify-between task-priority-${task.priority}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="font-medium">{task.title}</h3>
                        {task.priority === 'high' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex flex-wrap gap-y-2 text-xs text-gray-500">
                        <div className="flex items-center mr-4">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Event: {task.eventTitle}</span>
                        </div>
                        <div className="flex items-center mr-4">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                          <span className="ml-1">Assigned to: {task.assigned}</span>
                        </div>
                        <div className="flex items-center mr-4">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Due: {new Date(task.deadline).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center mt-3 sm:mt-0 self-end">
                      {task.status === 'completed' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      ) : (
                        <Button size="sm" onClick={() => handleCompleteTask(task.id)}>
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No tasks found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Tasks;
