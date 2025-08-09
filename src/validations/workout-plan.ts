import { z } from "zod";

// Schema for individual workout day
const workoutDaySchema = z.object({
  dayIndex: z.number().min(0).max(6),
  name: z.string().min(1, "Day name is required"),
  customName: z.string().optional(),
  isRestDay: z.boolean(),
  exercises: z.array(z.object({
    exerciseId: z.string(),
  })),
});

// Main workout plan schema
export const workoutPlanSchema = z
  .object({
    name: z
      .string()
      .min(1, "Plan name is required.")
      .max(100, "Plan name must be less than 100 characters."),
    description: z.string().optional(),
    days: z.array(workoutDaySchema).length(7, "Must have exactly 7 days."),
  })
  // .superRefine((data, ctx) => {
  //   // Ensure at least one day is not a rest day
  //   const activeDays = data.days.filter(day => !day.isRestDay);
  //   if (activeDays.length === 0) {
  //     ctx.addIssue({
  //       code: "custom",
  //       message: "At least one day must be an active training day.",
  //       path: ["days"],
  //     });
  //   }

  //   // Validate that non-rest days have exercises
  //   data.days.forEach((day, index) => {
  //     if (!day.isRestDay && day.exercises.length === 0) {
  //       ctx.addIssue({
  //         code: "custom",
  //         message: `Day ${index + 1} must have at least one exercise or be marked as a rest day.`,
  //         path: ["days", index, "exercises"],
  //       });
  //     }
  //   });
  // });

// Step-specific schemas
export const planBasicsSchema = workoutPlanSchema.pick({
  name: true,
  description: true,
});

export const planScheduleSchema = workoutPlanSchema.pick({
  days: true,
});

export const planExercisesSchema = workoutPlanSchema.pick({
  days: true,
});

export const planReviewSchema = workoutPlanSchema;

// Type exports
export type WorkoutDay = z.infer<typeof workoutDaySchema>;
export type WorkoutPlanFormData = z.infer<typeof workoutPlanSchema>;
export type PlanBasicsFormData = z.infer<typeof planBasicsSchema>;
export type PlanScheduleFormData = z.infer<typeof planScheduleSchema>;
export type PlanExercisesFormData = z.infer<typeof planExercisesSchema>;
export type PlanReviewFormData = z.infer<typeof planReviewSchema>;
