
import React, { useState } from 'react';
import { useAuth, ROLES } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Edit, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock departments data
const mockDepartments = [
  { 
    id: '1', 
    name: 'Worship', 
    description: 'Leads worship services and manages music for events.',
    memberCount: 12,
    headCount: 1,
    leadName: 'Department Head',
    leadEmail: 'department@example.com'
  },
  { 
    id: '2', 
    name: 'Logistics', 
    description: 'Handles venue setup, equipment management, and physical arrangements.',
    memberCount: 8,
    headCount: 1,
    leadName: 'Robert Johnson',
    leadEmail: 'robert@example.com'
  },
  { 
    id: '3', 
    name: 'Hospitality', 
    description: 'Manages guest services, welcomes visitors, and coordinates refreshments.',
    memberCount: 15,
    headCount: 2,
    leadName: 'Sarah Wilson',
    leadEmail: 'sarah@example.com'
  },
  { 
    id: '4', 
    name: 'Audio/Visual', 
    description: 'Handles sound systems, lighting, presentations, and media needs.',
    memberCount: 6,
    headCount: 1,
    leadName: 'David Smith',
    leadEmail: 'david@example.com'
  },
  { 
    id: '5', 
    name: 'Cleaning', 
    description: 'Maintains cleanliness of venues before and after events.',
    memberCount: 10,
    headCount: 1,
    leadName: 'Supervisor Name',
    leadEmail: 'supervisor@example.com'
  },
  { 
    id: '6', 
    name: 'Greeting', 
    description: 'Welcomes attendees and provides information at events.',
    memberCount: 8,
    headCount: 1,
    leadName: 'Mary Johnson',
    leadEmail: 'mary@example.com'
  }
];

const Departments = () => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDepartmentData, setNewDepartmentData] = useState({
    name: '',
    description: ''
  });
  
  const isAdmin = hasPermission([ROLES.ADMIN]);

  // If not admin, redirect (would normally use protected route)
  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-60">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to view this page.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Filter departments based on search
  const filteredDepartments = mockDepartments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDepartment = () => {
    // In a real app, this would be an API call to add the department
    toast({
      title: "Department Added",
      description: `${newDepartmentData.name} department has been created.`,
    });
    setIsAddDialogOpen(false);
    
    // Reset form data
    setNewDepartmentData({
      name: '',
      description: ''
    });
  };

  return (
    <Layout>
      <div>
        <div className="page-header">
          <h1 className="page-title">Departments</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
                <DialogDescription>
                  Add a new department to your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Department Name</label>
                  <Input 
                    id="name" 
                    value={newDepartmentData.name} 
                    onChange={(e) => setNewDepartmentData({...newDepartmentData, name: e.target.value})}
                    placeholder="e.g. Media Team" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Input 
                    id="description" 
                    value={newDepartmentData.description} 
                    onChange={(e) => setNewDepartmentData({...newDepartmentData, description: e.target.value})}
                    placeholder="Brief description of the department's responsibilities" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddDepartment}>Create Department</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input 
            placeholder="Search departments..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{dept.name}</CardTitle>
                <CardDescription>{dept.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm">{dept.memberCount} members • {dept.headCount} department head(s)</span>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-purple-200 text-purple-800">
                      {dept.leadName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{dept.leadName}</p>
                    <p className="text-xs text-gray-500">{dept.leadEmail}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t flex justify-between">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center p-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No departments found matching your search.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Departments;
