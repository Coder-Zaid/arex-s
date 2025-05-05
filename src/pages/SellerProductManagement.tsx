
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types';
import { Edit, Archive, Tag, Package, AlertCircle } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';
import { products as dummyProducts } from '@/data/products';

const SellerProductManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language, translations, currencySymbol } = useAppSettings();
  const t = translations[language];
  
  // In a real app, we would fetch the products from an API
  // For now, let's pretend some of the dummy products belong to this seller
  const [products, setProducts] = useState<Product[]>(
    dummyProducts.slice(0, 3).map(p => ({...p, sellerId: user?.id, inventory: Math.floor(Math.random() * 30) + 1}))
  );
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    image: '/placeholder.svg',
    rating: 4.0,
    inStock: true,
    inventory: 20,
    isNew: true,
  });
  
  const handleAddProduct = () => {
    const productToAdd = {
      ...newProduct,
      id: `new-${Date.now()}`,
      sellerId: user?.id,
      rating: newProduct.rating || 4.0,
      inStock: newProduct.inventory && newProduct.inventory > 0
    } as Product;
    
    setProducts([productToAdd, ...products]);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      category: '',
      brand: '',
      image: '/placeholder.svg',
      rating: 4.0,
      inStock: true,
      inventory: 20,
      isNew: true,
    });
    
    setShowAddForm(false);
    toast({
      title: "Product Added",
      description: "Your product has been added successfully",
    });
  };
  
  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    // Update the product in the array
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? 
      {...editingProduct, inStock: (editingProduct.inventory || 0) > 0} : p
    );
    
    setProducts(updatedProducts);
    setEditingProduct(null);
    
    toast({
      title: "Product Updated",
      description: "Your product has been updated successfully",
    });
  };
  
  const toggleProductStatus = (productId: string) => {
    const updatedProducts = products.map(p => 
      p.id === productId ? {...p, inStock: !p.inStock} : p
    );
    
    setProducts(updatedProducts);
    
    toast({
      title: "Product Status Updated",
      description: "The product status has been updated",
    });
  };
  
  if (!user?.isSeller) {
    return (
      <Card className="mx-4 my-8">
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'غير مصرح' : 'Unauthorized'}</CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'يجب أن تكون بائعاً للوصول إلى هذه الصفحة' 
              : 'You must be a seller to access this page'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/become-seller')}>
            {language === 'ar' ? 'كن بائعاً' : 'Become a Seller'}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="pb-20 px-4">
      {/* Header */}
      <div className="my-6">
        <h1 className="text-xl font-bold mb-1">
          {language === 'ar' ? 'إدارة المنتجات' : 'Product Management'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {language === 'ar' 
            ? 'إدارة منتجات متجرك' 
            : 'Manage your store products'}
        </p>
      </div>
      
      {/* Add Product Button */}
      {!showAddForm && !editingProduct && (
        <Button 
          className="mb-4 w-full" 
          onClick={() => setShowAddForm(true)}
        >
          {language === 'ar' ? '+ إضافة منتج جديد' : '+ Add New Product'}
        </Button>
      )}
      
      {/* Add Product Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAddProduct();
              }} 
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="productName">
                  {language === 'ar' ? 'اسم المنتج' : 'Product Name'}
                </Label>
                <Input 
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder={language === 'ar' ? 'أدخل اسم المنتج' : 'Enter product name'}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productDescription">
                  {language === 'ar' ? 'وصف المنتج' : 'Product Description'}
                </Label>
                <Textarea 
                  id="productDescription"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder={language === 'ar' ? 'اكتب وصفاً للمنتج' : 'Write a description about your product'}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productPrice">
                    {language === 'ar' ? 'السعر' : 'Price'}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">{currencySymbol}</span>
                    <Input 
                      id="productPrice"
                      type="number"
                      value={newProduct.price?.toString() || ''}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                      className="pl-8"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="productInventory">
                    {language === 'ar' ? 'المخزون' : 'Inventory'}
                  </Label>
                  <Input 
                    id="productInventory"
                    type="number"
                    value={newProduct.inventory?.toString() || ''}
                    onChange={(e) => setNewProduct({...newProduct, inventory: parseInt(e.target.value) || 0})}
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productCategory">
                    {language === 'ar' ? 'الفئة' : 'Category'}
                  </Label>
                  <Select 
                    onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                    defaultValue={newProduct.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر الفئة' : 'Select category'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">
                        {language === 'ar' ? 'إلكترونيات' : 'Electronics'}
                      </SelectItem>
                      <SelectItem value="Clothing">
                        {language === 'ar' ? 'ملابس' : 'Clothing'}
                      </SelectItem>
                      <SelectItem value="Home">
                        {language === 'ar' ? 'منزل' : 'Home'}
                      </SelectItem>
                      <SelectItem value="Beauty">
                        {language === 'ar' ? 'جمال' : 'Beauty'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="productBrand">
                    {language === 'ar' ? 'العلامة التجارية' : 'Brand'}
                  </Label>
                  <Input 
                    id="productBrand"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    placeholder={language === 'ar' ? 'أدخل العلامة التجارية' : 'Enter brand'}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isNew"
                  checked={newProduct.isNew}
                  onCheckedChange={(checked) => setNewProduct({...newProduct, isNew: checked})}
                />
                <Label htmlFor="isNew">
                  {language === 'ar' ? 'منتج جديد' : 'Mark as New'}
                </Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button type="submit">
                  {language === 'ar' ? 'إضافة المنتج' : 'Add Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Edit Product Form */}
      {editingProduct && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'تعديل المنتج' : 'Edit Product'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateProduct();
              }} 
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="editProductName">
                  {language === 'ar' ? 'اسم المنتج' : 'Product Name'}
                </Label>
                <Input 
                  id="editProductName"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editProductDescription">
                  {language === 'ar' ? 'وصف المنتج' : 'Product Description'}
                </Label>
                <Textarea 
                  id="editProductDescription"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editProductPrice">
                    {language === 'ar' ? 'السعر' : 'Price'}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">{currencySymbol}</span>
                    <Input 
                      id="editProductPrice"
                      type="number"
                      value={editingProduct.price.toString()}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                      className="pl-8"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editProductInventory">
                    {language === 'ar' ? 'المخزون' : 'Inventory'}
                  </Label>
                  <Input 
                    id="editProductInventory"
                    type="number"
                    value={editingProduct.inventory?.toString() || '0'}
                    onChange={(e) => setEditingProduct({...editingProduct, inventory: parseInt(e.target.value) || 0})}
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editProductCategory">
                    {language === 'ar' ? 'الفئة' : 'Category'}
                  </Label>
                  <Select 
                    value={editingProduct.category}
                    onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">
                        {language === 'ar' ? 'إلكترونيات' : 'Electronics'}
                      </SelectItem>
                      <SelectItem value="Clothing">
                        {language === 'ar' ? 'ملابس' : 'Clothing'}
                      </SelectItem>
                      <SelectItem value="Home">
                        {language === 'ar' ? 'منزل' : 'Home'}
                      </SelectItem>
                      <SelectItem value="Beauty">
                        {language === 'ar' ? 'جمال' : 'Beauty'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editProductBrand">
                    {language === 'ar' ? 'العلامة التجارية' : 'Brand'}
                  </Label>
                  <Input 
                    id="editProductBrand"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="editIsNew"
                  checked={editingProduct.isNew}
                  onCheckedChange={(checked) => setEditingProduct({...editingProduct, isNew: checked})}
                />
                <Label htmlFor="editIsNew">
                  {language === 'ar' ? 'منتج جديد' : 'Mark as New'}
                </Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingProduct(null)}
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button type="submit">
                  {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Products List */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">
          {language === 'ar' ? 'المنتجات الحالية' : 'Current Products'}
        </h2>
        
        {products.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {language === 'ar' ? 'لا توجد منتجات بعد' : 'No products yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="flex">
                <div className="w-20 h-20 bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Tag size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{product.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{currencySymbol}{product.price.toFixed(2)}</p>
                      {(product.inventory !== undefined) && (
                        <div className="flex items-center mt-1">
                          <Package size={14} className="mr-1" />
                          <span 
                            className={`text-xs ${
                              product.inventory === 0
                                ? 'text-red-500 font-medium'
                                : product.inventory < 10
                                ? 'text-amber-500 font-medium'
                                : 'text-green-600'
                            }`}
                          >
                            {product.inventory === 0
                              ? language === 'ar' ? 'نفذ من المخزون' : 'Out of stock'
                              : product.inventory < 10
                              ? language === 'ar' ? `مخزون منخفض (${product.inventory})` : `Low stock (${product.inventory})`
                              : language === 'ar' ? `متوفر (${product.inventory})` : `In stock (${product.inventory})`
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleProductStatus(product.id)}
                      className={!product.inStock ? 'border-green-500 text-green-500' : 'border-gray-400 text-gray-500'}
                    >
                      {product.inStock 
                        ? language === 'ar' ? 'إلغاء النشر' : 'Unlist' 
                        : language === 'ar' ? 'نشر' : 'List'
                      }
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit size={14} className="mr-1" />
                      {language === 'ar' ? 'تعديل' : 'Edit'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerProductManagement;
