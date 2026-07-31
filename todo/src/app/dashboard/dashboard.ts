import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  tasks: any[] = [];
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPriority = 'medium';
  newTaskCategory = 'General';
  newTaskDueDate = '';
  searchQuery = '';
  sortBy = 'createdAt';

  isLoading = true;
  error = '';
  
  currentFilter: 'all' | 'pending' | 'completed' = 'all';

  // Pagination & Analytics State
  currentPage = 1;
  limit = 10;
  totalPages = 1;
  totalTasks = 0;
  totalCompleted = 0;
  isLoadingMore = false;

  constructor(private taskService: TaskService) {}

  setFilter(filter: 'all' | 'pending' | 'completed') {
    this.currentFilter = filter;
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks(isLoadMore = false) {
    if (!isLoadMore) {
      this.isLoading = true;
      this.currentPage = 1;
    } else {
      this.isLoadingMore = true;
      this.currentPage++;
    }

    this.taskService.getTasks(this.currentPage, this.limit).subscribe({
      next: (data: any) => {
        if (isLoadMore) {
          this.tasks = [...this.tasks, ...data.tasks];
        } else {
          this.tasks = data.tasks;
        }
        this.totalTasks = data.total;
        this.totalCompleted = data.totalCompleted;
        this.totalPages = data.pages;
        
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      error: (err) => {
        this.error = 'Failed to load tasks.';
        this.isLoading = false;
        this.isLoadingMore = false;
        console.error(err);
      }
    });
  }

  loadMore() {
    if (this.currentPage < this.totalPages) {
      this.loadTasks(true);
    }
  }

  get analytics() {
    const total = this.totalTasks;
    const completed = this.totalCompleted;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, pending, percentage };
  }

  addTask(event: Event) {
    event.preventDefault();
    if (!this.newTaskTitle.trim()) return;

    const task = {
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      priority: this.newTaskPriority,
      category: this.newTaskCategory,
      dueDate: this.newTaskDueDate || null
    };

    this.taskService.createTask(task).subscribe({
      next: (newTask) => {
        this.tasks.unshift(newTask);
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.newTaskPriority = 'medium';
        this.newTaskCategory = 'General';
        this.newTaskDueDate = '';
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
    
    // Update local analytics optimism
    if (updatedStatus === 'completed') {
      this.totalCompleted++;
    } else {
      this.totalCompleted--;
    }

    this.taskService.updateTask(task._id, { status: updatedStatus }).subscribe({
      error: (err) => {
        // Revert on error
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        if (task.status === 'completed') {
          this.totalCompleted++;
        } else {
          this.totalCompleted--;
        }
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

  // Editing state
  editingTaskId: string | null = null;
  editTaskData: any = {};
  newSubtaskTitle = '';

  startEdit(task: any) {
    this.editingTaskId = task._id;
    this.editTaskData = JSON.parse(JSON.stringify(task)); // Deep copy to avoid reference issues
    if (!this.editTaskData.subtasks) {
      this.editTaskData.subtasks = [];
    }
    if (this.editTaskData.dueDate) {
      this.editTaskData.dueDate = new Date(this.editTaskData.dueDate).toISOString().split('T')[0];
    }
  }

  // Subtask logic
  addSubtask() {
    if (this.newSubtaskTitle.trim()) {
      this.editTaskData.subtasks.push({
        title: this.newSubtaskTitle,
        completed: false
      });
      this.newSubtaskTitle = '';
    }
  }

  removeSubtask(index: number) {
    this.editTaskData.subtasks.splice(index, 1);
  }

  toggleSubtask(subtask: any) {
    subtask.completed = !subtask.completed;
  }

  saveEdit(task: any) {
    const previousTask = { ...task };
    Object.assign(task, this.editTaskData);
    this.editingTaskId = null;

    this.taskService.updateTask(task._id, this.editTaskData).subscribe({
      error: (err) => {
        Object.assign(task, previousTask);
        this.error = 'Failed to update task.';
        console.error(err);
      }
    });
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.newSubtaskTitle = '';
  }

  get filteredAndSortedTasks() {
    let filtered = this.tasks;

    // 1. Apply status filter
    if (this.currentFilter === 'pending') {
      filtered = filtered.filter(t => t.status !== 'completed');
    } else if (this.currentFilter === 'completed') {
      filtered = filtered.filter(t => t.status === 'completed');
    }

    // 2. Apply search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // 3. Apply sorting
    filtered = filtered.sort((a, b) => {
      if (this.sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (this.sortBy === 'priority') {
        const pMap: any = { 'high': 3, 'medium': 2, 'low': 1 };
        return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
      } else {
        // Default: createdAt descending
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }

  get pendingTasks() {
    return this.filteredAndSortedTasks.filter(t => t.status !== 'completed');
  }

  get completedTasks() {
    return this.filteredAndSortedTasks.filter(t => t.status === 'completed');
  }

  // Drag and Drop
  drop(event: CdkDragDrop<any[]>) {
    // Determine which list is currently visible and being reordered
    let currentTasksArray = this.currentFilter === 'completed' ? this.completedTasks : this.pendingTasks;
    
    // Perform local reorder
    moveItemInArray(currentTasksArray, event.previousIndex, event.currentIndex);

    // Update the 'order' field based on new indices
    currentTasksArray.forEach((task, index) => {
      task.order = index;
    });

    // Prepare payload for backend
    const reorderPayload = currentTasksArray.map(t => ({
      id: t._id,
      order: t.order
    }));

    // Send to backend
    this.taskService.reorderTasks(reorderPayload).subscribe({
      error: (err) => {
        this.error = 'Failed to save new order.';
        console.error(err);
        // On error, reload to get correct order from DB
        this.loadTasks();
      }
    });
  }
}
