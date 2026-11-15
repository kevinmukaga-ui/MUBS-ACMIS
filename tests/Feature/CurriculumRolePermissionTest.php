<?php

namespace Tests\Feature;

use App\Models\AlignmentFlag;
use App\Models\CourseUnit;
use App\Models\Programme;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CurriculumRolePermissionTest extends TestCase
{
    use RefreshDatabase;

    private function createFixtures(): array
    {
        $prog = Programme::create([
            'code' => 'BBC',
            'name' => 'Bachelor of Business Computing',
            'faculty' => 'Faculty of Computing',
            'department' => 'Computing',
        ]);

        $course = CourseUnit::create([
            'programme_id' => $prog->id,
            'code' => 'BBC1101',
            'title' => 'Test Course',
            'year_of_study' => 1,
            'semester' => 1,
            'credit_units' => 3,
            'version_type' => 'cbet_revised',
            'alignment_status' => 'checked',
        ]);

        $flag = AlignmentFlag::create([
            'course_unit_id' => $course->id,
            'check_type' => 'outcome_quality',
            'severity' => 'warning',
            'flag_title' => 'Vague Action Verb',
            'flag_reason' => 'Outcome uses non-measurable verb understand.',
            'resolution_status' => 'pending',
        ]);

        return [$course, $flag];
    }

    public function test_lecturer_cannot_resolve_flags(): void
    {
        [$course, $flag] = $this->createFixtures();

        $lecturer = User::factory()->create([
            'role' => 'lecturer',
        ]);

        $response = $this->actingAs($lecturer)->patch(route('flags.resolve', $flag->id), [
            'resolution_status' => 'accepted',
            'resolution_note' => 'Lecturer trying to resolve flag',
        ]);

        $response->assertStatus(403);
    }

    public function test_committee_member_can_resolve_flags(): void
    {
        [$course, $flag] = $this->createFixtures();

        $committee = User::factory()->create([
            'role' => 'committee_member',
        ]);

        $response = $this->actingAs($committee)->patch(route('flags.resolve', $flag->id), [
            'resolution_status' => 'accepted',
            'resolution_note' => 'Committee resolved flag with academic justification',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('alignment_flags', [
            'id' => $flag->id,
            'resolution_status' => 'accepted',
        ]);
    }

    public function test_only_qa_officer_can_approve_nche_accreditation(): void
    {
        [$course, $flag] = $this->createFixtures();

        $lecturer = User::factory()->create(['role' => 'lecturer']);
        $qa = User::factory()->create(['role' => 'qa_officer']);

        // Lecturer attempts accreditation approval -> 403
        $responseLecturer = $this->actingAs($lecturer)->patch(route('courses.status', $course->id), [
            'status' => 'approved',
        ]);
        $responseLecturer->assertStatus(403);

        // QA Officer approves accreditation -> 302
        $responseQa = $this->actingAs($qa)->patch(route('courses.status', $course->id), [
            'status' => 'approved',
        ]);
        $responseQa->assertStatus(302);
        $this->assertDatabaseHas('course_units', [
            'id' => $course->id,
            'alignment_status' => 'approved',
        ]);
    }
}
