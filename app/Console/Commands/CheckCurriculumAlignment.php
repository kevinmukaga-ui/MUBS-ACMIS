<?php

namespace App\Console\Commands;

use App\Models\CourseUnit;
use App\Services\CurriculumAlignmentService;
use Illuminate\Console\Command;

class CheckCurriculumAlignment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cbet:check {course_unit_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run the 4 CBET curriculum alignment checks on course units';

    /**
     * Execute the console command.
     */
    public function handle(CurriculumAlignmentService $service): int
    {
        $id = $this->argument('course_unit_id');

        $query = CourseUnit::with('programme');
        if ($id) {
            $query->where('id', $id);
        }

        $units = $query->get();

        if ($units->isEmpty()) {
            $this->warn('No course units found to analyze.');
            return self::FAILURE;
        }

        $this->info("Analyzing " . $units->count() . " course unit outline(s) using ML Alignment Engine...");

        foreach ($units as $unit) {
            $this->newLine();
            $this->line("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            $this->info("Checking: {$unit->code} - {$unit->title} [Version: {$unit->version_type}]");
            
            $res = $service->checkCourseUnit($unit);
            
            $score = $res['overall_alignment_score'];
            $flagCount = count($res['flags']);

            $this->line("• Alignment Score: <options=bold>{$score}%</>");
            $this->line("• Generated Alignment Flags: <comment>{$flagCount}</comment>");

            if (!empty($res['flags'])) {
                foreach ($res['flags'] as $flag) {
                    $severity = $flag['severity'] ?? 'warning';
                    $color = $severity === 'error' ? 'red' : ($severity === 'warning' ? 'yellow' : 'cyan');
                    $this->line("  [<fg={$color}>{$severity}</>] {$flag['flag_title']}");
                    $this->line("    └ Reason: {$flag['flag_reason']}");
                    if (!empty($flag['suggested_action'])) {
                        $this->line("    └ Suggestion: {$flag['suggested_action']}");
                    }
                }
            }
        }

        $this->newLine();
        $this->info("All course unit alignment checks completed successfully.");
        return self::SUCCESS;
    }
}
