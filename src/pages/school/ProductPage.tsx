import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import SchoolWebsite from './SchoolWebsite';

const ProductPage: React.FC = () => {
    const { schoolSlug, productSlug } = useParams<{ schoolSlug: string, productSlug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sdk.queryBuilder<Product>('products')
            .where(p => p.slug === productSlug)
            .exec()
            .then(results => {
                if (results.length > 0) {
                    setProduct(results[0]);
                }
            })
            .finally(() => setLoading(false));
    }, [productSlug]);

    if (loading) return <SchoolWebsite><div className="text-center p-8">Loading product...</div></SchoolWebsite>;
    if (!product) return <SchoolWebsite><div className="text-center p-8">Product not found.</div></SchoolWebsite>;

    return (
        <SchoolWebsite>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-full h-auto rounded-lg shadow-md" />}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                        <p className="text-2xl font-semibold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
                        <p className="text-gray-700 mb-6">{product.description}</p>
                        <Button size="lg">Add to Cart</Button>
                    </div>
                </div>
            </div>
        </SchoolWebsite>
    );
};

export default ProductPage;