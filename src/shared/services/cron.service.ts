import { Logger, OnApplicationBootstrap } from '@nestjs/common';

import { ICronTask } from '../../interfaces/cron-task.interface';

export class CronService implements OnApplicationBootstrap {
    private tasks: ICronTask[] = [];
    private readonly logger = new Logger(CronService.name);

    onApplicationBootstrap(): void {
        this.tasks.forEach((task) => this.runTask(task));
    }

    createTask(task: ICronTask): void {
        this.tasks.push(task);
        this.logger.log(`New cron task: ${task.name}`);
    }

    private runTask(task: ICronTask) {
        setTimeout(() => {
            void task.action().then(() => {
                this.runTask(task);
            });
        }, task.timeout);
    }
}
