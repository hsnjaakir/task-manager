<?php

namespace App\Services;

use App\Repositories\UserRepository;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getAllUsers()
    {
        return $this->userRepository->getAll();
    }

    public function getUserWithTasks($id)
    {
        $user = $this->userRepository->getById($id);

        if (!$user) {
            return null;
        }

        return [
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'tasks' => $user->tasks()->latest()->get(),
        ];
    }
}
