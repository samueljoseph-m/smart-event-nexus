
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, ROLES } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckSquare, Users, Clock, Bell } from 'lucide-react';

// Mock data for dashboard stats and tasks
const mockEvents = [
  { id: '1', title: 'Sunday Service', date: '2024-05-12', tasks: 12, completed: 8, type: 'Church' },
  { id: '2', title: 'Johnson Wedding', date: '2024-05-18', tasks: 15, completed: 3, type: 'Wedding' },
  { id: '3', title: 'Community Meeting', date: '2024-05-21', tasks: 8, completed: 2, type: 'Organization' }
];

const mockTasks = [
  { id: '1', title: 'Prepare worship songs', eventTitle: 'Sunday Service', priority: 'high', deadline: '2024-05-11 08:00' },
  { id: '2', title: 'Set up chairs', eventTitle: 'Sunday Service', priority: 'medium', deadline: '2024-05-12 06:00' },
  { id: '3', title: 'Prepare welcome speech', eventTitle: 'Johnson Wedding', priority: 'low', deadline: '2024-05-17 18:00' }
];

const Dashboard = () => {
  const { user, hasPermission } = useAuth();
  
  const isAdmin = hasPermission([ROLES.ADMIN]);
  const isDepartmentHead = hasPermission([ROLES.DEPARTMENT_HEAD]);
  const isPremiumUser = user?.isPremium;

  // Define stats based on role
  let statsItems = [
    { title: 'Upcoming Events', value: '3', icon: <Calendar className="h-8 w-8 text-purple-500" /> },
    { title: 'Pending Tasks', value: '7', icon: <CheckSquare className="h-8 w-8 text-purple-500" /> },
  ];
  
  // Add admin/department-specific stats
  if (isAdmin || isDepartmentHead) {
    statsItems = [
      ...statsItems,
      { title: 'Team Members', value: '24', icon: <Users className="h-8 w-8 text-purple-500" /> }
    ];
  }

  return (
    <Layout>
      <div>
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          {isPremiumUser && (
            <span className="badge-premium">
              Premium Account
            </span>
          )}
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Welcome, <span className="font-medium">{user?.name}</span>! Here's what's happening in your events.
          </p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          {statsItems.map((item, index) => (
            <Card key={index} className="stat-card">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.title}</p>
                  <p className="text-3xl font-bold">{item.value}</p>
                </div>
                <div>{item.icon}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Events */}
        <h2 className="section-title">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{new Date(event.date).toLocaleDateString()}</CardDescription>
                  </div>
                  <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
                    {event.type}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tasks: {event.completed} of {event.tasks} completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${(event.completed / event.tasks) * 100}%` }}>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/events/${event.id}`} className="w-full">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Your Tasks */}
        <h2 className="section-title">Your Tasks</h2>
        <Card>
          <CardContent className="p-6">
            {mockTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 mb-4 rounded-md border bg-white flex flex-col sm:flex-row sm:items-center justify-between task-priority-${task.priority}`}
              >
                <div className="flex-1">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">Event: {task.eventTitle}</p>
                </div>
                <div className="flex items-center mt-2 sm:mt-0">
                  <div className="flex items-center mr-4 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date(task.deadline).toLocaleString()}</span>
                  </div>
                  <Button size="sm">Mark Complete</Button>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Link to="/tasks" className="w-full">
              <Button variant="outline" className="w-full">View All Tasks</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Recent Notifications */}
        <h2 className="section-title mt-8">Recent Notifications</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-4">
                  <Bell size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">New task assigned</p>
                  <p className="text-sm text-gray-600">You've been assigned to "Set up sound system" for Sunday Service</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-4">
                  <Bell size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Event updated</p>
                  <p className="text-sm text-gray-600">The details for "Johnson Wedding" have been updated</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {(isAdmin || isDepartmentHead) && (
          <>
            <h2 className="section-title mt-8">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/events/create">
                <Button variant="outline" className="w-full">
                  Create New Event
                </Button>
              </Link>
              <Link to="/tasks">
                <Button variant="outline" className="w-full">
                  Assign Tasks
                </Button>
              </Link>
              <Link to="/users">
                <Button variant="outline" className="w-full">
                  Manage Team
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
