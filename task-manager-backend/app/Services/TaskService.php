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

    public function getAll($user)
    {
        return $this->taskRepository->getByUser($user->id);
    }

    public function create($user, array $data)
    {
        return $this->taskRepository->createForUser($user->id, $data);
    }

    public function update(Task $task, array $data)
    {
        return $this->taskRepository->update($task, $data);
    }

    public function delete(Task $task)
    {
        return $this->taskRepository->delete($task);
    }
}
