import { EventEmitter } from 'events';
import * as readline from 'readline';

export default class TaskScheduler extends EventEmitter {
  private executionCount: number = 0;
  private maxExecutions: number;
  private isRunning: boolean = false;
  private minSeconds: number;
  private maxSeconds: number;

  constructor(maxExecutions: number, minSeconds: number, maxSeconds: number) {
    super();
    this.maxExecutions = maxExecutions;
    this.minSeconds = minSeconds;
    this.maxSeconds = maxSeconds;
  }

  private randomDelay(minSeconds: number, maxSeconds: number): number {
    return (
      Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) *
      1000
    );
  }

  private executeTask() {
    console.log(
      `Executing task ${this.executionCount + 1} at: ${new Date().toISOString()}`
    );
    // Your task logic goes here
    this.executionCount++;
    this.emit('taskExecuted', this.executionCount);
  }

  private shouldContinue(): boolean {
    return this.isRunning && this.executionCount < this.maxExecutions;
  }

  private scheduleNextExecution() {
    if (this.shouldContinue()) {
      const delay = this.randomDelay(this.minSeconds, this.maxSeconds); // Random delay between min and max seconds
      setTimeout(() => {
        this.executeTask();
        this.scheduleNextExecution();
      }, delay);
    } else {
      this.emit('completed', this.executionCount);
    }
  }

  start() {
    this.isRunning = true;
    this.scheduleNextExecution();

    // Set up keypress listener
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        this.stop();
        process.exit();
      } else if (key.name === 'q') {
        this.stop();
      }
    });

    console.log(
      "Press 'q' to stop the scheduler, or 'Ctrl+C' to exit the program."
    );
  }

  stop() {
    this.isRunning = false;
    this.emit('stopped', this.executionCount);
  }
}
