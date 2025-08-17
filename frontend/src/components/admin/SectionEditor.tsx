import React from 'react';
import { Section } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { themeService } from '@/services/themeService';
import FormSectionEditor from './editors/FormSectionEditor';
import { normalizeStyleId } from '@/utils/sectionStyleUtils';

interface SectionEditorProps {
  section: Section;
  onUpdate: (sectionId: string, updates: Partial<Section>) => void;
  onDelete: (sectionId: string) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onUpdate, onDelete }) => {
  const handleContentChange = (field: string, value: any) => {
    onUpdate(section.id, { content: { ...section.content, [field]: value } });
  };

  const handleStyleChange = (styleId: string) => {
    onUpdate(section.id, { styleId });
  };

  const handleRepeaterChange = (repeaterField: string, index: number, itemField: string, value: any) => {
    const updatedItems = [...(section.content[repeaterField] || [])];
    updatedItems[index] = { ...updatedItems[index], [itemField]: value };
    handleContentChange(repeaterField, updatedItems);
  };

  const addRepeaterItem = (repeaterField: string, newItem: any) => {
    const updatedItems = [...(section.content[repeaterField] || []), newItem];
    handleContentChange(repeaterField, updatedItems);
  };

  const removeRepeaterItem = (repeaterField: string, index: number) => {
    const updatedItems = (section.content[repeaterField] || []).filter((_: any, i: number) => i !== index);
    handleContentChange(repeaterField, updatedItems);
  };

  const renderFields = () => {
    switch (section.type) {
      case 'hero':
        const heroStyle = section.styleId || 'hero-style-1';
        return (
          <div className="space-y-4">
            <div>
              <Label>Headline</Label>
              <Input className="heroheadline" value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <div>
              <Label>Subtext</Label>
              <Input className="herosubtext" value={section.content.subtitle || ''} onChange={(e) => handleContentChange('subtitle', e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea className="herodescription" value={section.content.description || ''} onChange={(e) => handleContentChange('description', e.target.value)} />
            </div>
            <div>
              <Label>Primary Button Text</Label>
              <Input className="heroprimarybutton" value={section.content.primaryButton || ''} onChange={(e) => handleContentChange('primaryButton', e.target.value)} />
            </div>
            <div>
              <Label>Primary Button Link</Label>
              <Input className="heroprimarylink" value={section.content.primaryLink || ''} onChange={(e) => handleContentChange('primaryLink', e.target.value)} />
            </div>
            <div>
              <Label>Secondary Button Text</Label>
              <Input className="herosecondarybutton" value={section.content.secondaryButton || ''} onChange={(e) => handleContentChange('secondaryButton', e.target.value)} />
            </div>
            <div>
              <Label>Secondary Button Link</Label>
              <Input className="herosecondarylink" value={section.content.secondaryLink || ''} onChange={(e) => handleContentChange('secondaryLink', e.target.value)} />
            </div>
            <div>
              <Label>Background Image URL</Label>
              <Input className="herobackgroundimage" value={section.content.backgroundImage || ''} onChange={(e) => handleContentChange('backgroundImage', e.target.value)} />
            </div>

            {/* Conditional Fields for Hero Section Styles */}
            {heroStyle === 'hero-split-columns' && (
              <div>
                <Label>Icon</Label>
                <Input className="heroicon_style2" value={section.content.icon || ''} onChange={(e) => handleContentChange('icon', e.target.value)} placeholder="e.g., 'award', 'book-open'" />
              </div>
            )}
            {heroStyle === 'hero-full-card' && (
              <div>
                <Label>Card Border Color</Label>
                <Input className="herocardbordercolor_style3" type="color" value={section.content.borderColor || ''} onChange={(e) => handleContentChange('borderColor', e.target.value)} />
              </div>
            )}
            {heroStyle === 'hero-overlay-frame' && (
              <div>
                <Label>Frame Padding</Label>
                <Input className="herofpadding_style4" value={section.content.framePadding || ''} onChange={(e) => handleContentChange('framePadding', e.target.value)} placeholder="e.g., '2rem'" />
              </div>
            )}
            {heroStyle === 'hero-grid-power' && (
              <div>
                <Label>Grid Gap</Label>
                <Input className="herogridgap_style5" value={section.content.gridGap || ''} onChange={(e) => handleContentChange('gridGap', e.target.value)} placeholder="e.g., '1rem'" />
              </div>
            )}
            {heroStyle === 'hero-dynamic-fold' && (
              <div>
                <Label>Animation Duration</Label>
                <Input className="heroanimationduration_style7" value={section.content.animationDuration || ''} onChange={(e) => handleContentChange('animationDuration', e.target.value)} placeholder="e.g., '0.5s'" />
              </div>
            )}
            {heroStyle === 'hero-sticky-topline' && (
              <div>
                <Label>Shrink Scale</Label>
                <Input className="heroshrinkscale_style8" value={section.content.shrinkScale || ''} onChange={(e) => handleContentChange('shrinkScale', e.target.value)} placeholder="e.g., '0.8'" />
              </div>
            )}
             {heroStyle === 'hero-slide-reveal' && (
              <div>
                <Label>Slide Direction</Label>
                <Select value={section.content.slideDirection || 'left'} onValueChange={(value) => handleContentChange('slideDirection', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {heroStyle === 'hero-skew-panel' && (
              <div>
                <Label>Skew Angle</Label>
                <Input className="heroskewangle_style11" value={section.content.skewAngle || ''} onChange={(e) => handleContentChange('skewAngle', e.target.value)} placeholder="e.g., '-5deg'" />
              </div>
            )}
            {heroStyle === 'hero-minimalist-clean' && (
              <div>
                <Label>Clean Theme Accent</Label>
                <Input className="heroaccent_style12" value={section.content.accent || ''} onChange={(e) => handleContentChange('accent', e.target.value)} placeholder="e.g., '#fff'" />
              </div>
            )}
            {heroStyle === 'hero-bold-geometric' && (
              <div>
                <Label>Geometric Angle</Label>
                <Input className="herogeometricangle_style13" value={section.content.geometricAngle || ''} onChange={(e) => handleContentChange('geometricAngle', e.target.value)} placeholder="e.g., '45deg'" />
              </div>
            )}
            {heroStyle === 'hero-gradient-waves' && (
              <div>
                <Label>Wave Intensity</Label>
                <Input className="herowaveintensity_style14" value={section.content.waveIntensity || ''} onChange={(e) => handleContentChange('waveIntensity', e.target.value)} placeholder="e.g., 'strong'" />
              </div>
            )}
            {heroStyle === 'hero-split-yin-yang' && (
              <div>
                <Label>Yang Accent</Label>
                <Input className="heroyangaccent_style15" value={section.content.yangAccent || ''} onChange={(e) => handleContentChange('yangAccent', e.target.value)} placeholder="e.g., '#000'" />
              </div>
            )}
          </div>
        );
      case 'features':
        const featuresStyle = section.styleId || '';
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input className="features_title" value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Features</Label>
            {(section.content.features || []).map((feature: any, index: number) => (
              <div key={`feature-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input className={`features_item_title_${featuresStyle}`} placeholder="Feature Title" value={feature.title} onChange={(e) => handleRepeaterChange('features', index, 'title', e.target.value)} />
                  <Textarea className={`features_item_desc_${featuresStyle}`} placeholder="Feature Description" value={feature.description} onChange={(e) => handleRepeaterChange('features', index, 'description', e.target.value)} />
                  <Input className={`features_item_icon_${featuresStyle}`} placeholder="Icon (e.g., 'Check')" value={feature.icon} onChange={(e) => handleRepeaterChange('features', index, 'icon', e.target.value)} />
                  {featuresStyle === 'features-tabbed-features' && (
                     <Input className={`features_item_tab_${featuresStyle}`} placeholder="Tab Name" value={feature.tabName} onChange={(e) => handleRepeaterChange('features', index, 'tabName', e.target.value)} />
                  )}
                  {featuresStyle === 'features-split-highlights' && (
                     <Input className={`features_item_image_${featuresStyle}`} placeholder="Image URL" value={feature.image} onChange={(e) => handleRepeaterChange('features', index, 'image', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('features', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('features', { title: '', description: '', icon: 'Check', tabName: '', image: '' })}><Plus className="w-4 h-4 mr-2" />Add Feature</Button>
          </div>
        );
      case 'quick_facts':
        const qfStyle = section.styleId || '';
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input className="qf_title" value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            {qfStyle === 'quick_facts-toggle-grid' && (
              <div>
                <Label>Toggle Button Text</Label>
                <Input className="qf_toggle_text" value={section.content.toggleText || ''} onChange={(e) => handleContentChange('toggleText', e.target.value)} />
              </div>
            )}
            <Label>Facts</Label>
            {(section.content.facts || []).map((fact: any, index: number) => (
              <div key={`fact-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input className={`qf_label_${qfStyle}`} placeholder="Fact Label" value={fact.label} onChange={(e) => handleRepeaterChange('facts', index, 'label', e.target.value)} />
                  <Input className={`qf_value_${qfStyle}`} placeholder="Fact Value" value={fact.value} onChange={(e) => handleRepeaterChange('facts', index, 'value', e.target.value)} />
                  <Input className={`qf_icon_${qfStyle}`} placeholder="Icon (e.g., 'Users')" value={fact.icon} onChange={(e) => handleRepeaterChange('facts', index, 'icon', e.target.value)} />
                  {qfStyle === 'quick_facts-badge-numbers' && (
                    <Input className="qf_unit_style6" placeholder="Unit" value={fact.unit} onChange={(e) => handleRepeaterChange('facts', index, 'unit', e.target.value)} />
                  )}
                  {qfStyle === 'quick_facts-line-graph-style' && (
                    <Input className="qf_graph_point_style8" type="number" placeholder="Graph Point" value={fact.graphPoint} onChange={(e) => handleRepeaterChange('facts', index, 'graphPoint', e.target.value)} />
                  )}
                  {qfStyle === 'quick_facts-toggle-grid' && (
                    <Input className="qf_group_style7" placeholder="Group" value={fact.group} onChange={(e) => handleRepeaterChange('facts', index, 'group', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('facts', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('facts', { label: '', value: '', icon: 'Users', unit: '', graphPoint: 0, group: '' })}><Plus className="w-4 h-4 mr-2" />Add Fact</Button>
          </div>
        );
      case 'testimonials':
        const testimonialsStyle = section.styleId || '';
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input className="testimonials_title" value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Testimonials</Label>
            {(section.content.testimonials || []).map((testimonial: any, index: number) => (
              <div key={`testimonial-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input className={`testimonials_author_${testimonialsStyle}`} placeholder="Author Name" value={testimonial.author} onChange={(e) => handleRepeaterChange('testimonials', index, 'author', e.target.value)} />
                  <Textarea className={`testimonials_text_${testimonialsStyle}`} placeholder="Testimonial Text" value={testimonial.text} onChange={(e) => handleRepeaterChange('testimonials', index, 'text', e.target.value)} />
                  <Input className={`testimonials_role_${testimonialsStyle}`} placeholder="Author Role" value={testimonial.role} onChange={(e) => handleRepeaterChange('testimonials', index, 'role', e.target.value)} />
                  {testimonialsStyle === 'testimonials-timeline-voices' && (
                    <Input className={`testimonials_date_${testimonialsStyle}`} placeholder="Date" value={testimonial.date} onChange={(e) => handleRepeaterChange('testimonials', index, 'date', e.target.value)} />
                  )}
                   {testimonialsStyle === 'testimonials-stacked-bubbles' && (
                    <Input className={`testimonials_avatar_${testimonialsStyle}`} placeholder="Avatar URL" value={testimonial.avatar} onChange={(e) => handleRepeaterChange('testimonials', index, 'avatar', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('testimonials', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('testimonials', { author: '', text: '', role: '', date: '', avatar: '' })}><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button>
          </div>
        );
      case 'events_snapshot':
        const eventsStyle = section.styleId || '';
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input className="events_title" value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Events</Label>
            {(section.content.events || []).map((event: any, index: number) => (
              <div key={`event-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input className={`events_item_title_${eventsStyle}`} placeholder="Event Title" value={event.title} onChange={(e) => handleRepeaterChange('events', index, 'title', e.target.value)} />
                  <Input className={`events_item_date_${eventsStyle}`} placeholder="Event Date" value={event.date} onChange={(e) => handleRepeaterChange('events', index, 'date', e.target.value)} />
                  <Input className={`events_item_location_${eventsStyle}`} placeholder="Location" value={event.location} onChange={(e) => handleRepeaterChange('events', index, 'location', e.target.value)} />
                  {eventsStyle === 'events_snapshot-countdown-boxes' && (
                    <Input className={`events_item_countdown_${eventsStyle}`} type="datetime-local" placeholder="Countdown" value={event.countdown} onChange={(e) => handleRepeaterChange('events', index, 'countdown', e.target.value)} />
                  )}
                  {eventsStyle === 'events_snapshot-tabbed-views' && (
                     <Input className={`events_item_category_${eventsStyle}`} placeholder="Category" value={event.category} onChange={(e) => handleRepeaterChange('events', index, 'category', e.target.value)} />
                  )}
                   {eventsStyle === 'events_snapshot-pill-tags' && (
                     <Input className={`events_item_tags_${eventsStyle}`} placeholder="Tags (comma-separated)" value={(event.tags || []).join(',')} onChange={(e) => handleRepeaterChange('events', index, 'tags', e.target.value.split(','))} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('events', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('events', { title: '', date: '', location: '', countdown: '', category: '', tags: [] })}><Plus className="w-4 h-4 mr-2" />Add Event</Button>
          </div>
        );
      case 'value_prop':
        const vpStyle = section.styleId || '';
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input className="vp_title" value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            {vpStyle === 'value_prop-comparison-table' && (
              <div>
                <Label>Comparison Column Headers (comma-separated)</Label>
                <Input className="vp_comparison_headers" value={(section.content.comparisonHeaders || []).join(',')} onChange={(e) => handleContentChange('comparisonHeaders', e.target.value.split(','))} />
              </div>
            )}
            <Label>Propositions</Label>
            {(section.content.propositions || []).map((prop: any, index: number) => (
              <div key={`prop-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input className={`vp_prop_title_${vpStyle}`} placeholder="Proposition Title" value={prop.title} onChange={(e) => handleRepeaterChange('propositions', index, 'title', e.target.value)} />
                  <Textarea className={`vp_prop_desc_${vpStyle}`} placeholder="Proposition Description" value={prop.description} onChange={(e) => handleRepeaterChange('propositions', index, 'description', e.target.value)} />
                  <Input className={`vp_prop_icon_${vpStyle}`} placeholder="Icon (e.g., 'CheckCircle')" value={prop.icon} onChange={(e) => handleRepeaterChange('propositions', index, 'icon', e.target.value)} />
                  {vpStyle === 'value_prop-comparison-table' && (
                    <Input className="vp_prop_comparison_values_style3" placeholder="Comparison Values (comma-separated)" value={(prop.comparisonValues || []).join(',')} onChange={(e) => handleRepeaterChange('propositions', index, 'comparisonValues', e.target.value.split(','))} />
                  )}
                  {vpStyle === 'value_prop-timeline-line' && (
                    <Input className="vp_prop_timeline_date_style7" placeholder="Timeline Date" value={prop.timelineDate} onChange={(e) => handleRepeaterChange('propositions', index, 'timelineDate', e.target.value)} />
                  )}
                   {vpStyle === 'value_prop-tab-switch' && (
                    <Input className="vp_prop_tab_name_style10" placeholder="Tab Name" value={prop.tabName} onChange={(e) => handleRepeaterChange('propositions', index, 'tabName', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('propositions', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('propositions', { title: '', description: '', icon: 'CheckCircle', comparisonValues: [], timelineDate: '', tabName: '' })}><Plus className="w-4 h-4 mr-2" />Add Proposition</Button>
          </div>
        );
      case 'hero-modern-minimal':
        return (
          <div className="space-y-4">
            <Label>Header Alignment</Label>
            <Input className="hero_header_alignment" value={section.content.headerAlignment || ''} onChange={(e) => handleContentChange('headerAlignment', e.target.value)} />
          </div>
        );
      case 'hero-angled-background':
        return (
          <div className="space-y-4">
            <Label>Angle Direction</Label>
            <Input className="hero_angle_direction" value={section.content.angleDirection || ''} onChange={(e) => handleContentChange('angleDirection', e.target.value)} />
          </div>
        );
      case 'hero-parallax-scroll':
        return (
          <div className="space-y-4">
            <Label>Scroll Speed Factor</Label>
            <Input type="number" className="hero_scroll_speed" value={section.content.scrollSpeed || ''} onChange={(e) => handleContentChange('scrollSpeed', e.target.value)} />
          </div>
        );
      case 'hero-responsive-axis':
        return (
          <div className="space-y-4">
            <Label>Responsive Breakpoint</Label>
            <Input className="hero_responsive_breakpoint" value={section.content.responsiveBreakpoint || ''} onChange={(e) => handleContentChange('responsiveBreakpoint', e.target.value)} />
          </div>
        );
      case 'hero-circular-theme':
        return (
          <div className="space-y-4">
            <Label>Circle Diameter</Label>
            <Input className="hero_circle_diameter" value={section.content.circleDiameter || ''} onChange={(e) => handleContentChange('circleDiameter', e.target.value)} />
          </div>
        );
      case 'hero-floating-labels':
        return (
          <div className="space-y-4">
            <Label>Floating Speed</Label>
            <Input type="number" className="hero_floating_speed" value={section.content.floatingSpeed || ''} onChange={(e) => handleContentChange('floatingSpeed', e.target.value)} />
          </div>
        );
      case 'hero-border-accent':
        return (
          <div className="space-y-4">
            <Label>Border Thickness</Label>
            <Input className="hero_border_thickness" value={section.content.borderThickness || ''} onChange={(e) => handleContentChange('borderThickness', e.target.value)} />
          </div>
        );
      case 'hero-abstract-frame':
        return (
          <div className="space-y-4">
            <Label>Frame Pattern</Label>
            <Input className="hero_frame_pattern" value={section.content.framePattern || ''} onChange={(e) => handleContentChange('framePattern', e.target.value)} />
          </div>
        );
        const teaserStyle = section.styleId || '';
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input className="teaser_title" value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea className="teaser_desc" value={section.content.description || ''} onChange={(e) => handleContentChange('description', e.target.value)} />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input className="teaser_btn_text" value={section.content.buttonText || ''} onChange={(e) => handleContentChange('buttonText', e.target.value)} />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input className="teaser_btn_link" value={section.content.buttonLink || ''} onChange={(e) => handleContentChange('buttonLink', e.target.value)} />
            </div>
            {teaserStyle === 'teaser-inline-icons' && (
              <div>
                <Label>Icon</Label>
                <Input className="teaser_icon_style6" value={section.content.icon || ''} onChange={(e) => handleContentChange('icon', e.target.value)} placeholder="e.g., 'Megaphone'" />
              </div>
            )}
             {teaserStyle === 'teaser-flip-panel' && (
                <div>
                    <Label>Flipped Content</Label>
                    <Textarea className="teaser_flipped_content_style4" value={section.content.flippedContent || ''} onChange={(e) => handleContentChange('flippedContent', e.target.value)} />
                </div>
            )}
            {teaserStyle === 'teaser-collapsible-card' && (
                <div>
                    <Label>Collapsed Height</Label>
                    <Input className="teaser_collapsed_height_style5" value={section.content.collapsedHeight || ''} onChange={(e) => handleContentChange('collapsedHeight', e.target.value)} placeholder="e.g., '50px'"/>
                </div>
            )}
          </div>
        );
      case 'cta':
        const ctaStyle = section.styleId || '';
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input className="cta_title" value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea className="cta_desc" value={section.content.description || ''} onChange={(e) => handleContentChange('description', e.target.value)} />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input className="cta_btn_text" value={section.content.buttonText || ''} onChange={(e) => handleContentChange('buttonText', e.target.value)} />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input className="cta_btn_link" value={section.content.buttonLink || ''} onChange={(e) => handleContentChange('buttonLink', e.target.value)} />
            </div>
            {ctaStyle === 'cta-layered-cta' && (
              <div>
                <Label>Background Image URL</Label>
                <Input className="cta_bg_image" value={section.content.backgroundImage || ''} onChange={(e) => handleContentChange('backgroundImage', e.target.value)} />
              </div>
            )}
          </div>
        );
      case 'gallery_preview':
        const galleryStyle = section.styleId || '';
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input className="gallery_preview_title" value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
             {galleryStyle === 'gallery_preview-showcase-strip' && (
              <div>
                <Label>Featured Image URL</Label>
                <Input className="gallery_preview_featured_image" value={section.content.featuredImage || ''} onChange={(e) => handleContentChange('featuredImage', e.target.value)} />
              </div>
            )}
            <Label>Images</Label>
            {(section.content.images || []).map((image: any, index: number) => (
              <div key={`image-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input className={`gallery_preview_img_src_${galleryStyle}`} placeholder="Image URL" value={image.src} onChange={(e) => handleRepeaterChange('images', index, 'src', e.target.value)} />
                  <Input className={`gallery_preview_img_alt_${galleryStyle}`} placeholder="Alt Text" value={image.alt} onChange={(e) => handleRepeaterChange('images', index, 'alt', e.target.value)} />
                  <Input className={`gallery_preview_img_caption_${galleryStyle}`} placeholder="Caption" value={image.caption} onChange={(e) => handleRepeaterChange('images', index, 'caption', e.target.value)} />
                  {galleryStyle === 'gallery_preview-tabbed-sets' && (
                    <Input className={`gallery_preview_img_category_${galleryStyle}`} placeholder="Category" value={image.category} onChange={(e) => handleRepeaterChange('images', index, 'category', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('images', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('images', { src: '', alt: '', caption: '', category: '' })}><Plus className="w-4 h-4 mr-2" />Add Image</Button>
          </div>
        );
      case 'blog_posts':
        const blogStyle = section.styleId || '';
        const availableStyles = themeService.getSectionStyles('blog_posts');
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Style</Label>
              <Select value={blogStyle} onValueChange={handleStyleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  {availableStyles.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Section Title</Label>
              <Input className="blog_title" value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <div>
              <Label>Number of Posts to Display</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={section.content.postsLimit || 3}
                onChange={(e) => handleContentChange('postsLimit', parseInt(e.target.value, 10))}
              />
            </div>
            <div>
              <Label>Post Category Filter</Label>
              <Input 
                placeholder="Enter category slug (optional)" 
                value={section.content.categoryFilter || ''} 
                onChange={(e) => handleContentChange('categoryFilter', e.target.value)} 
              />
            </div>
            <div>
              <Label>Enable Load More</Label>
              <Select value={section.content.enableLoadMore ? 'true' : 'false'} onValueChange={(value) => handleContentChange('enableLoadMore', value === 'true')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {section.content.enableLoadMore && (
              <div>
                <Label>Load More Type</Label>
                <Select value={section.content.loadMoreType || 'button'} onValueChange={(value) => handleContentChange('loadMoreType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="button">Load More Button</SelectItem>
                    <SelectItem value="infinite">Infinite Scroll</SelectItem>
                    <SelectItem value="pagination">Pagination</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Enable Search</Label>
              <Select value={section.content.enableSearch ? 'true' : 'false'} onValueChange={(value) => handleContentChange('enableSearch', value === 'true')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Enable Sorting</Label>
              <Select value={section.content.enableSorting ? 'true' : 'false'} onValueChange={(value) => handleContentChange('enableSorting', value === 'true')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {section.content.enableSorting && (
              <div>
                <Label>Default Sort Order</Label>
                <Select value={section.content.sortOrder || 'desc'} onValueChange={(value) => handleContentChange('sortOrder', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                    <SelectItem value="title">By Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Button Text</Label>
              <Input 
                placeholder="View All Posts" 
                value={section.content.buttonText || 'View All Posts'} 
                onChange={(e) => handleContentChange('buttonText', e.target.value)} 
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input 
                placeholder="/blog" 
                value={section.content.buttonLink || '/blog'} 
                onChange={(e) => handleContentChange('buttonLink', e.target.value)} 
              />
            </div>
          </div>
        );
      case 'partners':
        const partnersStyle = section.styleId || '';
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input className="partners_title" value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Partners</Label>
            {(section.content.partners || []).map((partner: any, index: number) => (
              <div key={`partner-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input className={`partners_name_${partnersStyle}`} placeholder="Partner Name" value={partner.name} onChange={(e) => handleRepeaterChange('partners', index, 'name', e.target.value)} />
                  <Input className={`partners_logo_${partnersStyle}`} placeholder="Partner Logo URL" value={partner.logo} onChange={(e) => handleRepeaterChange('partners', index, 'logo', e.target.value)} />
                  {['partners-stacked-partner-cards', 'partners-list-with-text'].includes(partnersStyle) && (
                    <Textarea className={`partners_desc_${partnersStyle}`} placeholder="Partner Description" value={partner.description} onChange={(e) => handleRepeaterChange('partners', index, 'description', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('partners', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('partners', { name: '', logo: '', description: '' })}><Plus className="w-4 h-4 mr-2" />Add Partner</Button>
          </div>
        );
      case 'mission_vision':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <div>
              <Label>Mission</Label>
              <Textarea value={section.content.mission || ''} onChange={(e) => handleContentChange('mission', e.target.value)} />
            </div>
            <div>
              <Label>Vision</Label>
              <Textarea value={section.content.vision || ''} onChange={(e) => handleContentChange('vision', e.target.value)} />
            </div>
            {section.styleId === 'mission_vision-sticky-sidebar' && (
              <div>
                <Label>Sidebar Content</Label>
                <Textarea value={section.content.sidebar} onChange={(e) => handleContentChange('sidebar', e.target.value)} />
              </div>
            )}
          </div>
        );
      case 'history':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Milestones</Label>
            {(section.content.milestones || []).map((milestone: any, index: number) => (
              <div key={`milestone-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Year" value={milestone.year} onChange={(e) => handleRepeaterChange('milestones', index, 'year', e.target.value)} />
                  <Textarea placeholder="Description" value={milestone.description} onChange={(e) => handleRepeaterChange('milestones', index, 'description', e.target.value)} />
                  {section.styleId === 'history-grid-by-decade' && (
                    <Input placeholder="Decade" value={milestone.decade} onChange={(e) => handleRepeaterChange('milestones', index, 'decade', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('milestones', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('milestones', { year: '', description: '', decade: '' })}><Plus className="w-4 h-4 mr-2" />Add Milestone</Button>
          </div>
        );
      case 'leadership':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Members</Label>
            {(section.content.members || []).map((member: any, index: number) => (
              <div key={`member-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Name" value={member.name} onChange={(e) => handleRepeaterChange('members', index, 'name', e.target.value)} />
                  <Input placeholder="Role" value={member.role} onChange={(e) => handleRepeaterChange('members', index, 'role', e.target.value)} />
                  <Input placeholder="Image URL" value={member.image} onChange={(e) => handleRepeaterChange('members', index, 'image', e.target.value)} />
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('members', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('members', { name: '', role: '', image: '' })}><Plus className="w-4 h-4 mr-2" />Add Member</Button>
          </div>
        );
      case 'faculty':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Faculty Members</Label>
            {(section.content.faculty || []).map((member: any, index: number) => (
              <div key={`member-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Name" value={member.name} onChange={(e) => handleRepeaterChange('faculty', index, 'name', e.target.value)} />
                  <Input placeholder="Department" value={member.department} onChange={(e) => handleRepeaterChange('faculty', index, 'department', e.target.value)} />
                  <Input placeholder="Image URL" value={member.image} onChange={(e) => handleRepeaterChange('faculty', index, 'image', e.target.value)} />
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('faculty', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('faculty', { name: '', department: '', image: '' })}><Plus className="w-4 h-4 mr-2" />Add Member</Button>
          </div>
        );
      case 'classes':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Classes</Label>
            {(section.content.classes || []).map((classItem: any, index: number) => (
              <div key={`class-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Class Name" value={classItem.name} onChange={(e) => handleRepeaterChange('classes', index, 'name', e.target.value)} />
                  <Input placeholder="Teacher" value={classItem.teacher} onChange={(e) => handleRepeaterChange('classes', index, 'teacher', e.target.value)} />
                  <Input placeholder="Schedule" value={classItem.schedule} onChange={(e) => handleRepeaterChange('classes', index, 'schedule', e.target.value)} />
                  {section.styleId === 'classes-timetable-style' && (
                    <Input placeholder="Time" value={classItem.time} onChange={(e) => handleRepeaterChange('classes', index, 'time', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('classes', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('classes', { name: '', teacher: '', schedule: '', time: '' })}><Plus className="w-4 h-4 mr-2" />Add Class</Button>
          </div>
        );
      case 'programs':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Programs</Label>
            {(section.content.programs || []).map((program: any, index: number) => (
              <div key={`program-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Program Name" value={program.name} onChange={(e) => handleRepeaterChange('programs', index, 'name', e.target.value)} />
                  <Textarea placeholder="Program Description" value={program.description} onChange={(e) => handleRepeaterChange('programs', index, 'description', e.target.value)} />
                  <Input placeholder="Program Link" value={program.link} onChange={(e) => handleRepeaterChange('programs', index, 'link', e.target.value)} />
                  {section.styleId === 'programs-step-progression' && (
                    <Input placeholder="Level" value={program.level} onChange={(e) => handleRepeaterChange('programs', index, 'level', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('programs', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('programs', { name: '', description: '', link: '', level: '' })}><Plus className="w-4 h-4 mr-2" />Add Program</Button>
          </div>
        );
      case 'courses':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Courses</Label>
            {(section.content.courses || []).map((course: any, index: number) => (
              <div key={`course-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Course Name" value={course.name} onChange={(e) => handleRepeaterChange('courses', index, 'name', e.target.value)} />
                  <Input placeholder="Course Code" value={course.code} onChange={(e) => handleRepeaterChange('courses', index, 'code', e.target.value)} />
                  <Input placeholder="Credits" value={course.credits} onChange={(e) => handleRepeaterChange('courses', index, 'credits', e.target.value)} />
                  {section.styleId === 'courses-tag-based-filters' && (
                    <Input placeholder="Tags (comma-separated)" value={course.tags} onChange={(e) => handleRepeaterChange('courses', index, 'tags', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('courses', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('courses', { name: '', code: '', credits: '', tags: '' })}><Plus className="w-4 h-4 mr-2" />Add Course</Button>
          </div>
        );
      case 'announcements':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Announcements</Label>
            {(section.content.announcements || []).map((announcement: any, index: number) => (
              <div key={`announcement-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Title" value={announcement.title} onChange={(e) => handleRepeaterChange('announcements', index, 'title', e.target.value)} />
                  <Textarea placeholder="Content" value={announcement.content} onChange={(e) => handleRepeaterChange('announcements', index, 'content', e.target.value)} />
                  {section.styleId === 'announcements-alert-strip' && (
                    <Select onValueChange={(value) => handleRepeaterChange('announcements', index, 'type', value)} value={announcement.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Alert Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('announcements', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('announcements', { title: '', content: '', type: 'info' })}><Plus className="w-4 h-4 mr-2" />Add Announcement</Button>
          </div>
        );
      case 'library':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Books</Label>
            {(section.content.books || []).map((book: any, index: number) => (
              <div key={`book-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Book Title" value={book.title} onChange={(e) => handleRepeaterChange('books', index, 'title', e.target.value)} />
                  <Input placeholder="Author" value={book.author} onChange={(e) => handleRepeaterChange('books', index, 'author', e.target.value)} />
                  <Input placeholder="Cover URL" value={book.cover} onChange={(e) => handleRepeaterChange('books', index, 'cover', e.target.value)} />
                  {section.styleId === 'library-inline-bookmark' && (
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={book.bookmarked} onChange={(e) => handleRepeaterChange('books', index, 'bookmarked', e.target.checked)} />
                      <Label>Bookmarked</Label>
                    </div>
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('books', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('books', { title: '', author: '', cover: '', bookmarked: false })}><Plus className="w-4 h-4 mr-2" />Add Book</Button>
          </div>
        );
      case 'gallery':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Images</Label>
            {(section.content.images || []).map((image: any, index: number) => (
              <div key={`image-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Image URL" value={image.src} onChange={(e) => handleRepeaterChange('images', index, 'src', e.target.value)} />
                  <Input placeholder="Alt Text" value={image.alt} onChange={(e) => handleRepeaterChange('images', index, 'alt', e.target.value)} />
                  {section.styleId === 'gallery-tabs-by-album' && (
                    <Input placeholder="Album" value={image.album} onChange={(e) => handleRepeaterChange('images', index, 'album', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('images', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('images', { src: '', alt: '', album: '' })}><Plus className="w-4 h-4 mr-2" />Add Image</Button>
          </div>
        );
      case 'knowledgebase':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Articles</Label>
            {(section.content.articles || []).map((article: any, index: number) => (
              <div key={`article-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Question" value={article.question} onChange={(e) => handleRepeaterChange('articles', index, 'question', e.target.value)} />
                  <Textarea placeholder="Answer" value={article.answer} onChange={(e) => handleRepeaterChange('articles', index, 'answer', e.target.value)} />
                  {section.styleId === 'knowledgebase-category-tabs' && (
                    <Input placeholder="Category" value={article.category} onChange={(e) => handleRepeaterChange('articles', index, 'category', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('articles', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('articles', { question: '', answer: '', category: '' })}><Plus className="w-4 h-4 mr-2" />Add Article</Button>
          </div>
        );
      case 'jobs':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Jobs</Label>
            {(section.content.jobs || []).map((job: any, index: number) => (
              <div key={`job-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Job Title" value={job.title} onChange={(e) => handleRepeaterChange('jobs', index, 'title', e.target.value)} />
                  <Input placeholder="Location" value={job.location} onChange={(e) => handleRepeaterChange('jobs', index, 'location', e.target.value)} />
                  <Input placeholder="Type" value={job.type} onChange={(e) => handleRepeaterChange('jobs', index, 'type', e.target.value)} />
                  <Input placeholder="Link" value={job.link} onChange={(e) => handleRepeaterChange('jobs', index, 'link', e.target.value)} />
                  {section.styleId === 'jobs-list-with-tags' && (
                    <Input placeholder="Tags (comma-separated)" value={job.tags} onChange={(e) => handleRepeaterChange('jobs', index, 'tags', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('jobs', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('jobs', { title: '', location: '', type: '', link: '', tags: '' })}><Plus className="w-4 h-4 mr-2" />Add Job</Button>
          </div>
        );
      case 'faq':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>FAQs</Label>
            {(section.content.faqs || []).map((faq: any, index: number) => (
              <div key={`faq-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Question" value={faq.question} onChange={(e) => handleRepeaterChange('faqs', index, 'question', e.target.value)} />
                  <Textarea placeholder="Answer" value={faq.answer} onChange={(e) => handleRepeaterChange('faqs', index, 'answer', e.target.value)} />
                  {section.styleId === 'faq-tabbed-faqs' && (
                    <Input placeholder="Category" value={faq.category} onChange={(e) => handleRepeaterChange('faqs', index, 'category', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('faqs', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('faqs', { question: '', answer: '', category: '' })}><Plus className="w-4 h-4 mr-2" />Add FAQ</Button>
          </div>
        );
      case 'academic_calendar':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Events</Label>
            {(section.content.events || []).map((event: any, index: number) => (
              <div key={`event-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Event Title" value={event.title} onChange={(e) => handleRepeaterChange('events', index, 'title', e.target.value)} />
                  <Input placeholder="Event Date" value={event.date} onChange={(e) => handleRepeaterChange('events', index, 'date', e.target.value)} />
                  {section.styleId === 'academic_calendar-tab-by-term' && (
                    <Input placeholder="Term" value={event.term} onChange={(e) => handleRepeaterChange('events', index, 'term', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('events', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('events', { title: '', date: '', term: '' })}><Plus className="w-4 h-4 mr-2" />Add Event</Button>
          </div>
        );
      case 'result_checker':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            {section.styleId === 'result_checker-step-by-step-checker' && (
              <div className="space-y-2">
                <Label>Steps</Label>
                {(section.content.steps || []).map((step: any, index: number) => (
                  <div key={`step-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                    <Input placeholder="Step Label" value={step.label} onChange={(e) => handleRepeaterChange('steps', index, 'label', e.target.value)} />
                    <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('steps', index)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
                <Button onClick={() => addRepeaterItem('steps', { label: '' })}><Plus className="w-4 h-4 mr-2" />Add Step</Button>
              </div>
            )}
          </div>
        );
      case 'form':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Form Fields</Label>
            {(section.content.fields || []).map((field: any, index: number) => (
              <div key={`field-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Field Label" value={field.label} onChange={(e) => handleRepeaterChange('fields', index, 'label', e.target.value)} />
                  <Select onValueChange={(value) => handleRepeaterChange('fields', index, 'type', value)} value={field.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Field Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="radio">Radio</SelectItem>
                    </SelectContent>
                  </Select>
                  {section.styleId === 'form-accordion-fieldsets' && (
                    <Input placeholder="Fieldset" value={field.fieldset} onChange={(e) => handleRepeaterChange('fields', index, 'fieldset', e.target.value)} />
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('fields', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('fields', { label: '', type: 'text', fieldset: '' })}><Plus className="w-4 h-4 mr-2" />Add Field</Button>
          </div>
        );
      case 'products':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={section.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <Label>Products</Label>
            {(section.content.products || []).map((product: any, index: number) => (
              <div key={`product-${index}`} className="flex items-center gap-2 border p-2 rounded-md">
                <div className="flex-grow space-y-2">
                  <Input placeholder="Product Name" value={product.name} onChange={(e) => handleRepeaterChange('products', index, 'name', e.target.value)} />
                  <Input placeholder="Price" value={product.price} onChange={(e) => handleRepeaterChange('products', index, 'price', e.target.value)} />
                  <Input placeholder="Image URL" value={product.image} onChange={(e) => handleRepeaterChange('products', index, 'image', e.target.value)} />
                  <Input placeholder="Link" value={product.link} onChange={(e) => handleRepeaterChange('products', index, 'link', e.target.value)} />
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeRepeaterItem('products', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button onClick={() => addRepeaterItem('products', { name: '', price: '', image: '', link: '' })}><Plus className="w-4 h-4 mr-2" />Add Product</Button>
          </div>
        );
      case 'form_embed':
        return <FormSectionEditor section={section} onUpdate={onUpdate} />;
      default:
        return <p>This section type has no specific editor fields.</p>;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="capitalize">{section.type.replace('_', ' ')} Section</CardTitle>
        <Button variant="destructive" size="sm" onClick={() => onDelete(section.id)}>
          <Trash2 className="w-4 h-4 mr-2" /> Delete Section
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Section Style</Label>
            <Select value={section.styleId} onValueChange={handleStyleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                {(themeService.getSectionStyles(section.type) || []).map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {renderFields()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionEditor;