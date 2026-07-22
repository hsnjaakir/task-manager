<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Latest notifications for the bell, plus the unread count.
     */
    public function index()
    {
        $user = Auth::user();

        return response()->json([
            'notifications' => $user->notifications()->latest()->limit(20)->get(),
            'unread_count'  => $user->unreadNotifications()->count(),
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['message' => 'Marked as read']);
    }

    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All marked as read']);
    }
}
