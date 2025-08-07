import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';

const styleOptions = (count: number, prefix: string) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${prefix}-style-${i + 1}`,
        name: `${i + 1}. ${i < 11 ? 'Modern UI/UX' : 'Ultra-Modern'} Style ${i + 1}`
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
                            {styleOptions(26, 'header').map(style => (
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
                            {styleOptions(26, 'footer').map(style => (
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
                            {styleOptions(26, 'announcement-archive').map(style => (
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
                            {styleOptions(26, 'blog-archive').map(style => (
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
                            {styleOptions(26, 'blog-post').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Events Archive Style</Label>
                    <Select
                        value={school?.branding?.eventArchiveStyle || 'event-archive-style-1'}
                        onValueChange={(value) => handleStyleChange('eventArchiveStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select an events archive style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(26, 'event-archive').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Event Post Style</Label>
                    <Select
                        value={school?.branding?.eventPostStyle || 'event-post-style-1'}
                        onValueChange={(value) => handleStyleChange('eventPostStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select an event post style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(26, 'event-post').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Gallery Archive Style</Label>
                    <Select
                        value={school?.branding?.galleryArchiveStyle || 'gallery-archive-style-1'}
                        onValueChange={(value) => handleStyleChange('galleryArchiveStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a gallery archive style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(26, 'gallery-archive').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Gallery Post Style</Label>
                    <Select
                        value={school?.branding?.galleryPostStyle || 'gallery-post-style-1'}
                        onValueChange={(value) => handleStyleChange('galleryPostStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a gallery post style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(26, 'gallery-post').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Classes Archive Style</Label>
                    <Select
                        value={school?.branding?.classArchiveStyle || 'class-archive-style-1'}
                        onValueChange={(value) => handleStyleChange('classArchiveStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a classes archive style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(26, 'class-archive').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Programs Archive Style</Label>
                    <Select
                        value={school?.branding?.programArchiveStyle || 'program-archive-style-1'}
                        onValueChange={(value) => handleStyleChange('programArchiveStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a programs archive style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(26, 'program-archive').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Courses Archive Style</Label>
                    <Select
                        value={school?.branding?.courseArchiveStyle || 'course-archive-style-1'}
                        onValueChange={(value) => handleStyleChange('courseArchiveStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a courses archive style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(26, 'course-archive').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Faculty Archive Style</Label>
                    <Select
                        value={school?.branding?.facultyArchiveStyle || 'faculty-archive-style-1'}
                        onValueChange={(value) => handleStyleChange('facultyArchiveStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a faculty archive style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(26, 'faculty-archive').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Jobs Archive Style</Label>
                    <Select
                        value={school?.branding?.jobArchiveStyle || 'job-archive-style-1'}
                        onValueChange={(value) => handleStyleChange('jobArchiveStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a jobs archive style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(26, 'job-archive').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Knowledge Base Archive Style</Label>
                    <Select
                        value={school?.branding?.kbArchiveStyle || 'kb-archive-style-1'}
                        onValueChange={(value) => handleStyleChange('kbArchiveStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a knowledge base archive style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(26, 'kb-archive').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Products Archive Style</Label>
                    <Select
                        value={school?.branding?.productArchiveStyle || 'product-archive-style-1'}
                        onValueChange={(value) => handleStyleChange('productArchiveStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a products archive style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(26, 'product-archive').map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Library Archive Style</Label>
                    <Select
                        value={school?.branding?.libraryArchiveStyle || 'library-archive-style-1'}
                        onValueChange={(value) => handleStyleChange('libraryArchiveStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a library archive style" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleOptions(26, 'library-archive').map(style => (
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