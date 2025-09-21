<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // We rely on role logic in rules()
    }

    public function rules(): array
    {
        $rules = [
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'status'      => 'sometimes|in:pending,in-progress,completed',
            'due_date'    => 'sometimes|date',
        ];

        // Only allow user_id updates if the logged-in user is an admin
        if ($this->user() && $this->user()->role === 'admin') {
            $rules['user_id'] = [
                'sometimes',
                'integer',
                Rule::exists('users', 'id'),
            ];
        }

        return $rules;
    }
}
