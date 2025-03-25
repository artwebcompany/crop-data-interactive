
export type DataType = "production" | "import" | "consumption";

export interface DataItem {
  year: number;
  [key: string]: number;
}

export const DEFAULT_CROPS = [
  "Wheat",
  "Corn",
  "Soybean Meal",
  "Soybean Oil",
  "Soybean",
  "Rice",
  "Sorghum"
];

// Format number with commas as thousands separators
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Parse the formatted number back to a number
export const parseFormattedNumber = (str: string): number => {
  return parseInt(str.replace(/,/g, ""), 10);
};

// Generate default data
export const getDefaultData = (): DataItem[] => {
  const years = Array.from({ length: 14 }, (_, i) => 2010 + i);
  
  return years.map(year => {
    const item: DataItem = { year };
    DEFAULT_CROPS.forEach(crop => {
      item[crop] = 0;
    });
    return item;
  });
};

// Example data for demonstration
export const getExampleData = (): DataItem[] => {
  return [
    { year: 2010, "Wheat": 116093, "Corn": 190752, "Soybean Meal": 43560, "Soybean": 15410, "Soybean Oil": 9856, "Rice": 138058, "Sorghum": 1933 },
    { year: 2011, "Wheat": 118570, "Corn": 211316, "Soybean Meal": 48312, "Soybean": 14879, "Soybean Oil": 10931, "Rice": 142018, "Sorghum": 1892 },
    { year: 2012, "Wheat": 122475, "Corn": 229559, "Soybean Meal": 51480, "Soybean": 13436, "Soybean Oil": 11648, "Rice": 144572, "Sorghum": 1990 },
    { year: 2013, "Wheat": 123639, "Corn": 248453, "Soybean Meal": 54569, "Soybean": 12407, "Soybean Oil": 12347, "Rice": 144400, "Sorghum": 2430 },
    { year: 2014, "Wheat": 128235, "Corn": 249764, "Soybean Meal": 59004, "Soybean": 12686, "Soybean Oil": 13350, "Rice": 146726, "Sorghum": 2500 },
    { year: 2015, "Wheat": 132555, "Corn": 264992, "Soybean Meal": 64548, "Soybean": 12367, "Soybean Oil": 14605, "Rice": 148499, "Sorghum": 2203 },
    { year: 2016, "Wheat": 133188, "Corn": 263613, "Soybean Meal": 69696, "Soybean": 13596, "Soybean Oil": 15770, "Rice": 147766, "Sorghum": 2235 },
    { year: 2017, "Wheat": 134241, "Corn": 259071, "Soybean Meal": 71280, "Soybean": 15283, "Soybean Oil": 16128, "Rice": 148873, "Sorghum": 2465 },
    { year: 2018, "Wheat": 131441, "Corn": 257174, "Soybean Meal": 67320, "Soybean": 15967, "Soybean Oil": 15232, "Rice": 148490, "Sorghum": 2909 },
    { year: 2019, "Wheat": 133600, "Corn": 260779, "Soybean Meal": 72468, "Soybean": 18092, "Soybean Oil": 16397, "Rice": 144730, "Sorghum": 3137 },
    { year: 2020, "Wheat": 134250, "Corn": 260670, "Soybean Meal": 75240, "Soybean": 19602, "Soybean Oil": 17024, "Rice": 148300, "Sorghum": 2970 },
    { year: 2021, "Wheat": 136946, "Corn": 272552, "Soybean Meal": 71280, "Soybean": 16395, "Soybean Oil": 16128, "Rice": 148990, "Sorghum": 3377 },
    { year: 2022, "Wheat": 137723, "Corn": 277200, "Soybean Meal": 76032, "Soybean": 20284, "Soybean Oil": 17203, "Rice": 145946, "Sorghum": 3094 },
    { year: 2023, "Wheat": 136590, "Corn": 288842, "Soybean Meal": 78408, "Soybean": 20840, "Soybean Oil": 17741, "Rice": 149000, "Sorghum": 3000 },
  ];
};
