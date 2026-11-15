<?php

namespace App\Services;

use App\Models\AlignmentFlag;
use App\Models\CourseUnit;
use App\Models\IndustryEvidence;
use App\Models\LearningOutcome;
use App\Models\OutcomeAssessmentLink;
use App\Models\OutcomeCompetenceLink;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;

class CurriculumAlignmentService
{
    /**
     * Run all 4 alignment checks on a course unit outline using the ML engine.
     */
    public function checkCourseUnit(CourseUnit $courseUnit): array
    {
        $courseUnit->load([
            'programme.competences',
            'learningOutcomes',
            'assessmentTasks',
        ]);

        $industryEvidence = IndustryEvidence::where('target_field', 'computing')
            ->orWhere('target_field', $courseUnit->programme->code === 'BCOM' ? 'commerce' : 'office_management')
            ->get();

        $payload = [
            'course_unit' => [
                'id' => $courseUnit->id,
                'code' => $courseUnit->code,
                'title' => $courseUnit->title,
                'version_type' => $courseUnit->version_type,
            ],
            'learning_outcomes' => $courseUnit->learningOutcomes->map(fn ($clo) => [
                'id' => $clo->id,
                'outcome_number' => $clo->outcome_number,
                'description' => $clo->description,
            ])->toArray(),
            'programme_competences' => $courseUnit->programme->competences->map(fn ($pc) => [
                'id' => $pc->id,
                'code' => $pc->code,
                'title' => $pc->title,
                'description' => $pc->description,
            ])->toArray(),
            'assessment_tasks' => $courseUnit->assessmentTasks->map(fn ($ass) => [
                'id' => $ass->id,
                'title' => $ass->title,
                'type' => $ass->type,
                'description' => $ass->description,
            ])->toArray(),
            'industry_evidence' => $industryEvidence->map(fn ($ind) => [
                'id' => $ind->id,
                'source_type' => $ind->source_type,
                'title' => $ind->title,
                'organization' => $ind->organization,
                'extracted_competences' => $ind->extracted_competences,
            ])->toArray(),
        ];

        // Call the Python ML Engine
        $pythonPath = base_path('ml_engine/venv/Scripts/python.exe');
        if (! file_exists($pythonPath)) {
            $pythonPath = 'python';
        }
        $scriptPath = base_path('ml_engine/alignment_checker.py');

        // Pass Windows system environment variables so Winsock / networking DLLs initialize correctly
        $systemRoot = getenv('SystemRoot') ?: (getenv('SYSTEMROOT') ?: 'C:\Windows');
        $env = array_merge($_SERVER, [
            'SystemRoot' => $systemRoot,
            'SYSTEMROOT' => $systemRoot,
            'WINDIR' => getenv('WINDIR') ?: $systemRoot,
            'PATH' => getenv('PATH') ?: ($systemRoot . '\System32;' . $systemRoot),
            'TEMP' => getenv('TEMP') ?: ($systemRoot . '\Temp'),
            'TMP' => getenv('TMP') ?: ($systemRoot . '\Temp'),
        ]);

        $process = new Process([$pythonPath, $scriptPath], base_path('ml_engine'), $env);
        $process->setInput(json_encode($payload));
        $process->setTimeout(60);
        $process->run();

        if (! $process->isSuccessful()) {
            Log::error('ML Alignment Checker Failed: ' . $process->getErrorOutput());
            throw new \RuntimeException('Curriculum alignment analysis failed: ' . $process->getErrorOutput());
        }

        $rawOutput = $process->getOutput();
        $result = json_decode($rawOutput, true);

        if (! is_array($result)) {
            Log::error('ML Alignment Checker produced invalid JSON output: ' . $rawOutput);
            throw new \RuntimeException('Curriculum alignment analysis produced invalid response.');
        }

        // Update database with analysis outputs
        $this->persistAnalysisResults($courseUnit, $result);

        return $result;
    }

    /**
     * Persist Bloom classifications, semantic links, and generated flags to MySQL.
     */
    protected function persistAnalysisResults(CourseUnit $courseUnit, array $result): void
    {
        // 1. Update Learning Outcomes with Bloom levels & Action verbs
        if (! empty($result['quality_results'])) {
            foreach ($result['quality_results'] as $qr) {
                if (isset($qr['id'])) {
                    LearningOutcome::where('id', $qr['id'])->update([
                        'action_verb' => $qr['action_verb'] ?? null,
                        'bloom_level' => $qr['bloom_level'] ?? null,
                        'bloom_confidence' => $qr['bloom_confidence'] ?? 0.00,
                        'is_measurable' => $qr['is_measurable'] ?? true,
                        'suggested_verbs' => $qr['suggested_verbs'] ?? [],
                    ]);
                }
            }
        }

        // 2. Persist Outcome to Competence links
        if (! empty($result['competence_alignment'])) {
            foreach ($result['competence_alignment'] as $match) {
                if (! empty($match['outcome_id']) && ! empty($match['matched_competence_id'])) {
                    OutcomeCompetenceLink::updateOrCreate(
                        [
                            'learning_outcome_id' => $match['outcome_id'],
                            'programme_competence_id' => $match['matched_competence_id'],
                        ],
                        [
                            'similarity_score' => $match['similarity_score'] ?? 0.0,
                            'is_primary' => true,
                        ]
                    );
                }
            }
        }

        // 3. Persist Outcome to Assessment links
        if (! empty($result['assessment_alignment'])) {
            foreach ($result['assessment_alignment'] as $assMatch) {
                if (! empty($assMatch['outcome_id']) && ! empty($assMatch['assessment_id'])) {
                    OutcomeAssessmentLink::updateOrCreate(
                        [
                            'learning_outcome_id' => $assMatch['outcome_id'],
                            'assessment_task_id' => $assMatch['assessment_id'],
                        ],
                        [
                            'coverage_score' => $assMatch['coverage_score'] ?? 1.0,
                        ]
                    );
                }
            }
        }

        // 4. Persist Alignment Flags (Human-in-the-Loop review items)
        if (! empty($result['flags'])) {
            foreach ($result['flags'] as $flag) {
                AlignmentFlag::updateOrCreate(
                    [
                        'course_unit_id' => $courseUnit->id,
                        'flag_title' => $flag['flag_title'],
                    ],
                    [
                        'learning_outcome_id' => $flag['learning_outcome_id'] ?? null,
                        'programme_competence_id' => $flag['programme_competence_id'] ?? null,
                        'check_type' => $flag['check_type'] ?? 'outcome_quality',
                        'severity' => $flag['severity'] ?? 'warning',
                        'flag_reason' => $flag['flag_reason'] ?? '',
                        'suggested_action' => $flag['suggested_action'] ?? null,
                        'resolution_status' => 'pending',
                    ]
                );
            }
        }

        // 5. Update Course Unit alignment score and status
        $score = $result['overall_alignment_score'] ?? 50.0;
        $status = $score >= 80.0 ? 'checked' : 'requires_revision';

        $courseUnit->update([
            'alignment_score' => $score,
            'alignment_status' => $status,
        ]);
    }
}
