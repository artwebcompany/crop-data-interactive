
import { DEFAULT_CROPS, DataItem, formatNumber } from "@/utils/dataUtils";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface DataVisualizationProps {
  data: DataItem[];
  crops: string[];
  country: string;
  dataType: string;
}

export function DataVisualization({ data, crops, country, dataType }: DataVisualizationProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Remove previous chart if it exists
    const existingCanvas = chartRef.current.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = chartRef.current.clientWidth;
    canvas.height = chartRef.current.clientHeight;
    chartRef.current.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Define colors for different crops (ensure we have enough colors)
    const colors = [
      'rgb(0, 122, 255)',    // blue
      'rgb(255, 149, 0)',    // orange
      'rgb(52, 199, 89)',    // green
      'rgb(175, 82, 222)',   // purple
      'rgb(255, 45, 85)',    // red
      'rgb(88, 86, 214)',    // indigo
      'rgb(255, 204, 0)',    // yellow
      'rgb(90, 200, 250)',   // light blue
      'rgb(255, 59, 48)',    // bright red
      'rgb(76, 217, 100)',   // lime green
      'rgb(142, 142, 147)',  // gray
      'rgb(0, 0, 0)'         // black
    ];

    // Prepare data
    const years = data.map(item => item.year);
    const datasets = crops.map((crop, index) => ({
      label: crop,
      data: data.map(item => item[crop] || 0),
      borderColor: colors[index % colors.length],
      backgroundColor: `${colors[index % colors.length]}20`,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4
    }));

    // Draw chart
    drawChart(ctx, years, datasets, canvas.width, canvas.height);

    // Handle window resize
    const handleResize = () => {
      if (!chartRef.current) return;
      canvas.width = chartRef.current.clientWidth;
      canvas.height = chartRef.current.clientHeight;
      drawChart(ctx, years, datasets, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data, crops, country, dataType]);

  const drawChart = (
    ctx: CanvasRenderingContext2D,
    years: number[],
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
      pointRadius: number;
      pointHoverRadius: number;
      tension: number;
    }>,
    width: number,
    height: number
  ) => {
    ctx.clearRect(0, 0, width, height);

    // Chart dimensions
    const padding = { top: 60, right: 30, bottom: 60, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find the max value for y-axis
    const allValues = datasets.flatMap(ds => ds.data);
    const maxValue = Math.max(...allValues) * 1.1; // Add 10% padding

    // Draw title
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(`${dataType} of Food in ${country} (2010-2023)`, width / 2, padding.top / 2);

    // Draw y-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.strokeStyle = '#ddd';
    ctx.stroke();

    // Draw y-axis labels
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'right';
    
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = padding.top + (chartHeight * (ySteps - i)) / ySteps;
      const value = (maxValue * i) / ySteps;
      
      // Draw horizontal grid line
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.strokeStyle = '#f0f0f0';
      ctx.stroke();
      
      // Draw label
      ctx.fillText(formatNumber(Math.round(value)), padding.left - 10, y + 4);
    }

    // Draw x-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.strokeStyle = '#ddd';
    ctx.stroke();

    // Draw x-axis labels
    ctx.textAlign = 'center';
    const xStep = chartWidth / (years.length - 1);
    years.forEach((year, i) => {
      const x = padding.left + i * xStep;
      
      // Only show some years to avoid crowding (e.g., every 2 years)
      if (years.length > 10 ? i % 2 === 0 : true) {
        ctx.fillText(year.toString(), x, height - padding.bottom + 20);
      }
      
      // Draw vertical grid line
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.strokeStyle = '#f0f0f0';
      ctx.stroke();
    });

    // Draw y-axis label
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Production (in 1000 MT)', 0, 0);
    ctx.restore();

    // Draw lines for each dataset
    datasets.forEach(dataset => {
      // Draw line
      ctx.beginPath();
      dataset.data.forEach((value, i) => {
        const x = padding.left + i * xStep;
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = dataset.borderColor;
      ctx.lineWidth = dataset.borderWidth;
      ctx.stroke();

      // Draw points
      dataset.data.forEach((value, i) => {
        const x = padding.left + i * xStep;
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, dataset.pointRadius, 0, 2 * Math.PI);
        ctx.fillStyle = dataset.borderColor;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, dataset.pointRadius - 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
      });
    });

    // Draw legend
    const legendX = padding.left;
    const legendY = padding.top - 30;
    const legendItemWidth = chartWidth / Math.min(6, datasets.length);
    
    datasets.forEach((dataset, i) => {
      const x = legendX + (i % 6) * legendItemWidth;
      const y = legendY - Math.floor(i / 6) * 20;
      
      // Draw color box
      ctx.fillStyle = dataset.borderColor;
      ctx.fillRect(x, y, 12, 12);
      
      // Draw label
      ctx.fillStyle = '#333';
      ctx.textAlign = 'left';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(dataset.label, x + 16, y + 10);
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="chart-container"
    >
      <div ref={chartRef} className="w-full h-full"></div>
    </motion.div>
  );
}
