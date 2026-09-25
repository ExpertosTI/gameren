export type Animal = {
  id: string;
  emoji: string;
  nameEs: string;
  nameEn: string;
  color: string;
  text: string;
  mult: number;
  weight: number;
  jackpot: boolean;
  courtesy: number;
};

export const ANIMALS: Animal[] = [
  { id: "lion", emoji: "🦁", nameEs: "León", nameEn: "Lion", color: "#c9a15a", text: "#1b1408", mult: 20, weight: 4, jackpot: false, courtesy: 1500 },
  { id: "tiger", emoji: "🐯", nameEs: "Tigre", nameEn: "Tiger", color: "#8f1d24", text: "#fff4d6", mult: 12, weight: 6, jackpot: false, courtesy: 800 },
  { id: "panda", emoji: "🐼", nameEs: "Panda", nameEn: "Panda", color: "#1a1a1a", text: "#fff4d6", mult: 10, weight: 6, jackpot: false, courtesy: 600 },
  { id: "elephant", emoji: "🐘", nameEs: "Elefante", nameEn: "Elephant", color: "#3d4a6b", text: "#fff4d6", mult: 8, weight: 8, jackpot: false, courtesy: 500 },
  { id: "zebra", emoji: "🦓", nameEs: "Cebra", nameEn: "Zebra", color: "#e8c891", text: "#1b1408", mult: 5, weight: 10, jackpot: false, courtesy: 350 },
  { id: "parrot", emoji: "🦜", nameEs: "Loro", nameEn: "Parrot", color: "#0d5a3a", text: "#fff4d6", mult: 4, weight: 12, jackpot: false, courtesy: 200 },
  { id: "monkey", emoji: "🐒", nameEs: "Mono", nameEn: "Monkey", color: "#5a3a1a", text: "#fff4d6", mult: 3, weight: 14, jackpot: false, courtesy: 120 },
  { id: "gem", emoji: "💎", nameEs: "JACKPOT", nameEn: "JACKPOT", color: "#fff4d6", text: "#1b1408", mult: 0, weight: 2, jackpot: true, courtesy: 2500 },
];

export function pickAnimalIndex() {
  const total = ANIMALS.reduce((sum, animal) => sum + animal.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < ANIMALS.length; i++) {
    roll -= ANIMALS[i].weight;
    if (roll <= 0) return i;
  }
  return ANIMALS.length - 1;
}

export function animalLabel(animal: Animal, locale: "es" | "en") {
  return locale === "en" ? animal.nameEn : animal.nameEs;
}

export function wheelData() {
  return ANIMALS.map((animal) => ({
    option: `${animal.emoji} ${animal.jackpot ? "JP" : `x${animal.mult}`}`,
    style: {
      backgroundColor: animal.color,
      textColor: animal.text,
      fontFamily: "Outfit, sans-serif",
      fontSize: 15,
      fontWeight: 700,
    },
  }));
}
