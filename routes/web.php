<?php

use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => \Illuminate\Foundation\Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Executive CBET Dashboard
    Route::get('/dashboard', [CurriculumController::class, 'dashboard'])->name('dashboard');

    // Course Units Explorer & Submission
    Route::get('/courses', [CurriculumController::class, 'courses'])->name('courses.index');
    Route::get('/courses/create', [CurriculumController::class, 'createCourse'])->name('courses.create');
    Route::post('/courses', [CurriculumController::class, 'storeCourse'])->name('courses.store');
    Route::get('/courses/{courseUnit}', [CurriculumController::class, 'showCourse'])->name('courses.show');
    Route::post('/courses/{courseUnit}/check', [CurriculumController::class, 'runCheck'])->name('courses.check');
    Route::patch('/courses/{courseUnit}/status', [CurriculumController::class, 'updateCourseStatus'])->name('courses.status');
    Route::patch('/outcomes/{outcome}', [CurriculumController::class, 'updateOutcome'])->name('outcomes.update');

    // Human-in-the-Loop Flag Decision (Restricted to Committee and QA)
    Route::patch('/flags/{flag}/resolve', [CurriculumController::class, 'resolveFlag'])->name('flags.resolve');

    // Programme Alignment Matrix (Degree-wide cross tabulation)
    Route::get('/programmes/{programme}/matrix', [CurriculumController::class, 'programmeMatrix'])->name('programmes.matrix');

    // Industry Evidence & Workplace Gaps
    Route::get('/industry-evidence', [CurriculumController::class, 'industryGaps'])->name('industry.gaps');

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
