import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const PersonalInfoPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-blue via-purple-700 to-red-500 pb-24 px-4 text-white">
      <div className="flex items-center gap-2 pt-6 mb-6">
        <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate('/profile')}>
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Personal Information</h1>
      </div>
      <div className="max-w-md mx-auto space-y-8">
        <Card className="bg-white/10 shadow-lg border-0 text-white">
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block mb-1 text-white">Username</label>
              <Input className="bg-white/20 text-white border-white/30" value={user?.displayName || ''} readOnly disabled />
            </div>
            <div>
              <label className="block mb-1 text-white">Email</label>
              <Input className="bg-white/20 text-white border-white/30" value={user?.email || ''} readOnly disabled />
            </div>
            <div>
              <label className="block mb-1 text-white">Phone</label>
              <Input className="bg-white/20 text-white border-white/30" value={user?.phone || ''} readOnly disabled />
            </div>
            <div>
              <label className="block mb-1 text-white">Address</label>
              <Input className="bg-white/20 text-white border-white/30" value={user?.address || ''} readOnly disabled />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 shadow-lg border-0 text-white">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-bold text-lg mb-2">Change Password</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 text-white">Current Password</label>
                <Input type="password" className="bg-white/20 text-white border-white/30" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" />
              </div>
              <div>
                <label className="block mb-1 text-white">New Password</label>
                <Input type="password" className="bg-white/20 text-white border-white/30" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" />
              </div>
              <div>
                <label className="block mb-1 text-white">Confirm New Password</label>
                <Input type="password" className="bg-white/20 text-white border-white/30" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
              </div>
              <Button className="w-full bg-brand-blue text-white mt-4">Change Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalInfoPage; 