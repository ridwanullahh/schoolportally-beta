import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';

const styleOptions = (count: number, prefix: string) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${prefix}-style-${i + 1}`,
        name: `Style ${i + 1}`
    }));
}

const ThemeStyler = () => {
    const { school, setSchool } = useSchool();

    const handleStyleChange = async (category: string, styleId: string) => {
        if (!school) return;

        const updatedBranding = {
            ...school.branding,
            [category]: styleId,
        };

        try {
            const updatedSchool = await sdk.update('schools', school.id, { branding: updatedBranding });
            if (setSchool) {
                setSchool(updatedSchool);
            }
        } catch (error) {
            console.error(`Failed to update ${category} style:`, error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Theme Styles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label>Header Style</Label>
                    <Select
                        value={school?.branding?.headerStyle || 'header-style-1'}
                        onValueChange={(value) => handleStyleChange('headerStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a header style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(7, 'header').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Footer Style</Label>
                    <Select
                        value={school?.branding?.footerStyle || 'footer-style-1'}
                        onValueChange={(value) => handleStyleChange('footerStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a footer style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(7, 'footer').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Blog Post Style</Label>
                    <Select
                        value={school?.branding?.blogPostStyle || 'blog-post-style-1'}
                        onValueChange={(value) => handleStyleChange('blogPostStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a blog post style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(7, 'blog-post').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label>Blog Archive Style</Label>
                    <Select
                        value={school?.branding?.blogArchiveStyle || 'blog-archive-style-1'}
                        onValueChange={(value) => handleStyleChange('blogArchiveStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a blog archive style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(7, 'blog-archive').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Announcement Post Style</Label>
                    <Select
                        value={school?.branding?.announcementPostStyle || 'announcement-post-style-1'}
                        onValueChange={(value) => handleStyleChange('announcementPostStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select an announcement post style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(7, 'announcement-post').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label>Announcement Archive Style</Label>
                    <Select
                        value={school?.branding?.announcementArchiveStyle || 'announcement-archive-style-1'}
                        onValueChange={(value) => handleStyleChange('announcementArchiveStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select an announcement archive style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(7, 'announcement-archive').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
};

export default ThemeStyler;