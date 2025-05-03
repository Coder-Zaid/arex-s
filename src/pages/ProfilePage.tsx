
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { LogOut, Package, ChevronRight, User, CreditCard, Settings } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { orders } = useOrder();
  
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="pb-24">
      <div className="bg-brand-blue text-white p-6 relative">
        <div className="flex items-center">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center text-brand-blue mr-4">
            <User size={32} />
          </div>
          <div>
            <h1 className="font-bold text-xl">{user?.name || 'User'}</h1>
            <p className="opacity-80 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/20 text-white hover:bg-white/30"
          >
            Edit Profile
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/20 text-white hover:bg-white/30"
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-1" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">My Orders</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-brand-blue"
            onClick={() => navigate('/orders')}
          >
            View All
          </Button>
        </div>
        
        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.slice(0, 2).map((order) => (
              <Card key={order.id} onClick={() => navigate(`/order/${order.id}`)}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Package className="mr-3 text-gray-400" size={18} />
                      <div>
                        <p className="font-medium text-sm">Order #{order.id.substr(-6)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <ChevronRight size={16} className="text-gray-400 ml-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-gray-500">No orders yet</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Account Settings */}
      <div className="p-4">
        <h2 className="font-bold mb-3">Account Settings</h2>
        
        <Card>
          <CardContent className="p-0">
            <MenuItem 
              icon={<User size={18} />}
              title="Personal Information"
              onClick={() => navigate('/profile/edit')}
            />
            <MenuItem 
              icon={<CreditCard size={18} />}
              title="Payment Methods"
              onClick={() => navigate('/profile/payment')}
            />
            <MenuItem 
              icon={<Package size={18} />}
              title="Shipping Addresses"
              onClick={() => navigate('/profile/address')}
            />
            <MenuItem 
              icon={<Settings size={18} />}
              title="Settings"
              onClick={() => navigate('/profile/settings')}
              noBorder
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  noBorder?: boolean;
}

const MenuItem = ({ icon, title, onClick, noBorder = false }: MenuItemProps) => (
  <div 
    className={`flex items-center justify-between p-4 ${noBorder ? '' : 'border-b'} cursor-pointer`}
    onClick={onClick}
  >
    <div className="flex items-center">
      <span className="text-gray-500 mr-3">{icon}</span>
      <span>{title}</span>
    </div>
    <ChevronRight size={16} className="text-gray-400" />
  </div>
);

export default ProfilePage;
