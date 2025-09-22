<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority'    => 'nullable|in:low,medium,high',
            'status'      => 'nullable|in:pending,in_progress,completed',
            'due_date'    => 'nullable|date',
        ];

        if (auth()->check() && auth()->user()->role === 'admin') {
            $rules['user_id'] = 'required|exists:users,id';
        }

        return $rules;
    }
}
