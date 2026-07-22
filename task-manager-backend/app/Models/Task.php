<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'user_id',
        'project_id',
    ];

    /**
     * Relation: Each task belongs to one user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation: a task may belong to one project
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
