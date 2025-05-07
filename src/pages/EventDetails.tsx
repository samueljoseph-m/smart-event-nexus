
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth, ROLES } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CheckSquare, 
  UserPlus, 
  CheckCircle2, 
  XCircle
} from 'lucide-react';

// Mock events data
const mockEvents = [
  {
    id: '1',
    title: 'Sunday Service',
    date: '2024-05-12T09:00:00',
    endTime: '2024-05-12T11:30:00',
    location: 'Main Church Hall',
    organizer: 'Worship Department',
    type: 'Church',
    totalAttendees: 120,
    confirmedAttendees: 85,
    tasks: 12,
    completedTasks: 8,
    description: 'Regular Sunday worship service with communion. Includes worship session, offering, sermon, and concluding prayers.',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Johnson Wedding',
    date: '2024-05-18T14:00:00',
    endTime: '2024-05-18T18:00:00',
    location: 'Garden Venue',
    organizer: 'Events Team',
    type: 'Wedding',
    totalAttendees: 80,
    confirmedAttendees: 65,
    tasks: 15,
    completedTasks: 3,
    description: 'Wedding ceremony for Michael and Sarah Johnson. Ceremony followed by reception with dinner and dancing.',
    status: 'upcoming'
  }
];

// Mock tasks data
const mockTasks = [
  { id: '1', title: 'Prepare worship songs', assigned: 'John Smith', department: 'Worship', status: 'completed', priority: 'high', deadline: '2024-05-11 08:00' },
  { id: '2', title: 'Set up chairs', assigned: 'Emily Johnson', department: 'Logistics', status: 'in-progress', priority: 'medium', deadline: '2024-05-12 06:00' },
  { id: '3', title: 'Prepare welcome speech', assigned: 'Michael Brown', department: 'Hospitality', status: 'pending', priority: 'low', deadline: '2024-05-12 07:30' },
  { id: '4', title: 'Set up sound system', assigned: 'David Wilson', department: 'Audio/Visual', status: 'in-progress', priority: 'high', deadline: '2024-05-12 07:00' },
  { id: '5', title: 'Prepare communion elements', assigned: 'Sarah Adams', department: 'Worship', status: 'completed', priority: 'high', deadline: '2024-05-11 20:00' }
];

// Mock guest list data
const mockGuests = [
  { id: '1', name: 'Andrew Thompson', email: 'andrew@example.com', status: 'confirmed', rsvpDate: '2024-04-15' },
  { id: '2', name: 'Jessica Parker', email: 'jessica@example.com', status: 'confirmed', rsvpDate: '2024-04-16' },
  { id: '3', name: 'Robert Johnson', email: 'robert@example.com', status: 'pending', rsvpDate: null },
  { id: '4', name: 'Amanda Lee', email: 'amanda@example.com', status: 'confirmed', rsvpDate: '2024-04-14' },
  { id: '5', name: 'Daniel Wright', email: 'daniel@example.com', status: 'declined', rsvpDate: '2024-04-18' },
  { id: '6', name: 'Elizabeth Bennett', email: 'elizabeth@example.com', status: 'confirmed', rsvpDate: '2024-04-20' }
];

const EventDetails = () => {
  const { id } = useParams();
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Find the event based on the id parameter
  const event = mockEvents.find(e => e.id === id);
  
  const canManageEvent = hasPermission([ROLES.ADMIN, ROLES.DEPARTMENT_HEAD]);
  const canAssignTasks = hasPermission([ROLES.ADMIN, ROLES.DEPARTMENT_HEAD, ROLES.SUPERVISOR]);

  if (!event) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-60">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or may have been removed.</p>
            <Link to="/events">
              <Button>Back to Events</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const eventTasksFiltered = mockTasks.filter((task) => true); // In a real app, filter by event ID
  const eventGuestsFiltered = mockGuests.filter((guest) => true); // In a real app, filter by event ID

  return (
    <Layout>
      <div>
        <div className="flex items-center mb-6">
          <Link to="/events" className="mr-4 text-gray-500 hover:text-gray-700">
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span className="ml-1">Back</span>
            </div>
          </Link>
          <h1 className="page-title">{event.title}</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="guests">Guest List</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date</p>
                          <p>{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-3 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Time</p>
                          <p>
                            {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Location</p>
                          <p>{event.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-3 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Organized by</p>
                          <p>{event.organizer}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">Description</h3>
                      <p className="text-gray-700">{event.description}</p>
                    </div>
                  </CardContent>
                  {canManageEvent && (
                    <CardFooter className="border-t bg-gray-50 flex justify-end">
                      <Button variant="outline" className="mr-2">
                        Edit Event
                      </Button>
                      <Button variant="destructive">
                        Cancel Event
                      </Button>
                    </CardFooter>
                  )}
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Task Completion</span>
                          <span className="text-sm font-medium">{event.completedTasks}/{event.tasks} ({Math.round((event.completedTasks / event.tasks) * 100)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: `${(event.completedTasks / event.tasks) * 100}%` }}>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Guest Confirmation</span>
                          <span className="text-sm font-medium">{event.confirmedAttendees}/{event.totalAttendees} ({Math.round((event.confirmedAttendees / event.totalAttendees) * 100)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: `${(event.confirmedAttendees / event.totalAttendees) * 100}%` }}>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Tasks</span>
                        <span className="font-medium">{event.tasks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Completed Tasks</span>
                        <span className="font-medium">{event.completedTasks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Guests</span>
                        <span className="font-medium">{event.totalAttendees}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Confirmed Guests</span>
                        <span className="font-medium">{event.confirmedAttendees}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Event Type</span>
                        <span className="font-medium">{event.type}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Add to Calendar
                      </Button>
                      {canAssignTasks && (
                        <Button variant="outline" className="w-full flex items-center justify-center">
                          <CheckSquare className="mr-2 h-4 w-4" />
                          Assign New Task
                        </Button>
                      )}
                      {canManageEvent && (
                        <Button variant="outline" className="w-full flex items-center justify-center">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Invite Guests
                        </Button>
                      )}
                      <Button variant="default" className="w-full">
                        Send Reminder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Event Tasks</CardTitle>
                  {canAssignTasks && (
                    <Button size="sm">
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Assign New Task
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eventTasksFiltered.map(task => (
                    <div 
                      key={task.id}
                      className={`p-4 rounded-md border flex flex-col sm:flex-row sm:items-center justify-between task-priority-${task.priority}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium">{task.title}</h3>
                          {task.priority === 'high' && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              High
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span>Assigned to: {task.assigned}</span>
                          <span className="mx-2">•</span>
                          <span>Department: {task.department}</span>
                        </div>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0">
                        <div className="flex items-center mr-4">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-500">{new Date(task.deadline).toLocaleString()}</span>
                        </div>
                        <div>
                          {task.status === 'completed' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </span>
                          ) : task.status === 'in-progress' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              In Progress
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guests Tab */}
          <TabsContent value="guests">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Guest List</CardTitle>
                  {canManageEvent && (
                    <Button size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Guest
                    </Button>
                  )}
                </div>
                <CardDescription>
                  Total Guests: {event.totalAttendees}, Confirmed: {event.confirmedAttendees}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          RSVP Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {eventGuestsFiltered.map((guest) => (
                        <tr key={guest.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-purple-200 text-purple-800">
                                  {guest.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{guest.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {guest.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {guest.status === 'confirmed' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Confirmed
                              </span>
                            ) : guest.status === 'declined' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="h-3 w-3 mr-1" />
                                Declined
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {guest.rsvpDate ? new Date(guest.rsvpDate).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination would go here in a real app */}
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Showing {eventGuestsFiltered.length} of {event.totalAttendees} guests
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EventDetails;
