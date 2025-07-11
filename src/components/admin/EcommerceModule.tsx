import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Product, Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ProductForm from './ProductForm';
import { useToast } from '@/hooks/use-toast';

const EcommerceModule: React.FC = () => {
    const { school } = useSchool();
    const { user } = useAuth();
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

    const fetchProducts = async () => {
        if (!school) return;
        const allProducts = await sdk.get<Product>('products');
        setProducts(allProducts.filter(p => p.schoolId === school.id));
    };

    const fetchOrders = async () => {
        if (!school) return;
        const allOrders = await sdk.get<Order>('orders');
        setOrders(allOrders.filter(o => o.schoolId === school.id));
    };

    useEffect(() => {
        if (!school) return;
        setLoading(true);
        Promise.all([fetchProducts(), fetchOrders()]).finally(() => setLoading(false));
    }, [school]);

    const openProductForm = (product: Partial<Product> | null = null) => {
        setEditingProduct(product || {});
        setIsProductFormOpen(true);
    };

    const handleSaveProduct = async () => {
        if (!editingProduct || !school) return;
        
        const slug = (editingProduct.name || '').toLowerCase().replace(/\s+/g, '-');

        try {
            if (editingProduct.id) {
                await sdk.update('products', editingProduct.id, { ...editingProduct, slug });
            } else {
                await sdk.insert('products', { ...editingProduct, slug, schoolId: school.id, currency: 'USD' });
            }
            toast({ title: 'Success', description: 'Product saved.' });
            fetchProducts();
            setIsProductFormOpen(false);
            setEditingProduct(null);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save product.', variant: 'destructive' });
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await sdk.delete('products', productId);
                toast({ title: 'Success', description: 'Product deleted.' });
                fetchProducts();
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to delete product.', variant: 'destructive' });
            }
        }
    };

    if (loading) return <div>Loading E-commerce Data...</div>;

    const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');
    if (!isAdmin) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>E-commerce</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You do not have permission to view this page.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">E-commerce Management</h2>
            <Tabs defaultValue="products">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Card><CardHeader><CardTitle>Store Overview</CardTitle></CardHeader><CardContent><p>Analytics and reports will be here.</p></CardContent></Card>
                </TabsContent>

                <TabsContent value="products">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Products</CardTitle>
                            <Button onClick={() => openProductForm()}><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {products.map(product => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>${product.price.toFixed(2)}</TableCell>
                                            <TableCell>{product.stock}</TableCell>
                                            <TableCell>{product.status}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" onClick={() => openProductForm(product)}><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="w-4 h-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="orders">
                     <Card>
                        <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {orders.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell>{order.customerId}</TableCell>
                                            <TableCell>${order.total.toFixed(2)}</TableCell>
                                            <TableCell>{order.status}</TableCell>
                                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                     <Card>
                        <CardHeader><CardTitle>E-commerce Settings</CardTitle></CardHeader>
                        <CardContent>
                            <p>Payment gateways, shipping options, etc.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingProduct?.id ? 'Edit Product' : 'Add New Product'}</DialogTitle></DialogHeader>
                    <ProductForm product={editingProduct || {}} onProductChange={(field, value) => setEditingProduct(prev => ({...prev, [field]: value}))} />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsProductFormOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveProduct}>Save Product</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EcommerceModule;