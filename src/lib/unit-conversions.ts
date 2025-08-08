const LB_TO_KG = 0.453592;
const KG_TO_LB = 2.20462;
const FOOT_TO_CM = 30.48;
const INCH_TO_CM = 2.54;

/**
 * Converts weight from pounds (lbs) to kilograms (kg).
 * @param lbs - Weight in pounds.
 * @returns Weight in kilograms.
 */
export const toMetricWeight = (lbs: number): number => lbs * LB_TO_KG;

/**
 * Converts height from feet and inches to centimeters (cm).
 * @param feet - Height in feet.
 * @param inches - Height in inches.
 * @returns Height in centimeters.
 */
export const toMetricHeight = (feet: number, inches: number): number =>
  (feet * FOOT_TO_CM) + (inches * INCH_TO_CM);

/**
 * Converts height from centimeters (cm) to feet and inches.
 * @param cm - Height in centimeters.
 * @returns An object containing height in feet and inches.
 */
export const toImperialHeight = (
  cm: number
): { feet: number; inches: number } => {
  const feet = Math.floor(cm / FOOT_TO_CM);
  const inches = Math.round((cm % FOOT_TO_CM) / INCH_TO_CM);
  return { feet, inches };
};

/**
 * Converts weight from kilograms (kg) to pounds (lbs).
 * @param kg - Weight in kilograms.
 * @returns Weight in pounds.
 */
export const toImperialWeight = (kg: number): number => kg * KG_TO_LB;
