<?php

namespace App\Repositories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Builder;

class TaskRepository
{
    public function getAll(array $filters = [])
    {
        return $this->applyFilters(Task::with('user:id,name'), $filters)->get();
    }

    public function getByUser($userId, array $filters = [])
    {
        return $this->applyFilters(
            Task::with('user:id,name')->where('user_id', $userId),
            $filters
        )->get();
    }

    public function getForAdmin($adminId, array $filters = [])
    {
        return [
            'my_tasks' => $this->applyFilters(
                Task::with('user:id,name')->where('user_id', $adminId),
                $filters
            )->get(),

            'other_tasks' => $this->applyFilters(
                Task::with('user:id,name')->where('user_id', '!=', $adminId),
                $filters
            )->get(),
        ];
    }

    public function createForUser($userId, array $data)
    {
        $data['user_id'] = $userId;
        return Task::create($data)->load('user:id,name');
    }

    public function update(Task $task, array $data)
    {
        $task->update($data);
        return $task->load('user:id,name');
    }

    public function delete(Task $task)
    {
        return $task->delete();
    }

    /**
     * Apply status/priority filters, text search, and sorting to a task query.
     * Sort options: latest (default), due_date, priority.
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        switch ($filters['sort'] ?? 'latest') {
            case 'due_date':
                // Tasks without a deadline go last (portable across MySQL/SQLite/Postgres)
                $query->orderByRaw('CASE WHEN due_date IS NULL THEN 1 ELSE 0 END')
                    ->orderBy('due_date');
                break;

            case 'priority':
                $query->orderByRaw(
                    "CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END"
                )->latest();
                break;

            default:
                $query->latest();
        }

        return $query;
    }
}
