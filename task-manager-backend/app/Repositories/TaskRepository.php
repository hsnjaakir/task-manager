<?php

namespace App\Repositories;

use App\Models\Task;

class TaskRepository
{
    public function getAll()
    {
        return Task::latest()->get();
    }

    public function getByUser($userId)
    {
        return Task::where('user_id', $userId)
            ->latest()
            ->get();
    }

    public function getForAdmin($adminId)
    {
        return [
            'my_tasks' => Task::where('user_id', $adminId)
                ->latest()
                ->get(),

            'other_tasks' => Task::where('user_id', '!=', $adminId)
                ->latest()
                ->get(),
        ];
    }

    public function createForUser($userId, array $data)
    {
        $data['user_id'] = $userId;
        return Task::create($data);
    }

    public function update(Task $task, array $data)
    {
        $task->update($data);
        return $task;
    }

    public function delete(Task $task)
    {
        return $task->delete();
    }
}
