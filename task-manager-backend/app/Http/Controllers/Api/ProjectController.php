<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    protected $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index()
    {
        return response()->json($this->projectService->getAll(Auth::user()));
    }

    public function show($id)
    {
        return response()->json($this->projectService->find(Auth::user(), $id));
    }

    public function store(StoreProjectRequest $request)
    {
        $project = $this->projectService->create(Auth::user(), $request->validated());
        return response()->json($project, 201);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project = $this->projectService->update(Auth::user(), $project, $request->validated());
        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $this->projectService->delete(Auth::user(), $project);
        return response()->json(null, 204);
    }
}
