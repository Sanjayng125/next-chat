import { StateCreator } from "zustand"

export interface FishSliceProps {
    fishes: number
    addFish: () => void
}

export const createFishSlice: StateCreator<FishSliceProps> = (set) => ({
    fishes: 0,
    addFish: () => set((state) => ({ fishes: state.fishes + 1 }))
})