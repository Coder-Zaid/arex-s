import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '@/context/OrderContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ChevronLeft, FileText } from 'lucide-react';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { orders } = useOrder();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-blue via-purple-700 to-red-500 pb-24 px-4 text-white">
      <div className="flex items-center gap-2 pt-6 mb-6">
        <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate('/profile')}>
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Order History</h1>
      </div>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <FileText size={64} className="mb-4 text-white/60" />
          <h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-white/80 mb-4">You haven't placed any orders yet. Start shopping to see your history here!</p>
          <Button className="bg-white/20 text-white hover:bg-white/30" onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      ) : (
        <div className="space-y-4 max-w-xl mx-auto">
          {orders.map(order => (
            <Card key={order.id} className="bg-white/10 shadow-lg border-0 text-white">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Package size={32} className="text-white/80" />
                  <div>
                    <div className="font-bold text-lg">Order #{order.id.substr(-6)}</div>
                    <div className="text-white/80 text-sm">{new Date(order.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex flex-col md:items-end">
                  <span className={`text-xs px-2 py-1 rounded mb-1 w-fit ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <Button size="sm" variant="outline" className="mt-2 bg-white/20 text-white border-white/30 hover:bg-white/30" onClick={() => navigate(`/order/${order.id}`)}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage; 