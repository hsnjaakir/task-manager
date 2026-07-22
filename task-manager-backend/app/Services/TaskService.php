<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskAssigned;
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
            $task = $this->taskRepository->createForUser($data['user_id'], $data);
            $this->notifyAssignee($task, $user, (int) $data['user_id']);
            return $task;
        }

        // Normal user: only for self
        return $this->taskRepository->createForUser($user->id, $data);
    }

    public function update($user, Task $task, array $data)
    {
        if ($user->role !== 'admin' && $task->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $previousAssignee = $task->user_id;
        $task = $this->taskRepository->update($task, $data);

        if (array_key_exists('user_id', $data) && (int) $data['user_id'] !== (int) $previousAssignee) {
            $this->notifyAssignee($task, $user, (int) $data['user_id']);
        }

        return $task;
    }

    public function delete($user, Task $task)
    {
        if ($user->role !== 'admin' && $task->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        return $this->taskRepository->delete($task);
    }

    /**
     * Notify a user that a task was assigned to them — but never notify
     * someone about assigning a task to themselves.
     */
    protected function notifyAssignee(Task $task, $actor, int $assigneeId): void
    {
        if ($assigneeId === (int) $actor->id) {
            return;
        }

        $assignee = User::find($assigneeId);
        if ($assignee) {
            $assignee->notify(new TaskAssigned($task, $actor->name));
        }
    }
}
