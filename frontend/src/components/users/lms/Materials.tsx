import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Download } from 'lucide-react';

interface Material {
  id: string;
  classId: string;
  title: string;
  description: string;
  fileUrl: string;
  createdAt: string;
}

interface MaterialsProps {
  classId: string;
}

const Materials: React.FC<MaterialsProps> = ({ classId }) => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    fileUrl: '',
  });

  useEffect(() => {
    fetchMaterials();
  }, [classId]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const allMaterials = await sdk.get<Material>('class_materials');
      const classMaterials = allMaterials.filter(material => material.classId === classId);
      setMaterials(classMaterials);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = async () => {
    try {
      const newMaterial = await sdk.insert<Material>('class_materials', {
        ...materialForm,
        classId,
        createdAt: new Date().toISOString(),
      });
      setMaterials([...materials, newMaterial]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating material:', error);
    }
  };

  const handleUpdateMaterial = async () => {
    if (!selectedMaterial) return;
    try {
      const updatedMaterial = await sdk.update<Material>('class_materials', selectedMaterial.id, materialForm);
      setMaterials(materials.map(material =>
        material.id === selectedMaterial.id ? updatedMaterial : material
      ));
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating material:', error);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      await sdk.delete('class_materials', materialId);
      setMaterials(materials.filter(material => material.id !== materialId));
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const resetForm = () => {
    setMaterialForm({
      title: '',
      description: '',
      fileUrl: '',
    });
    setIsEditing(false);
    setSelectedMaterial(null);
  };

  const openEditDialog = (material: Material) => {
    setSelectedMaterial(material);
    setMaterialForm({
      title: material.title,
      description: material.description,
      fileUrl: material.fileUrl,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const isTeacher = user?.userType === 'teacher';

  if (loading) {
    return <div>Loading materials...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Course Materials</h3>
        {isTeacher && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Material' : 'Add New Material'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                />
                <Input
                  placeholder="File URL"
                  value={materialForm.fileUrl}
                  onChange={(e) => setMaterialForm({ ...materialForm, fileUrl: e.target.value })}
                />
                <Button onClick={isEditing ? handleUpdateMaterial : handleCreateMaterial}>
                  {isEditing ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="space-y-4">
        {materials.map(material => (
          <Card key={material.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{material.title}</h4>
                <p className="text-sm text-gray-500">{material.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
                {isTeacher && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(material)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteMaterial(material.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Materials;