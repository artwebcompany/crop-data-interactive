
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataItem, formatNumber } from "@/utils/dataUtils";
import { motion } from "framer-motion";
import { useState } from "react";

interface DataTableProps {
  data: DataItem[];
  setData: (data: DataItem[]) => void;
  crops: string[];
}

export function DataTable({ data, setData, crops }: DataTableProps) {
  const [newYear, setNewYear] = useState<number>(
    data.length > 0 ? Math.max(...data.map((d) => d.year)) + 1 : new Date().getFullYear()
  );

  const handleAddYear = () => {
    if (newYear <= 0) return;
    
    // Check if year already exists
    if (data.some(item => item.year === newYear)) {
      return;
    }
    
    const newRow: DataItem = { year: newYear };
    crops.forEach(crop => {
      newRow[crop] = 0;
    });
    
    const updatedData = [...data, newRow].sort((a, b) => a.year - b.year);
    setData(updatedData);
    setNewYear(newYear + 1);
  };

  const handleRemoveYear = (year: number) => {
    const updatedData = data.filter(item => item.year !== year);
    setData(updatedData);
  };

  const handleValueChange = (year: number, crop: string, value: string) => {
    const numValue = parseInt(value.replace(/,/g, ''));
    const updatedData = data.map(item => {
      if (item.year === year) {
        return {
          ...item,
          [crop]: isNaN(numValue) ? 0 : numValue
        };
      }
      return item;
    });
    
    setData(updatedData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="input-container overflow-x-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Data Table</h3>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={newYear}
            onChange={(e) => setNewYear(parseInt(e.target.value))}
            className="w-24 glass-input"
            min={1900}
            max={2100}
          />
          <Button onClick={handleAddYear} size="sm" className="glass-button">
            Add Year
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left font-medium">Year</th>
              {crops.map((crop) => (
                <th key={crop} className="py-2 px-4 text-left font-medium">
                  {crop}
                </th>
              ))}
              <th className="py-2 px-4 text-left font-medium w-16">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={crops.length + 2}
                  className="py-4 px-4 text-center text-muted-foreground"
                >
                  No data available. Add a year or load example data.
                </td>
              </tr>
            ) : (
              data
                .sort((a, b) => a.year - b.year)
                .map((item) => (
                  <tr key={item.year} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-2 px-4 font-medium">{item.year}</td>
                    {crops.map((crop) => (
                      <td key={`${item.year}-${crop}`} className="py-2 px-4">
                        <Input
                          value={item[crop] ? formatNumber(item[crop]) : "0"}
                          onChange={(e) => handleValueChange(item.year, crop, e.target.value)}
                          className="glass-input p-1 h-8 text-right"
                        />
                      </td>
                    ))}
                    <td className="py-2 px-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveYear(item.year)}
                      >
                        <span className="sr-only">Delete</span>
                        ✕
                      </Button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
