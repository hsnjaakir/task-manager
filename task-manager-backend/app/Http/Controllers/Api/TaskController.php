<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index()
    {
        return response()->json($this->taskService->getAll(Auth::user()));
    }

    public function store(StoreTaskRequest $request)
    {
        $task = $this->taskService->create(Auth::user(), $request->validated());
        return response()->json($task, 201);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task = $this->taskService->update(Auth::user(), $task, $request->validated());
        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $this->taskService->delete(Auth::user(), $task);
        return response()->json(null, 204);
    }
}
