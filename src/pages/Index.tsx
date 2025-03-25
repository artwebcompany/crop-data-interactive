
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { DataInput } from "@/components/data/DataInput";
import { DataTable } from "@/components/data/DataTable";
import { DataVisualization } from "@/components/data/DataVisualization";
import { EmptyState } from "@/components/ui/EmptyState";
import { DataItem, DataType, DEFAULT_CROPS, getDefaultData } from "@/utils/dataUtils";

const Index = () => {
  const [data, setData] = useState<DataItem[]>(getDefaultData());
  const [country, setCountry] = useState<string>("China");
  const [dataType, setDataType] = useState<DataType>("production");
  const [crops, setCrops] = useState<string[]>(DEFAULT_CROPS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Container className="py-6">
        <Header country={country} dataType={dataType} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-xl shadow-md lg:col-span-1">
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
          </div>

          <div className="glass-card p-6 rounded-xl shadow-md lg:col-span-2">
            {data.length === 0 ? (
              <EmptyState
                title="No Data Available"
                description="Add data using the input panel or load the example data to get started."
                action={{
                  label: "Load Example Data",
                  onClick: () => {
                    // This will be handled by the DataInput component
                  },
                }}
              />
            ) : (
              <div className="space-y-6">
                <div className="h-[500px]">
                  <DataVisualization 
                    data={data} 
                    crops={crops}
                    country={country}
                    dataType={dataType} 
                  />
                </div>
                
                <DataTable 
                  data={data} 
                  setData={setData} 
                  crops={crops} 
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Index;
