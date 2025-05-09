import React, { useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Save } from 'lucide-react';

const SellerProductsPage = () => {
  const { products, removeProduct, updateProduct } = useProducts();
  const { user } = useAuth();
  const sellerProducts = products.filter(p => p.seller === user?.id);
  const [editId, setEditId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const startEdit = (product: any) => {
    setEditId(product.id);
    setEditPrice(product.price.toString());
    setEditStock(product.inventory?.toString() || '');
  };

  const saveEdit = (product: any) => {
    updateProduct({ ...product, price: parseFloat(editPrice), inventory: parseInt(editStock) });
    setEditId(null);
  };

  const handleRemove = (productId: string) => {
    setConfirmRemoveId(productId);
  };

  const confirmRemove = () => {
    if (confirmRemoveId) {
      removeProduct(confirmRemoveId);
      setConfirmRemoveId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-transparent pb-24 px-4 text-black">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            {sellerProducts.length === 0 ? (
              <div className="text-gray-500">No products uploaded yet.</div>
            ) : (
              <div className="space-y-4">
                {sellerProducts.map(product => (
                  <div key={product.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/80">
                    <div className="flex items-center gap-4">
                      {product.image && (
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded shadow" />
                      )}
                      <div>
                        <div className="font-bold text-lg mb-1">{product.name}</div>
                        <div className="mb-1">Stock: {editId === product.id ? (
                          <Input type="number" min="0" value={editStock} onChange={e => setEditStock(e.target.value)} className="w-24 inline-block" />
                        ) : (
                          product.inventory
                        )}</div>
                        <div className="mb-1">Price: {editId === product.id ? (
                          <Input type="number" min="0" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="w-24 inline-block" />
                        ) : (
                          product.price
                        )}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      {editId === product.id ? (
                        <Button size="sm" onClick={() => saveEdit(product)} className="bg-green-500 text-white"><Save size={16} /></Button>
                      ) : (
                        <Button size="sm" onClick={() => startEdit(product)} className="bg-blue-500 text-white"><Pencil size={16} /></Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => handleRemove(product.id)}><Trash2 size={16} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Confirmation Dialog */}
            {confirmRemoveId && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
                  <h2 className="text-lg font-bold mb-4">Remove Product?</h2>
                  <p className="mb-6">Are you sure you want to remove this product? This action cannot be undone.</p>
                  <div className="flex justify-center gap-4">
                    <Button variant="destructive" onClick={confirmRemove}>Remove</Button>
                    <Button variant="outline" onClick={() => setConfirmRemoveId(null)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerProductsPage; 