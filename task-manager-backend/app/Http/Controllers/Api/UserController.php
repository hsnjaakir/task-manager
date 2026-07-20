<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        $authUser = Auth::user();

        if ($authUser->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($this->userService->getAllUsers());
    }

    public function show($id)
    {
        $authUser = Auth::user();

        if ($authUser->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $result = $this->userService->getUserWithTasks($id);

        if (!$result) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($result);
    }
}
