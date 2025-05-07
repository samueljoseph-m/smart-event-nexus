
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { User, Mail, Phone, MapPin, Briefcase, Check } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '555-123-4567', // Mock data
    address: '123 Church St, Anytown, USA', // Mock data
    bio: 'Passionate about serving and organizing community events.', // Mock data
    department: user?.department || 'N/A'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div>
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  {isEditing ? "Update your personal details below" : "Your personal details and preferences"}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center">
                      Bio / About Me
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>

                {isEditing && (
                  <CardFooter className="border-t bg-gray-50 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="mr-2"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </CardFooter>
                )}
              </form>
            </Card>

            {/* Account Settings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Password</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Change your password to keep your account secure
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Set Up 2FA</Button>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Notifications</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Configure how you receive notifications
                  </p>
                  <Button variant="outline">Notification Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4 flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl bg-purple-200 text-purple-800">
                      {user?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-gray-600 mb-2">{user?.email}</p>
                <div className="mb-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    {user?.role}
                  </span>
                  {user?.isPremium && (
                    <span className="ml-2 badge-premium">
                      Premium
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center mb-4 text-sm">
                  <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{formData.department}</span>
                </div>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="mt-2 w-full">
                    Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Membership</span>
                    <span className="font-medium">{user?.isPremium ? 'Premium' : 'Basic'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Email Verified</span>
                    <span className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" /> Yes
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Account Created</span>
                    <span>May 1, 2024</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Last Login</span>
                    <span>Today</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
