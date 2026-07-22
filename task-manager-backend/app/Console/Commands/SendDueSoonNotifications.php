<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Notifications\TaskDueSoon;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SendDueSoonNotifications extends Command
{
    protected $signature = 'tasks:notify-due-soon';

    protected $description = 'Notify assignees of tasks due within the next 24 hours';

    public function handle(): int
    {
        // Tasks due between now and 24h from now, not yet completed.
        $window = Carbon::now()->addDay();

        $tasks = Task::with('user')
            ->whereNotNull('due_date')
            ->where('status', '!=', 'completed')
            ->whereBetween('due_date', [Carbon::now()->startOfDay(), $window])
            ->get();

        $sent = 0;
        foreach ($tasks as $task) {
            if ($task->user) {
                $task->user->notify(new TaskDueSoon($task));
                $sent++;
            }
        }

        $this->info("Sent {$sent} due-soon notification(s).");
        return self::SUCCESS;
    }
}
