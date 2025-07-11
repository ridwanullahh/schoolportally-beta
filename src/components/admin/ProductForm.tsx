import React from 'react';
import { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductFormProps {
  product: Partial<Product>;
  onProductChange: (field: keyof Product, value: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onProductChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" value={product.name || ''} onChange={(e) => onProductChange('name', e.target.value)} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={product.description || ''} onChange={(e) => onProductChange('description', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" value={product.price || 0} onChange={(e) => onProductChange('price', parseFloat(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" value={product.stock || 0} onChange={(e) => onProductChange('stock', parseInt(e.target.value, 10))} />
        </div>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={product.status || 'draft'} onValueChange={(value) => onProductChange('status', value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductForm;