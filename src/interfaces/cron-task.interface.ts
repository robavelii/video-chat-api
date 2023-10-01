export interface ICronTask {
    name: string;
    action: () => Promise<void>;
    timeout: number;
}
