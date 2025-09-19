<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function getAll()
    {
        return User::select('id', 'name', 'email', 'role')->get();
    }
}
