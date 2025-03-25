
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { DataInput } from "@/components/data/DataInput";
import { DataTable } from "@/components/data/DataTable";
import { DataVisualization } from "@/components/data/DataVisualization";
import { DEFAULT_CROPS, DataItem, DataType, getDefaultData, getExampleData } from "@/utils/dataUtils";
import { useState } from "react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/ui/EmptyState";

const Index = () => {
  const [country, setCountry] = useState<string>("China");
  const [dataType, setDataType] = useState<DataType>("production");
  const [crops, setCrops] = useState<string[]>(DEFAULT_CROPS);
  const [data, setData] = useState<DataItem[]>(getDefaultData());

  const handleLoadExample = () => {
    setData(getExampleData());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 pb-16">
      <Container>
        <Header 
          country={country} 
          dataType={dataType.charAt(0).toUpperCase() + dataType.slice(1)} 
        />

        <DataInput
          data={data}
          setData={setData}
          country={country}
          setCountry={setCountry}
          dataType={dataType}
          setDataType={setDataType}
          crops={crops}
          setCrops={setCrops}
        />

        <div className="mt-8">
          <DataTable 
            data={data} 
            setData={setData}
            crops={crops}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          {data.length > 0 ? (
            <DataVisualization 
              data={data}
              crops={crops}
              country={country}
              dataType={dataType.charAt(0).toUpperCase() + dataType.slice(1)}
            />
          ) : (
            <EmptyState
              title="No Data Available"
              description="Add data using the input form above or load example data to see the visualization."
              action={{
                label: "Load Example Data",
                onClick: handleLoadExample
              }}
            />
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default Index;
