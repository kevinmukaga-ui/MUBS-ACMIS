<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'faculty',
        'department',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Role checking helpers based on Project Proposal.
     */
    public function isLecturer(): bool
    {
        return $this->role === 'lecturer';
    }

    public function isCommitteeMember(): bool
    {
        return $this->role === 'committee_member';
    }

    public function isCoordinator(): bool
    {
        return $this->role === 'coordinator';
    }

    public function isQaOfficer(): bool
    {
        return in_array($this->role, ['qa_officer', 'admin']);
    }

    /**
     * Check if user can resolve audit flags (Human-in-the-Loop decision).
     */
    public function canResolveFlags(): bool
    {
        return in_array($this->role, ['committee_member', 'coordinator', 'qa_officer', 'admin']);
    }

    /**
     * Check if user can formally approve/accredit a course for NCHE.
     */
    public function canApproveAccreditation(): bool
    {
        return in_array($this->role, ['qa_officer', 'admin']);
    }

    /**
     * Check if user can request revisions from lecturers.
     */
    public function canRequestRevision(): bool
    {
        return in_array($this->role, ['committee_member', 'coordinator', 'qa_officer', 'admin']);
    }
}
