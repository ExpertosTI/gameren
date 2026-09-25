declare module "@lucky-canvas/react" {
  import type { Component } from "react";

  export type LuckyApi = {
    play: () => void;
    stop: (index?: number | number[]) => void;
  };

  export class LuckyWheel extends Component<Record<string, unknown>> implements LuckyApi {
    play(): void;
    stop(index?: number): void;
  }

  export class LuckyGrid extends Component<Record<string, unknown>> implements LuckyApi {
    play(): void;
    stop(index?: number): void;
  }

  export class SlotMachine extends Component<Record<string, unknown>> implements LuckyApi {
    play(): void;
    stop(index?: number | number[]): void;
  }
}
