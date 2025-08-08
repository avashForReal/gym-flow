import { z } from "zod";

export const onboardingSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be less than 100 characters"),
    heightCm: z.string().nullable(),
    heightFeet: z.string().nullable(),
    heightInches: z.string().nullable(),
    weight: z.string().min(1, "Weight is required"),
    gender: z
      .enum(["male", "female", "other", "prefer-not-to-say"] as const)
      .nullable(),
    age: z.string().min(1, "Age is required"),
    primaryGoal: z
      .enum([
        "lose-weight",
        "gain-muscle",
        "get-stronger",
        "improve-endurance",
        "general-fitness",
        "sport-specific",
      ] as const)
      .nullable(),

    targetWeight: z.string().nullable(),
    activityLevel: z
      .enum([
        "sedentary",
        "lightly-active",
        "moderately-active",
        "very-active",
        "extremely-active",
      ] as const)
      .nullable(),
    experienceLevel: z
      .enum(["beginner", "intermediate", "advanced", "expert"] as const)
      .nullable(),
    preferredUnits: z.enum(["metric", "imperial"] as const),
  })
  .superRefine((data, ctx) => {
    if (data.preferredUnits === "metric") {
      if (!data.heightCm || data.heightCm.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Height is required",
          path: ["heightCm"],
        });
      } else {
        const height = parseFloat(data.heightCm);
        if (isNaN(height) || height < 100 || height > 250) {
          ctx.addIssue({
            code: "custom",
            message: "Height must be between 100-250 cm",
            path: ["heightCm"],
          });
        }
      }
    } else {
      if (data.heightFeet === null || data.heightFeet === "") {
        ctx.addIssue({
          code: "custom",
          message: "Feet is required",
          path: ["heightFeet"],
        });
      } else {
        const feet = parseInt(data.heightFeet);
        if (isNaN(feet) || feet < 3 || feet > 8) {
          ctx.addIssue({
            code: "custom",
            message: "Feet must be between 3-8",
            path: ["heightFeet"],
          });
        }
      }

      if (data.heightInches === null || data.heightInches === "") {
        ctx.addIssue({
          code: "custom",
          message: "Inches is required",
          path: ["heightInches"],
        });
      } else {
        const inches = parseInt(data.heightInches);
        if (isNaN(inches) || inches < 0 || inches > 11) {
          ctx.addIssue({
            code: "custom",
            message: "Inches must be between 0-11",
            path: ["heightInches"],
          });
        }
      }
    }
    // weight validation
    if (data.weight) {
      const weight = parseFloat(data.weight);
      if (isNaN(weight)) {
        ctx.addIssue({
          code: "custom",
          message: "Weight must be a valid number",
          path: ["weight"],
        });
      } else {
        const minWeight = data.preferredUnits === "metric" ? 30 : 66; // 30kg or 66lbs
        const maxWeight = data.preferredUnits === "metric" ? 300 : 660; // 300kg or 660lbs

        if (weight < minWeight || weight > maxWeight) {
          ctx.addIssue({
            code: "custom",
            message: `Weight must be between ${minWeight}-${maxWeight} ${
              data.preferredUnits === "metric" ? "kg" : "lbs"
            }`,
            path: ["weight"],
          });
        }
      }
    }

    // gender validation
    if (!data.gender) {
      ctx.addIssue({
        code: "custom",
        message: "Gender is required",
        path: ["gender"],
      });
    }

    // primary goal validation
    if (!data.primaryGoal) {
      ctx.addIssue({
        code: "custom",
        message: "Primary goal is required",
        path: ["primaryGoal"],
      });
    }

    // activity level validation
    if (!data.activityLevel) {
      ctx.addIssue({
        code: "custom",
        message: "Activity level is required",
        path: ["activityLevel"],
      });
    }

    // experience level validation
    if (!data.experienceLevel) {
      ctx.addIssue({
        code: "custom",
        message: "Experience level is required",
        path: ["experienceLevel"],
      });
    }

    // target weight validation
    if (!data.targetWeight || data.targetWeight.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "Target weight is required",
        path: ["targetWeight"],
      });
    }
    // target weight validation
    if (data.targetWeight) {
      const targetWeight = parseFloat(data.targetWeight);
      if (isNaN(targetWeight)) {
        ctx.addIssue({
          code: "custom",
          message: "Target weight must be a valid number",
          path: ["targetWeight"],
        });
      } else {
        const minWeight = data.preferredUnits === "metric" ? 30 : 66;
        const maxWeight = data.preferredUnits === "metric" ? 300 : 660;

        if (targetWeight < minWeight || targetWeight > maxWeight) {
          ctx.addIssue({
            code: "custom",
            message: `Target weight must be between ${minWeight}-${maxWeight} ${
              data.preferredUnits === "metric" ? "kg" : "lbs"
            }`,
            path: ["targetWeight"],
          });
        }
      }
    }
  });

export const personalInfoSchema = onboardingSchema.pick({
  name: true,
  heightCm: true,
  heightFeet: true,
  heightInches: true,
  weight: true,
  gender: true,
  preferredUnits: true,
  age: true,
});

export const goalsSchema = onboardingSchema.pick({
  primaryGoal: true,
  targetWeight: true,
  activityLevel: true,
});

export const experienceSchema = onboardingSchema.pick({
  experienceLevel: true,
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type GoalsFormData = z.infer<typeof goalsSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
