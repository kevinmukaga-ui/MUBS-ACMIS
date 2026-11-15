<?php

namespace App\Http\Controllers;

use App\Models\AlignmentFlag;
use App\Models\AssessmentTask;
use App\Models\CourseUnit;
use App\Models\IndustryEvidence;
use App\Models\LearningOutcome;
use App\Models\Programme;
use App\Services\CurriculumAlignmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CurriculumController extends Controller
{
    /**
     * Executive Overview / CBET Alignment Dashboard with Role-Specific Views.
     */
    public function dashboard(Request $request): Response
    {
        $user = $request->user();
        $programmes = Programme::withCount(['courseUnits', 'competences'])->get();

        // If lecturer, highlight their assigned courses, else show latest courses
        $courseQuery = CourseUnit::with('programme');
        if ($user && $user->isLecturer()) {
            $myCourses = (clone $courseQuery)->where('lecturer_name', 'like', "%{$user->name}%")->orWhere('lecturer_name', 'like', '%Lumu%')->get();
            $recentCourses = $myCourses->isNotEmpty() ? $myCourses : $courseQuery->latest()->take(10)->get();
        } else {
            $recentCourses = $courseQuery->latest()->take(10)->get();
        }

        $flagsCount = [
            'total' => AlignmentFlag::where('resolution_status', 'pending')->count(),
            'errors' => AlignmentFlag::where('resolution_status', 'pending')->where('severity', 'error')->count(),
            'warnings' => AlignmentFlag::where('resolution_status', 'pending')->where('severity', 'warning')->count(),
            'info' => AlignmentFlag::where('resolution_status', 'pending')->where('severity', 'info')->count(),
        ];

        // Bloom cognitive level distribution across all learning outcomes
        $bloomDistribution = LearningOutcome::selectRaw('bloom_level, count(*) as count')
            ->whereNotNull('bloom_level')
            ->groupBy('bloom_level')
            ->pluck('count', 'bloom_level')
            ->toArray();

        $cbetCompliantUnits = CourseUnit::where('version_type', 'cbet_revised')
            ->whereIn('alignment_status', ['checked', 'approved'])
            ->count();

        $totalUnits = CourseUnit::count();
        $complianceRate = $totalUnits > 0 ? round(($cbetCompliantUnits / $totalUnits) * 100, 1) : 0;

        return Inertia::render('Curriculum/Dashboard', [
            'programmes' => $programmes,
            'recentCourses' => $recentCourses,
            'flagsCount' => $flagsCount,
            'bloomDistribution' => $bloomDistribution,
            'complianceRate' => $complianceRate,
            'totalUnits' => $totalUnits,
        ]);
    }

    /**
     * Show custom form to submit a new course outline.
     */
    public function createCourse(): Response
    {
        $programmes = Programme::with('competences')->get();

        return Inertia::render('Curriculum/CreateCourse', [
            'programmes' => $programmes,
        ]);
    }

    /**
     * Store and immediately run alignment check on a newly submitted course outline.
     */
    public function storeCourse(Request $request, CurriculumAlignmentService $service): RedirectResponse
    {
        $validated = $request->validate([
            'programme_id' => 'required|exists:programmes,id',
            'code' => 'required|string|max:20',
            'title' => 'required|string|max:255',
            'year_of_study' => 'required|integer|min:1|max:5',
            'semester' => 'required|integer|min:1|max:2',
            'credit_units' => 'required|integer|min:1|max:10',
            'version_type' => 'required|in:old,cbet_revised',
            'description' => 'nullable|string',
            'outcomes' => 'required|array|min:1',
            'outcomes.*.description' => 'required|string|min:5',
            'assessments' => 'required|array|min:1',
            'assessments.*.title' => 'required|string',
            'assessments.*.type' => 'required|string',
            'assessments.*.weight_percentage' => 'required|numeric|min:1|max:100',
        ]);

        $courseUnit = CourseUnit::create([
            'programme_id' => $validated['programme_id'],
            'code' => strtoupper($validated['code']),
            'title' => $validated['title'],
            'year_of_study' => $validated['year_of_study'],
            'semester' => $validated['semester'],
            'credit_units' => $validated['credit_units'],
            'version_type' => $validated['version_type'],
            'description' => $validated['description'] ?? null,
            'lecturer_name' => auth()->user()?->name ?? 'Dr. Stephen Lumu',
            'alignment_status' => 'pending',
        ]);

        // Save outcomes
        foreach ($validated['outcomes'] as $index => $clo) {
            LearningOutcome::create([
                'course_unit_id' => $courseUnit->id,
                'outcome_number' => $index + 1,
                'description' => $clo['description'],
            ]);
        }

        // Save assessments
        foreach ($validated['assessments'] as $ass) {
            AssessmentTask::create([
                'course_unit_id' => $courseUnit->id,
                'title' => $ass['title'],
                'type' => $ass['type'],
                'weight_percentage' => $ass['weight_percentage'],
                'description' => $ass['description'] ?? null,
            ]);
        }

        // Run ML Alignment Engine
        $service->checkCourseUnit($courseUnit);

        return redirect()->route('courses.show', $courseUnit->id)
            ->with('success', "Course outline for {$courseUnit->code} submitted and analyzed successfully!");
    }

    /**
     * List all course units across programmes with filter by version (old vs cbet).
     */
    public function courses(Request $request): Response
    {
        $query = CourseUnit::with(['programme', 'learningOutcomes', 'flags']);

        if ($request->has('programme_id') && $request->programme_id) {
            $query->where('programme_id', $request->programme_id);
        }

        if ($request->has('version') && $request->version) {
            $query->where('version_type', $request->version);
        }

        $courses = $query->paginate(12)->withQueryString();
        $programmes = Programme::all(['id', 'code', 'name']);

        return Inertia::render('Curriculum/Courses', [
            'courses' => $courses,
            'programmes' => $programmes,
            'filters' => $request->only(['programme_id', 'version']),
        ]);
    }

    /**
     * Course Unit Alignment Report & Review Screen.
     */
    public function showCourse(CourseUnit $courseUnit): Response
    {
        $courseUnit->load([
            'programme.competences',
            'learningOutcomes.competenceLinks.programmeCompetence',
            'learningOutcomes.assessmentLinks.assessmentTask',
            'assessmentTasks',
            'flags' => fn ($q) => $q->latest(),
        ]);

        return Inertia::render('Curriculum/CourseDetail', [
            'course' => $courseUnit,
            'programme' => $courseUnit->programme,
            'outcomes' => $courseUnit->learningOutcomes,
            'assessments' => $courseUnit->assessmentTasks,
            'flags' => $courseUnit->flags,
        ]);
    }

    /**
     * Trigger ML Alignment Check on demand for a course unit.
     */
    public function runCheck(CourseUnit $courseUnit, CurriculumAlignmentService $service): RedirectResponse
    {
        $service->checkCourseUnit($courseUnit);

        return back()->with('success', "Curriculum alignment analysis completed for {$courseUnit->code}.");
    }

    /**
     * Lecturer edits/rewrites a learning outcome directly to resolve flags.
     */
    public function updateOutcome(Request $request, LearningOutcome $outcome): RedirectResponse
    {
        $validated = $request->validate([
            'description' => 'required|string|min:10',
        ]);

        $outcome->update($validated);

        // Auto-retrigger alignment service for this course unit
        app(CurriculumAlignmentService::class)->checkCourseUnit($outcome->courseUnit);

        return back()->with('success', "Learning outcome #{$outcome->outcome_number} updated and re-analyzed.");
    }

    /**
     * Human-in-the-Loop Decision: Accept, Edit, or Reject a Flag.
     * Restricted to Review Committee, Coordinators, and QA Officers.
     */
    public function resolveFlag(Request $request, AlignmentFlag $flag): RedirectResponse
    {
        $user = $request->user();

        if (!$user->canResolveFlags()) {
            abort(403, 'Permission denied: Only Curriculum Review Committee members or QA Officers can formally resolve audit flags. As a lecturer, please edit your Course Learning Outcomes to fix the flagged issue.');
        }

        $validated = $request->validate([
            'resolution_status' => 'required|in:accepted,edited,rejected',
            'resolution_note' => 'required|string|min:3',
        ]);

        $flag->update([
            'resolution_status' => $validated['resolution_status'],
            'resolution_note' => $validated['resolution_note'],
            'resolved_by' => $user->id,
            'resolved_at' => now(),
        ]);

        return back()->with('success', "Audit flag resolved as '{$validated['resolution_status']}' with formal committee justification.");
    }

    /**
     * Formally update course accreditation/audit status.
     * Restricted to Committee Members (recommend/revision) and QA Officers (approved/accredited).
     */
    public function updateCourseStatus(Request $request, CourseUnit $courseUnit): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,requires_revision,checked',
            'note' => 'nullable|string',
        ]);

        $user = $request->user();

        if ($validated['status'] === 'approved' && !$user->canApproveAccreditation()) {
            abort(403, 'Permission denied: Only the Quality Assurance Directorate can officially certify course units as approved for NCHE accreditation.');
        }

        if ($validated['status'] === 'requires_revision' && !$user->canRequestRevision()) {
            abort(403, 'Permission denied: Unauthorized to return course units for revision.');
        }

        $courseUnit->update([
            'alignment_status' => $validated['status'],
        ]);

        $statusLabel = strtoupper(str_replace('_', ' ', $validated['status']));
        return back()->with('success', "Course {$courseUnit->code} status updated to {$statusLabel}.");
    }

    /**
     * Programme Alignment Matrix (Degree-wide cross tabulation).
     */
    public function programmeMatrix(Programme $programme): Response
    {
        $programme->load([
            'competences.outcomeLinks.learningOutcome.courseUnit',
            'courseUnits' => fn ($q) => $q->where('version_type', 'cbet_revised')->with('learningOutcomes'),
        ]);

        // Construct matrix: Programme Competence vs Course Units
        $matrix = [];
        foreach ($programme->competences as $pc) {
            $coveredBy = [];
            foreach ($pc->outcomeLinks as $link) {
                if ($link->learningOutcome && $link->learningOutcome->courseUnit) {
                    $cu = $link->learningOutcome->courseUnit;
                    $coveredBy[$cu->code] = [
                        'code' => $cu->code,
                        'title' => $cu->title,
                        'similarity' => $link->similarity_score,
                    ];
                }
            }

            $matrix[] = [
                'competence_id' => $pc->id,
                'code' => $pc->code,
                'title' => $pc->title,
                'category' => $pc->category,
                'course_coverage' => array_values($coveredBy),
                'is_orphaned' => empty($coveredBy),
            ];
        }

        return Inertia::render('Curriculum/ProgrammeMatrix', [
            'programme' => $programme,
            'matrix' => $matrix,
            'allProgrammes' => Programme::all(['id', 'code', 'name']),
        ]);
    }

    /**
     * Industry Evidence & Competence Gap Overview.
     */
    public function industryGaps(): Response
    {
        $evidence = IndustryEvidence::latest()->get();
        $flags = AlignmentFlag::where('check_type', 'industry_gap')->latest()->get();

        return Inertia::render('Curriculum/IndustryGaps', [
            'evidence' => $evidence,
            'gapFlags' => $flags,
        ]);
    }
}
