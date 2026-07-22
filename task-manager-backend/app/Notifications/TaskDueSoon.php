<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskDueSoon extends Notification
{
    use Queueable;

    public function __construct(public Task $task) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Task due soon: ' . $this->task->title)
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('A task is due soon.')
            ->line('Task: ' . $this->task->title)
            ->line('Due: ' . $this->task->due_date)
            ->action('View task', url('/dashboard'))
            ->line('Don\'t let it slip.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'       => 'task_due_soon',
            'task_id'    => $this->task->id,
            'task_title' => $this->task->title,
            'due_date'   => (string) $this->task->due_date,
            'message'    => '"' . $this->task->title . '" is due ' . \Illuminate\Support\Carbon::parse($this->task->due_date)->diffForHumans(),
        ];
    }
}
