
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Filter, UserPlus, UserCheck, Edit, Trash2, Check, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock users data
const mockUsers = [
  { 
    id: '1', 
    name: 'Admin User', 
    email: 'admin@example.com', 
    role: ROLES.ADMIN,
    department: null,
    isActive: true,
    isPremium: true
  },
  { 
    id: '2', 
    name: 'Department Head', 
    email: 'department@example.com', 
    role: ROLES.DEPARTMENT_HEAD,
    department: 'Worship',
    isActive: true,
    isPremium: true
  },
  { 
    id: '3', 
    name: 'Supervisor Name', 
    email: 'supervisor@example.com', 
    role: ROLES.SUPERVISOR,
    department: 'Cleaning',
    isActive: true,
    isPremium: false
  },
  { 
    id: '4', 
    name: 'Volunteer Name', 
    email: 'volunteer@example.com', 
    role: ROLES.VOLUNTEER,
    department: 'Greeting',
    isActive: true,
    isPremium: false
  },
  { 
    id: '5', 
    name: 'John Smith', 
    email: 'john@example.com', 
    role: ROLES.VOLUNTEER,
    department: 'Audio/Visual',
    isActive: true,
    isPremium: false
  },
  { 
    id: '6', 
    name: 'Sarah Wilson', 
    email: 'sarah@example.com', 
    role: ROLES.VOLUNTEER,
    department: 'Worship',
    isActive: true,
    isPremium: false
  },
  { 
    id: '7', 
    name: 'Mark Johnson', 
    email: 'mark@example.com', 
    role: ROLES.SUPERVISOR,
    department: 'Hospitality',
    isActive: false,
    isPremium: false
  }
];

// Define departments for filtering
const departments = ["All", "Worship", "Logistics", "Hospitality", "Audio/Visual", "Cleaning", "Greeting"];

const Users = () => {
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("All");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: ROLES.VOLUNTEER,
    department: departments[0]
  });
  
  const isAdmin = hasPermission([ROLES.ADMIN]);
  const canManageAllUsers = isAdmin;
  const canManageDepartment = hasPermission([ROLES.DEPARTMENT_HEAD]) && user?.department;

  // If not admin or department head, redirect (would normally use protected route)
  if (!isAdmin && !canManageDepartment) {
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

  // Filter users based on search, filters
  const filteredUsers = mockUsers.filter(u => {
    // For department heads, only show users in their department
    if (canManageDepartment && !isAdmin && u.department !== user?.department) {
      return false;
    }

    // Text search
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Role filter
    const matchesRole = filterRole === "all" || u.role === filterRole;
    
    // Department filter
    const matchesDepartment = filterDepartment === "All" || u.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const handleAddUser = () => {
    // In a real app, this would be an API call to add the user
    toast({
      title: "User Added",
      description: `${newUserData.name} has been added as a ${newUserData.role}.`,
    });
    setIsAddDialogOpen(false);
    
    // Reset form data
    setNewUserData({
      name: '',
      email: '',
      role: ROLES.VOLUNTEER,
      department: departments[0]
    });
  };

  return (
    <Layout>
      <div>
        <div className="page-header">
          <h1 className="page-title">
            {canManageDepartment && !isAdmin 
              ? `Team Members (${user?.department})` 
              : "All Users"}
          </h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Add a new team member to your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <Input 
                    id="name" 
                    value={newUserData.name} 
                    onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newUserData.email} 
                    onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                    placeholder="john@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">Role</label>
                  <Select 
                    value={newUserData.role} 
                    onValueChange={(value) => setNewUserData({...newUserData, role: value as any})}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {isAdmin && (
                        <>
                          <SelectItem value={ROLES.ADMIN}>{ROLES.ADMIN}</SelectItem>
                          <SelectItem value={ROLES.DEPARTMENT_HEAD}>{ROLES.DEPARTMENT_HEAD}</SelectItem>
                        </>
                      )}
                      <SelectItem value={ROLES.SUPERVISOR}>{ROLES.SUPERVISOR}</SelectItem>
                      <SelectItem value={ROLES.VOLUNTEER}>{ROLES.VOLUNTEER}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium">Department</label>
                  <Select 
                    value={newUserData.department} 
                    onValueChange={(value) => setNewUserData({...newUserData, department: value})}
                    disabled={canManageDepartment && !isAdmin}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.slice(1).map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search users..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>{filterRole === "all" ? "All Roles" : filterRole}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value={ROLES.ADMIN}>{ROLES.ADMIN}</SelectItem>
              <SelectItem value={ROLES.DEPARTMENT_HEAD}>{ROLES.DEPARTMENT_HEAD}</SelectItem>
              <SelectItem value={ROLES.SUPERVISOR}>{ROLES.SUPERVISOR}</SelectItem>
              <SelectItem value={ROLES.VOLUNTEER}>{ROLES.VOLUNTEER}</SelectItem>
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

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-purple-200 text-purple-800">
                                {u.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{u.name}</p>
                              <p className="text-sm text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {u.role}
                          </span>
                          {u.isPremium && (
                            <span className="ml-2 badge-premium">
                              Premium
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {u.department || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {u.isActive ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              <X className="h-3 w-3 mr-1" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center">
                        <p className="text-gray-500">No users found matching your criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination would go here in a real app */}
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {filteredUsers.length} users
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
      </div>
    </Layout>
  );
};

export default Users;
