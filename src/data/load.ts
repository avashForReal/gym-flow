import type { Equipment, Exercise, Muscle, BodyPart } from './types'

import exercisesData from './exercises.json'
import equipmentsData from './equipments.json'
import bodyPartsData from './bodyparts.json'
import musclesData from './muscles.json'

export class DataLoader {
  private static cache = new Map<string, unknown>()

  public static async loadExercises(): Promise<Exercise[]> {
    if (this.cache.has('exercises')) {
      return this.cache.get('exercises') as Exercise[]
    }
    
    const exercises = exercisesData as Exercise[]
    this.cache.set('exercises', exercises)
    return exercises
  }

  public static async loadEquipments(): Promise<Equipment[]> {
    if (this.cache.has('equipments')) {
      return this.cache.get('equipments') as Equipment[]
    }
    
    const equipments = equipmentsData as Equipment[]
    this.cache.set('equipments', equipments)
    return equipments
  }

  public static async loadBodyParts(): Promise<BodyPart[]> {
    if (this.cache.has('bodyParts')) {
      return this.cache.get('bodyParts') as BodyPart[]
    }
    
    const bodyParts = bodyPartsData as BodyPart[]
    this.cache.set('bodyParts', bodyParts)
    return bodyParts
  }

  public static async loadMuscles(): Promise<Muscle[]> {
    if (this.cache.has('muscles')) {
      return this.cache.get('muscles') as Muscle[]
    }
    
    const muscles = musclesData as Muscle[]
    this.cache.set('muscles', muscles)
    return muscles
  }

  public static async getExerciseCount(): Promise<number> {
    const exercises = await this.loadExercises()
    return exercises.length
  }

  public static async getExercisesByBodyPart(bodyPart: string): Promise<Exercise[]> {
    const exercises = await this.loadExercises()
    return exercises.filter(exercise => 
      exercise.bodyParts.some(part => part.toLowerCase() === bodyPart.toLowerCase())
    )
  }

  public static async getExercisesByEquipment(equipment: string): Promise<Exercise[]> {
    const exercises = await this.loadExercises()
    return exercises.filter(exercise => 
      exercise.equipments.some(eq => eq.toLowerCase() === equipment.toLowerCase())
    )
  }
}
