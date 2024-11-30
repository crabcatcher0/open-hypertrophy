import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useCoreApiListLifts } from "./gen";
import { createOneRepMaxChartData } from "./lib/utils";
import { useEffect, useState } from "react";

export default function Component() {
  const lifts = useCoreApiListLifts();
  const [selectedExercise, setSelectedExercise] = useState<string>();

  // set selected exercise to first lift data
  useEffect(() => {
    if (
      !selectedExercise &&
      lifts.data &&
      lifts.data.length > 0 &&
      lifts.data[0].id
    ) {
      setSelectedExercise(lifts.data[0].exercise.toString());
    }
  }, [lifts.data]);

  if (
    lifts.error &&
    lifts.error.message === "Request failed with status code 401"
  ) {
    window.location.href = "/admin/login/?next=/";
    return null;
  }
  if (lifts.error) return lifts.error.message;
  if (lifts.data && lifts.data.length === 0) return "No lifts found.";
  if (lifts.isLoading || !lifts.data || !selectedExercise) return "Loading...";

  const chart = createOneRepMaxChartData(
    lifts.data,
    parseInt(selectedExercise)
  );

  return (
    <Card>
      <CardHeader>
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>One Repetition Max</CardTitle>
          <CardDescription>
            Showing estimated one rep max for all exercises using Brzycki
            formula
          </CardDescription>
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {chart.exerciseIds.map((i) => (
                <SelectItem key={i} value={i.toString()} className="rounded-lg">
                  {chart.exerciseIdToNameMap[i]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chart.chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chart.chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillChart" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-value`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-value`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <Area
              dataKey="value"
              type="linear"
              fill="url(#fillChart)"
              fillOpacity={0.4}
              stroke="var(--color-value)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
