
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { DEFAULT_CROPS, DataItem, DataType, getDefaultData, getExampleData } from "@/utils/dataUtils";
import { motion } from "framer-motion";
import { Plus, RefreshCw, SaveIcon, Trash } from "lucide-react";
import { useState } from "react";

interface DataInputProps {
  data: DataItem[];
  setData: (data: DataItem[]) => void;
  country: string;
  setCountry: (country: string) => void;
  dataType: DataType;
  setDataType: (dataType: DataType) => void;
  crops: string[];
  setCrops: (crops: string[]) => void;
}

export function DataInput({
  data,
  setData,
  country,
  setCountry,
  dataType,
  setDataType,
  crops,
  setCrops,
}: DataInputProps) {
  const [newCrop, setNewCrop] = useState("");

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const rows = clipboardText.split('\n').filter(row => row.trim() !== '');
      
      if (rows.length === 0) {
        toast.error("No data found in clipboard");
        return;
      }

      // Create a copy of existing data
      const newData = [...data];

      // Process each row
      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].split('\t').map(cell => cell.trim());
        
        // Skip empty rows
        if (cells.length <= 1) continue;
        
        // Try to parse first cell as year
        const year = parseInt(cells[0].replace(/,/g, ''));
        if (isNaN(year)) continue;

        // Find the data item with this year, or create a new one
        let dataItem = newData.find(item => item.year === year);
        if (!dataItem) {
          dataItem = { year };
          crops.forEach(crop => {
            dataItem![crop] = 0;
          });
          newData.push(dataItem);
        }

        // Process each cell in the row
        for (let j = 1; j < Math.min(cells.length, crops.length + 1); j++) {
          // Clean and parse the cell value
          const value = cells[j].replace(/,/g, '').replace(/\./g, '');
          const numValue = parseFloat(value);
          
          if (!isNaN(numValue) && j-1 < crops.length) {
            dataItem[crops[j-1]] = Math.round(numValue);
          }
        }
      }

      // Sort data by year
      newData.sort((a, b) => a.year - b.year);
      setData(newData);
      toast.success("Data successfully pasted");
    } catch (error) {
      console.error("Error parsing clipboard data:", error);
      toast.error("Failed to parse clipboard data");
    }
  };

  const handleReset = () => {
    setData(getDefaultData());
    toast.success("Data reset to default");
  };

  const handleLoadExample = () => {
    setData(getExampleData());
    setCrops(DEFAULT_CROPS);
    setCountry("China");
    toast.success("Example data loaded");
  };

  const handleAddCrop = () => {
    if (!newCrop || newCrop.trim() === "") {
      toast.error("Please enter a crop name");
      return;
    }

    if (crops.includes(newCrop)) {
      toast.error("Crop already exists");
      return;
    }

    const updatedCrops = [...crops, newCrop];
    setCrops(updatedCrops);

    // Add the new crop to all existing data items
    const updatedData = data.map(item => ({
      ...item,
      [newCrop]: 0
    }));
    
    setData(updatedData);
    setNewCrop("");
    toast.success(`Added ${newCrop} to crops`);
  };

  const handleRemoveCrop = (crop: string) => {
    if (crops.length <= 1) {
      toast.error("Cannot remove the last crop");
      return;
    }

    const updatedCrops = crops.filter(c => c !== crop);
    setCrops(updatedCrops);

    // Remove the crop from all data items
    const updatedData = data.map(item => {
      const newItem = { ...item };
      delete newItem[crop];
      return newItem;
    });
    
    setData(updatedData);
    toast.success(`Removed ${crop} from crops`);
  };

  const handleSave = () => {
    const text = "Data saved successfully";
    
    // Create a download link for the data
    const jsonData = JSON.stringify({
      country,
      dataType,
      crops,
      data
    });
    
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${dataType}_${country.toLowerCase().replace(/\s+/g, "_")}_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(text);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="input-container"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="glass-input"
            placeholder="Enter country name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataType">Data Type</Label>
          <Select
            value={dataType}
            onValueChange={(value) => setDataType(value as DataType)}
          >
            <SelectTrigger className="glass-input">
              <SelectValue placeholder="Select data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="import">Import</SelectItem>
              <SelectItem value="consumption">Consumption</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-4">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleLoadExample} variant="outline" className="flex-1">
            Load Example
          </Button>
          <Button onClick={handleSave} className="glass-button flex-1">
            <SaveIcon className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Label className="mb-2 block">Manage Crops</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {crops.map((crop) => (
            <div
              key={crop}
              className="flex items-center bg-secondary/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
            >
              <span className="mr-2">{crop}</span>
              <button
                onClick={() => handleRemoveCrop(crop)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Remove ${crop}`}
              >
                <Trash className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newCrop}
            onChange={(e) => setNewCrop(e.target.value)}
            placeholder="Add new crop"
            className="glass-input"
          />
          <Button onClick={handleAddCrop} className="glass-button">
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <Label>Clipboard</Label>
          <div className="text-sm text-muted-foreground">
            Copy data from Excel and paste
          </div>
        </div>
        <Button
          onClick={handlePaste}
          variant="outline"
          className="w-full h-16 border-dashed"
        >
          Click to paste data from clipboard
        </Button>
      </div>
    </motion.div>
  );
}
