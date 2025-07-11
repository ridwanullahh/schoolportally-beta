import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const GalleryPage = () => {
  const { school } = useSchool();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      if (school) {
        setLoading(true);
        const allImages = await sdk.get('gallery');
        const schoolImages = allImages.filter((i: any) => i.schoolId === school.id);
        setImages(schoolImages);
        setLoading(false);
      }
    };
    fetchImages();
  }, [school]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Gallery</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.length > 0 ? images.map((image: any) => (
            <div key={image.id} className="group relative">
              <img src={image.imageUrl} alt={image.title} className="w-full h-full object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-center">{image.title}</p>
              </div>
            </div>
          )) : <p className="col-span-full text-center">No images in the gallery yet.</p>}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default GalleryPage;