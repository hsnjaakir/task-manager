<?php

namespace App\Repositories;

use App\Models\Project;

class ProjectRepository
{
    /**
     * Admins see all projects; regular users see only their own.
     * Each project carries a live task_count for the UI.
     */
    public function getForUser($user)
    {
        $query = Project::withCount('tasks')->with('user:id,name')->latest();

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        return $query->get();
    }

    public function findForUser($user, $id)
    {
        $query = Project::withCount('tasks')->with('user:id,name');

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        return $query->find($id);
    }

    public function create($userId, array $data)
    {
        $data['user_id'] = $userId;
        return Project::create($data)->loadCount('tasks')->load('user:id,name');
    }

    public function update(Project $project, array $data)
    {
        $project->update($data);
        return $project->loadCount('tasks')->load('user:id,name');
    }

    public function delete(Project $project)
    {
        // tasks.project_id is set to null via the migration's nullOnDelete()
        return $project->delete();
    }
}
