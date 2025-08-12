import type { Exercise } from "@/data/types";
import { exerciseService } from "@/lib/exercise-service";
import { useEffect, useState } from "react";

type ExerciseSearchOptions = {
  query?: string;
  bodyPart?: string;
  muscle?: string;
  limit?: number;
  offset?: number;
};

export const useExercises = ({
  query,
  bodyPart,
  muscle,
  limit,
  offset,
}: ExerciseSearchOptions) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [muscles, setMuscles] = useState<string[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchExerciseFilters = async () => {
    const { bodyParts, muscles } = await exerciseService.getFilterOptions();
    setBodyParts(bodyParts);
    setMuscles(muscles);
  };

  const fetchExercises = async () => {
    setIsLoadingExercises(true);
    const response = await exerciseService.searchExercises(query || "", {
      bodyPart,
      muscle,
      limit,
      offset,
    });

    const { exercises, currentPage, totalPages, totalCount } = response;

    setExercises(exercises);
    setCurrentPage(currentPage);
    setTotalPages(totalPages);
    setTotalCount(totalCount);
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
    currentPage,
    totalPages,
    totalCount,
  };
};
