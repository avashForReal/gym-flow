import type { Exercise } from "@/data/types";
import { exerciseService } from "@/lib/exercise-service";
import { useEffect, useState } from "react";

type ExerciseSearchOptions = {
  query?: string;
  bodyPart?: string;
  muscle?: string;
};

export const useExercises = ({
  query,
  bodyPart,
  muscle,
}: ExerciseSearchOptions) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [muscles, setMuscles] = useState<string[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState<boolean>(false);

  const fetchExerciseFilters = async () => {
    const { bodyParts, muscles } = await exerciseService.getFilterOptions();
    setBodyParts(bodyParts);
    setMuscles(muscles);
  };

  const fetchExercises = async () => {
    setIsLoadingExercises(true);
    const exercises = await exerciseService.searchExercises(query || "", {
      bodyPart,
      muscle,
    });

    setExercises(exercises);
    setIsLoadingExercises(false);
  };

  useEffect(() => {
    fetchExerciseFilters();
    fetchExercises();
    return () => {
      setIsLoadingExercises(false);
    };
  }, [query, bodyPart, muscle]);

  return {
    exercises,
    bodyParts,
    muscles,
    isLoadingExercises,
  };
};
