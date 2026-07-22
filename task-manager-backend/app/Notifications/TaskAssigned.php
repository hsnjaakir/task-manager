<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskAssigned extends Notification
{
    use Queueable;

    public function __construct(
        public Task $task,
        public string $assignedByName
    ) {}

    /**
     * Deliver over both the in-app bell (database) and email.
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('A task was assigned to you: ' . $this->task->title)
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line($this->assignedByName . ' assigned you a task.')
            ->line('Task: ' . $this->task->title)
            ->when($this->task->due_date, fn ($m) => $m->line('Due: ' . $this->task->due_date))
            ->action('View task', url('/dashboard'))
            ->line('Stay on top of your work with Taskline.');
    }

    /**
     * Stored as JSON in the notifications table; read by the in-app bell.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type'        => 'task_assigned',
            'task_id'     => $this->task->id,
            'task_title'  => $this->task->title,
            'assigned_by' => $this->assignedByName,
            'message'     => $this->assignedByName . ' assigned you "' . $this->task->title . '"',
        ];
    }
}
