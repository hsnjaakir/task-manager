<?php

namespace App\Services;

use App\Models\Task;
use App\Repositories\TaskRepository;

class TaskService
{
    protected $taskRepository;

    public function __construct(TaskRepository $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    public function getAll($user, array $filters = [])
    {
        if ($user->role === 'admin') {
            return $this->taskRepository->getForAdmin($user->id, $filters);
        }

        return $this->taskRepository->getByUser($user->id, $filters);
    }

    public function create($user, array $data)
    {
        // Admin can create task for any user
        if ($user->role === 'admin' && isset($data['user_id'])) {
            return $this->taskRepository->createForUser($data['user_id'], $data);
        }

        // Normal user: only for self
        return $this->taskRepository->createForUser($user->id, $data);
    }

    public function update($user, Task $task, array $data)
    {
        if ($user->role !== 'admin' && $task->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        return $this->taskRepository->update($task, $data);
    }

    public function delete($user, Task $task)
    {
        if ($user->role !== 'admin' && $task->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        return $this->taskRepository->delete($task);
    }
}
