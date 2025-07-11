import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SchoolWebsite from './SchoolWebsite';

const ProductsPage: React.FC = () => {
    const { schoolSlug } = useParams<{ schoolSlug: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!schoolSlug) return;
        sdk.queryBuilder<Product>('products')
            .where(p => p.schoolId === schoolSlug && p.status === 'published')
            .exec()
            .then(setProducts)
            .finally(() => setLoading(false));
    }, [schoolSlug]);

    if (loading) return <SchoolWebsite><div className="text-center p-8">Loading products...</div></SchoolWebsite>;

    return (
        <SchoolWebsite>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Our Store</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <Link key={product.id} to={`/${schoolSlug}/products/${product.slug}`}>
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />}
                                </CardHeader>
                                <CardContent>
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                    <p className="font-semibold text-lg mt-2">${product.price.toFixed(2)}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </SchoolWebsite>
    );
};

export default ProductsPage;