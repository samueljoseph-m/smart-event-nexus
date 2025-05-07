
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, ROLES } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, Users, MapPin, Search, Filter } from 'lucide-react';

// Mock data for events
const mockEvents = [
  {
    id: '1',
    title: 'Sunday Service',
    date: '2024-05-12T09:00:00',
    location: 'Main Church Hall',
    type: 'Church',
    totalAttendees: 120,
    confirmedAttendees: 85,
    tasks: 12,
    completedTasks: 8,
    description: 'Regular Sunday worship service with communion.',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Johnson Wedding',
    date: '2024-05-18T14:00:00',
    location: 'Garden Venue',
    type: 'Wedding',
    totalAttendees: 80,
    confirmedAttendees: 65,
    tasks: 15,
    completedTasks: 3,
    description: 'Wedding ceremony for Michael and Sarah Johnson.',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Community Meeting',
    date: '2024-05-21T18:30:00',
    location: 'Fellowship Hall',
    type: 'Organization',
    totalAttendees: 45,
    confirmedAttendees: 23,
    tasks: 8,
    completedTasks: 2,
    description: 'Monthly community leadership meeting with department reports.',
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Youth Retreat',
    date: '2024-06-15T08:00:00',
    location: 'Camp Wilderness',
    type: 'Church',
    totalAttendees: 35,
    confirmedAttendees: 28,
    tasks: 20,
    completedTasks: 5,
    description: 'Annual youth retreat with activities and spiritual growth sessions.',
    status: 'upcoming'
  },
  {
    id: '5',
    title: 'Easter Service',
    date: '2024-04-21T10:00:00',
    location: 'Main Church Hall',
    type: 'Church',
    totalAttendees: 150,
    confirmedAttendees: 142,
    tasks: 18,
    completedTasks: 18,
    description: 'Special Easter celebration service.',
    status: 'completed'
  }
];

const Events = () => {
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const canCreateEvents = hasPermission([ROLES.ADMIN, ROLES.DEPARTMENT_HEAD]);

  // Filter events based on search and filters
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || event.type.toLowerCase() === filterType.toLowerCase();
    
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Layout>
      <div>
        <div className="page-header">
          <h1 className="page-title">Events</h1>
          {canCreateEvents && (
            <Link to="/events/create">
              <Button>Create Event</Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search events..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>{filterType === "all" ? "All Types" : filterType}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Church">Church</SelectItem>
              <SelectItem value="Wedding">Wedding</SelectItem>
              <SelectItem value="Organization">Organization</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>{filterStatus === "all" ? "All Status" : filterStatus === "upcoming" ? "Upcoming" : "Completed"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
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
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{new Date(event.date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{event.confirmedAttendees} / {event.totalAttendees} attendees confirmed</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tasks: {event.completedTasks} of {event.tasks} completed</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${(event.completedTasks / event.tasks) * 100}%` }}>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/events/${event.id}`} className="w-full">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center p-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Events;
