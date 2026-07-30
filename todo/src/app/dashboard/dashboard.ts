import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  tasks: any[] = [];
  newTaskTitle = '';
  newTaskDescription = '';

  isLoading = true;
  error = '';
  
  currentFilter: 'all' | 'pending' | 'completed' = 'all';

  constructor(private taskService: TaskService) {}

  setFilter(filter: 'all' | 'pending' | 'completed') {
    this.currentFilter = filter;
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tasks.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  addTask(event: Event) {
    event.preventDefault();
    if (!this.newTaskTitle.trim()) return;

    const task = {
      title: this.newTaskTitle,
      description: this.newTaskDescription
    };

    this.taskService.createTask(task).subscribe({
      next: (newTask) => {
        this.tasks.unshift(newTask);
        this.newTaskTitle = '';
        this.newTaskDescription = '';
      },
      error: (err) => {
        this.error = 'Failed to add task.';
        console.error(err);
      }
    });
  }

  toggleTaskStatus(task: any) {
    const updatedStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updatedTask = { ...task, status: updatedStatus };
    
    // Optimistic update
    task.status = updatedStatus;

    this.taskService.updateTask(task._id, { status: updatedStatus }).subscribe({
      error: (err) => {
        // Revert on error
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        this.error = 'Failed to update task.';
        console.error(err);
      }
    });
  }

  deleteTask(taskId: string) {
    // Optimistic update
    const previousTasks = [...this.tasks];
    this.tasks = this.tasks.filter(t => t._id !== taskId);

    this.taskService.deleteTask(taskId).subscribe({
      error: (err) => {
        // Revert on error
        this.tasks = previousTasks;
        this.error = 'Failed to delete task.';
        console.error(err);
      }
    });
  }

  get pendingTasks() {
    return this.tasks.filter(t => t.status !== 'completed');
  }

  get completedTasks() {
    return this.tasks.filter(t => t.status === 'completed');
  }
}
