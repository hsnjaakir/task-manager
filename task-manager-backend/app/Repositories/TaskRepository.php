<?php

namespace App\Repositories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Builder;

class TaskRepository
{
    public function getAll(array $filters = [])
    {
<<<<<<< Updated upstream
        return $this->applyFilters(Task::with('user:id,name'), $filters)->get();
=======
        return $this->applyFilters(Task::with(['user:id,name', 'project:id,name,color']), $filters)->get();
>>>>>>> Stashed changes
    }

    public function getByUser($userId, array $filters = [])
    {
        return $this->applyFilters(
<<<<<<< Updated upstream
            Task::with('user:id,name')->where('user_id', $userId),
=======
            Task::with(['user:id,name', 'project:id,name,color'])->where('user_id', $userId),
>>>>>>> Stashed changes
            $filters
        )->get();
    }

    public function getForAdmin($adminId, array $filters = [])
    {
        return [
            'my_tasks' => $this->applyFilters(
<<<<<<< Updated upstream
                Task::with('user:id,name')->where('user_id', $adminId),
=======
                Task::with(['user:id,name', 'project:id,name,color'])->where('user_id', $adminId),
>>>>>>> Stashed changes
                $filters
            )->get(),

            'other_tasks' => $this->applyFilters(
<<<<<<< Updated upstream
                Task::with('user:id,name')->where('user_id', '!=', $adminId),
=======
                Task::with(['user:id,name', 'project:id,name,color'])->where('user_id', '!=', $adminId),
>>>>>>> Stashed changes
                $filters
            )->get(),
        ];
    }

    public function createForUser($userId, array $data)
    {
        $data['user_id'] = $userId;
        return Task::create($data)->load(['user:id,name', 'project:id,name,color']);
    }

    public function update(Task $task, array $data)
    {
        $task->update($data);
        return $task->load(['user:id,name', 'project:id,name,color']);
    }

    public function delete(Task $task)
    {
        return $task->delete();
    }

    /**
<<<<<<< Updated upstream
     * Apply status/priority filters, text search, and sorting to a task query.
=======
     * Apply status/priority/project filters, text search, and sorting.
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
        if (!empty($filters['project_id'])) {
            $query->where('project_id', $filters['project_id']);
        }

>>>>>>> Stashed changes
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        switch ($filters['sort'] ?? 'latest') {
            case 'due_date':
<<<<<<< Updated upstream
                // Tasks without a deadline go last (portable across MySQL/SQLite/Postgres)
=======
>>>>>>> Stashed changes
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
