import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const FaqPage = () => {
  const { school } = useSchool();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      if (school) {
        setLoading(true);
        const allFaqs = await sdk.get('faq');
        const schoolFaqs = allFaqs.filter((f: any) => f.schoolId === school.id && f.status === 'published');
        setFaqs(schoolFaqs);
        setLoading(false);
      }
    };
    fetchFaqs();
  }, [school]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="w-full">
          {faqs.length > 0 ? faqs.map((faq: any) => (
            <AccordionItem key={faq.id} value={`item-${faq.id}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          )) : <p className="text-center">No FAQs available at the moment.</p>}
        </Accordion>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default FaqPage;