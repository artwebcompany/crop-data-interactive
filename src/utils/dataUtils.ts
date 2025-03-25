
import { toast } from "@/components/ui/sonner";

export type DataType = "production" | "import" | "consumption";
export type DataItem = {
  year: number;
  [key: string]: number;
};

// Default years 2010-2023 (14 years)
export const DEFAULT_YEARS = Array.from({ length: 14 }, (_, i) => 2010 + i);

// Default crops
export const DEFAULT_CROPS = [
  "Wheat", "Corn", "Soybean Meal", "Soybean Oil", "Soybean", "Rice", "Sorghum"
];

// Get default empty data with specified years
export const getDefaultData = (years: number[] = DEFAULT_YEARS, crops: string[] = DEFAULT_CROPS): DataItem[] => {
  return years.map(year => {
    const item: DataItem = { year };
    crops.forEach(crop => {
      item[crop] = 0;
    });
    return item;
  });
};

// Get example data for demonstration
export const getExampleData = (): DataItem[] => {
  return [
    { year: 2010, "Wheat": 116093, "Corn": 190752, "Soybean Meal": 43560, "Soybean Oil": 9856, "Soybean": 15410, "Rice": 138058, "Sorghum": 1933 },
    { year: 2011, "Wheat": 118570, "Corn": 211316, "Soybean Meal": 48312, "Soybean Oil": 10931, "Soybean": 14879, "Rice": 142018, "Sorghum": 1892 },
    { year: 2012, "Wheat": 122475, "Corn": 229559, "Soybean Meal": 51480, "Soybean Oil": 11648, "Soybean": 13436, "Rice": 144572, "Sorghum": 1990 },
    { year: 2013, "Wheat": 123639, "Corn": 248453, "Soybean Meal": 54569, "Soybean Oil": 12347, "Soybean": 12407, "Rice": 144400, "Sorghum": 2430 },
    { year: 2014, "Wheat": 128235, "Corn": 249764, "Soybean Meal": 59004, "Soybean Oil": 13350, "Soybean": 12686, "Rice": 146726, "Sorghum": 2500 },
    { year: 2015, "Wheat": 132555, "Corn": 264992, "Soybean Meal": 64548, "Soybean Oil": 14605, "Soybean": 12367, "Rice": 148499, "Sorghum": 2203 },
    { year: 2016, "Wheat": 133188, "Corn": 263613, "Soybean Meal": 69696, "Soybean Oil": 15770, "Soybean": 13596, "Rice": 147766, "Sorghum": 2235 },
    { year: 2017, "Wheat": 134241, "Corn": 259071, "Soybean Meal": 71280, "Soybean Oil": 16128, "Soybean": 15283, "Rice": 148873, "Sorghum": 2465 },
    { year: 2018, "Wheat": 131441, "Corn": 257174, "Soybean Meal": 67320, "Soybean Oil": 15232, "Soybean": 15967, "Rice": 148490, "Sorghum": 2909 },
    { year: 2019, "Wheat": 133600, "Corn": 260779, "Soybean Meal": 72468, "Soybean Oil": 16397, "Soybean": 18092, "Rice": 144730, "Sorghum": 3137 },
    { year: 2020, "Wheat": 134250, "Corn": 260670, "Soybean Meal": 75240, "Soybean Oil": 17024, "Soybean": 19602, "Rice": 148300, "Sorghum": 2970 },
    { year: 2021, "Wheat": 136946, "Corn": 272552, "Soybean Meal": 71280, "Soybean Oil": 16128, "Soybean": 16395, "Rice": 148990, "Sorghum": 3377 },
    { year: 2022, "Wheat": 137723, "Corn": 277200, "Soybean Meal": 76032, "Soybean Oil": 17203, "Soybean": 20284, "Rice": 145946, "Sorghum": 3094 },
    { year: 2023, "Wheat": 136590, "Corn": 288842, "Soybean Meal": 78408, "Soybean Oil": 17741, "Soybean": 20840, "Rice": 149000, "Sorghum": 3000 }
  ];
};

// Parse clipboard data from Excel
export const parseClipboardData = (clipboardText: string, existingData: DataItem[], crops: string[]): DataItem[] => {
  try {
    const rows = clipboardText.split('\n').filter(row => row.trim() !== '');
    if (rows.length === 0) return existingData;

    // Create a copy of existing data
    const newData = [...existingData];

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
    toast.success("Data successfully pasted");
    return newData;
  } catch (error) {
    console.error("Error parsing clipboard data:", error);
    toast.error("Failed to parse clipboard data");
    return existingData;
  }
};

// Download data as CSV
export const downloadCSV = (data: DataItem[], crops: string[], country: string, dataType: DataType) => {
  const headers = ['Year', ...crops];
  const csvContent = [
    headers.join(','),
    ...data.map(item => {
      return [
        item.year,
        ...crops.map(crop => item[crop])
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${dataType}_${country.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success("Data downloaded successfully");
};

// Format number for display
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};
