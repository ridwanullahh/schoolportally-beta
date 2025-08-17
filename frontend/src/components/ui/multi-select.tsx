import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Select...',
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter(option =>
    option.label && option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="relative">
      <div className="border rounded-md p-2 flex flex-wrap gap-2" onClick={() => setIsOpen(!isOpen)}>
        {selected.length > 0 ? (
          selected.map(value => {
            const option = options.find(opt => opt.value === value);
            return (
              <Badge key={value} variant="secondary">
                {option?.label}
                <button
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(value);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </Badge>
            );
          })
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded-md mt-1">
          <div className="p-2">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map(option => (
              <div
                key={option.value}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  selected.includes(option.value) ? 'bg-gray-200' : ''
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};