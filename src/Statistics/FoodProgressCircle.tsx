import { ProgressCircle } from "./ProgressCircle";

interface ProgressCircleForFoodProps {
  name: string;
  value: number;
}

export const ProgressCirclesForFood = ({
  name,
  value,
}: ProgressCircleForFoodProps) => (
  <div className="flex flex-col items-center space-y-2 text-sm">
    <ProgressCircle value={value}>
        {value}%
    </ProgressCircle>
    <span className="text-sm text-center">{name}</span>
  </div>
);
