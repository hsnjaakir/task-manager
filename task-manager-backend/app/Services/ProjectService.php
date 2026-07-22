<?php

namespace App\Services;

use App\Models\Project;
use App\Repositories\ProjectRepository;

class ProjectService
{
    protected $projectRepository;

    public function __construct(ProjectRepository $projectRepository)
    {
        $this->projectRepository = $projectRepository;
    }

    public function getAll($user)
    {
        return $this->projectRepository->getForUser($user);
    }

    public function find($user, $id)
    {
        $project = $this->projectRepository->findForUser($user, $id);

        if (!$project) {
            abort(404, 'Project not found');
        }

        return $project;
    }

    public function create($user, array $data)
    {
        return $this->projectRepository->create($user->id, $data);
    }

    public function update($user, Project $project, array $data)
    {
        $this->authorizeOwnership($user, $project);
        return $this->projectRepository->update($project, $data);
    }

    public function delete($user, Project $project)
    {
        $this->authorizeOwnership($user, $project);
        return $this->projectRepository->delete($project);
    }

    /**
     * A regular user may only touch their own projects; admins may touch any.
     */
    protected function authorizeOwnership($user, Project $project)
    {
        if ($user->role !== 'admin' && $project->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }
    }
}
