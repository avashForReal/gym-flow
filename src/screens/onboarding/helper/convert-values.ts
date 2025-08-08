import {
  toMetricHeight,
  toMetricWeight,
  toImperialHeight,
  toImperialWeight,
} from "@/lib/unit-conversions";

interface MetricInput {
  preferredUnits: "metric";
  heightCm: string;
  heightFeet?: string;
  heightInches?: string;
  weight: string;
  targetWeight: string;
}

interface ImperialInput {
  preferredUnits: "imperial";
  heightCm?: string;
  heightFeet: string;
  heightInches: string;
  weight: string;
  targetWeight: string;
}

type UserMeasurementsInput = MetricInput | ImperialInput;

interface ConvertedMeasurements {
  heightCm: number;
  heightFeet: number;
  heightInches: number;
  weightKg: number;
  weightLbs: number;
  targetWeightKg: number;
  targetWeightLbs: number;
}

export function getConvertedMeasurements(
  data: UserMeasurementsInput
): ConvertedMeasurements {
  if (data.preferredUnits === "imperial") {
    const heightFeet = parseInt(data.heightFeet || "0");
    const heightInches = parseInt(data.heightInches || "0");
    const weightLbs = parseFloat(data.weight);
    const targetWeightLbs = parseFloat(data.targetWeight);

    const heightCm = Math.round(toMetricHeight(heightFeet, heightInches));
    const weightKg = Math.round(toMetricWeight(weightLbs) * 10) / 10;
    const targetWeightKg =
      Math.round(toMetricWeight(targetWeightLbs) * 10) / 10;

    return {
      heightCm,
      heightFeet,
      heightInches,
      weightKg,
      weightLbs,
      targetWeightKg,
      targetWeightLbs,
    };
  } else {
    const heightCm = parseInt(data.heightCm || "0");
    const weightKg = parseFloat(data.weight);
    const targetWeightKg = parseFloat(data.targetWeight);

    const { feet, inches } = toImperialHeight(heightCm);
    const heightFeet = Math.round(feet);
    const heightInches = Math.round(inches);
    const weightLbs = Math.round(toImperialWeight(weightKg) * 10) / 10;
    const targetWeightLbs = Math.round(toImperialWeight(targetWeightKg) * 10) / 10;

    return {
      heightCm,
      heightFeet,
      heightInches,
      weightKg,
      weightLbs,
      targetWeightKg,
      targetWeightLbs,
    };
  }
}
