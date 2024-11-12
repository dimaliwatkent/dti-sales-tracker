import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card } from "@/components/ui/card";

export interface PieChartData {
  name: string | undefined;
  value: number | undefined;
  fill: string | undefined;
}

interface DashboardCardProps {
  data: PieChartData[];
  title: string;
}

const DashboardCard = ({ data, title }: DashboardCardProps) => {
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + (curr?.value ?? 0), 0);
  }, [data]);

  return (
    <Card className="p-6 max-h-40">
      <div className="flex justify-between">
        <div>
          <p className="font-bold pb-2 text-lg">{title}</p>
          <div className="text-sm text-primary/70 font-bold ">
            {data?.map((item) => (
              <div key={item.name} className="flex items-center gap-2 my-1">
                <div
                  className="px-2 rounded-full"
                  style={{ backgroundColor: item.fill }}
                >
                  <p>{item.value}</p>
                </div>
                <div>
                  <p>{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <PieChart width={100} height={100}>
          <Pie
            data={data}
            innerRadius={24}
            outerRadius={40}
            strokeWidth={0}
            dataKey="value"
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-lg font-bold"
                      >
                        {totalValue.toLocaleString()}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </div>
    </Card>
  );
};

export default DashboardCard;
