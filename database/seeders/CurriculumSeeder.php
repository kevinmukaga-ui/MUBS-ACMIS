<?php

namespace Database\Seeders;

use App\Models\AssessmentTask;
use App\Models\CourseUnit;
use App\Models\IndustryEvidence;
use App\Models\LearningOutcome;
use App\Models\OutcomeAssessmentLink;
use App\Models\OutcomeCompetenceLink;
use App\Models\Programme;
use App\Models\ProgrammeCompetence;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CurriculumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Users (Roles from Proposal)
        $lecturer = User::firstOrCreate(
            ['email' => 'lecturer@mubs.ac.ug'],
            [
                'name' => 'Dr. Stephen Lumu (Lecturer)',
                'password' => Hash::make('password'),
                'role' => 'lecturer',
                'faculty' => 'Faculty of Computing and Informatics',
                'department' => 'Department of Applied Computing & IT',
            ]
        );

        User::firstOrCreate(
            ['email' => 'qa@mubs.ac.ug'],
            [
                'name' => 'Quality Assurance Officer',
                'password' => Hash::make('password'),
                'role' => 'qa_officer',
                'faculty' => 'Academic Affairs & QA Directorate',
                'department' => 'Quality Assurance Office',
            ]
        );

        User::firstOrCreate(
            ['email' => 'committee@mubs.ac.ug'],
            [
                'name' => 'Curriculum Review Committee Chair',
                'password' => Hash::make('password'),
                'role' => 'committee_member',
                'faculty' => 'Faculty of Computing and Informatics',
                'department' => 'Curriculum Review Committee',
            ]
        );

        User::firstOrCreate(
            ['email' => 'coordinator@mubs.ac.ug'],
            [
                'name' => 'BBC Programme Coordinator',
                'password' => Hash::make('password'),
                'role' => 'coordinator',
                'faculty' => 'Faculty of Computing and Informatics',
                'department' => 'Department of Applied Computing & IT',
            ]
        );

        // 2. Seed Programmes (The 3 target programmes in Proposal Scope)
        $bbc = Programme::firstOrCreate(
            ['code' => 'BBC'],
            [
                'name' => 'Bachelor of Business Computing',
                'faculty' => 'Faculty of Computing and Informatics',
                'department' => 'Department of Applied Computing & IT',
                'duration_years' => 3,
                'description' => 'Equips graduates with practical computing, software development, data analytics, and enterprise business systems capabilities to solve contemporary business problems.',
                'is_cbet_aligned' => false,
            ]
        );

        $boim = Programme::firstOrCreate(
            ['code' => 'BOIM'],
            [
                'name' => 'Bachelor of Office and Information Management',
                'faculty' => 'Faculty of Computing and Informatics',
                'department' => 'Department of Information Systems',
                'duration_years' => 3,
                'description' => 'Develops competencies in electronic records administration, digital office management, and business communication systems.',
                'is_cbet_aligned' => false,
            ]
        );

        $bcom = Programme::firstOrCreate(
            ['code' => 'BCOM'],
            [
                'name' => 'Bachelor of Commerce',
                'faculty' => 'Faculty of Commerce',
                'department' => 'Department of Accounting and Finance',
                'duration_years' => 3,
                'description' => 'Prepares professionals in financial accounting, auditing, strategic taxation, and commercial analysis.',
                'is_cbet_aligned' => false,
            ]
        );

        // 3. Seed Programme Competences for BBC
        $pc1 = ProgrammeCompetence::firstOrCreate(
            ['programme_id' => $bbc->id, 'code' => 'PC1'],
            [
                'title' => 'Software & Web Solutions Development',
                'description' => 'Design, code, test, and deploy secure enterprise business software and web applications using contemporary frameworks.',
                'category' => 'Technical',
            ]
        );

        $pc2 = ProgrammeCompetence::firstOrCreate(
            ['programme_id' => $bbc->id, 'code' => 'PC2'],
            [
                'title' => 'Database & Data Analytics Systems',
                'description' => 'Model, query, and manage relational and modern database architectures to derive predictive business intelligence from operational data.',
                'category' => 'Analytical',
            ]
        );

        $pc3 = ProgrammeCompetence::firstOrCreate(
            ['programme_id' => $bbc->id, 'code' => 'PC3'],
            [
                'title' => 'Business Process Analysis & System Design',
                'description' => 'Analyze organizational workflows, specify functional software requirements, and model architecture diagrams for IT solutions.',
                'category' => 'Managerial',
            ]
        );

        $pc4 = ProgrammeCompetence::firstOrCreate(
            ['programme_id' => $bbc->id, 'code' => 'PC4'],
            [
                'title' => 'Cybersecurity & IT Governance Compliance',
                'description' => 'Implement information security controls and evaluate organizational data management policies in compliance with the Data Protection and Privacy Act.',
                'category' => 'Workplace',
            ]
        );

        // 4. Seed Course Units for BBC (Both Old vs. CBET Revised versions for comparison)
        // Course 1: Database Management Systems (BBC2102) - CBET Revised
        $cbetDb = CourseUnit::firstOrCreate(
            ['programme_id' => $bbc->id, 'code' => 'BBC2102', 'version_type' => 'cbet_revised'],
            [
                'title' => 'Database Systems for Business',
                'year_of_study' => 2,
                'semester' => 1,
                'credit_units' => 4,
                'description' => 'Competence-based course unit developing practical skills in relational modeling, SQL development, indexing, and transactional integrity.',
                'lecturer_name' => 'Dr. Stephen Lumu',
                'alignment_status' => 'checked',
                'alignment_score' => 92.50,
            ]
        );

        // CLOs for CBET Revised Database
        $clo1 = LearningOutcome::create([
            'course_unit_id' => $cbetDb->id,
            'outcome_number' => 1,
            'description' => 'Design normalized relational database schemas meeting third normal form requirements for commercial business scenarios.',
            'action_verb' => 'design',
            'bloom_level' => 'create',
            'bloom_confidence' => 0.94,
            'is_measurable' => true,
        ]);

        $clo2 = LearningOutcome::create([
            'course_unit_id' => $cbetDb->id,
            'outcome_number' => 2,
            'description' => 'Construct optimized SQL queries involving multi-table joins, subqueries, and aggregate functions for transaction reporting.',
            'action_verb' => 'construct',
            'bloom_level' => 'apply',
            'bloom_confidence' => 0.91,
            'is_measurable' => true,
        ]);

        $clo3 = LearningOutcome::create([
            'course_unit_id' => $cbetDb->id,
            'outcome_number' => 3,
            'description' => 'Analyze database performance bottlenecks using execution plans and apply indexing strategies to enhance response times.',
            'action_verb' => 'analyze',
            'bloom_level' => 'analyse',
            'bloom_confidence' => 0.96,
            'is_measurable' => true,
        ]);

        // Assessments for CBET Revised Database
        $ass1 = AssessmentTask::create([
            'course_unit_id' => $cbetDb->id,
            'title' => 'Practical Database Project (ERP Schema Design & Implementation)',
            'type' => 'practical_project',
            'weight_percentage' => 30.00,
            'description' => 'Students work in teams to design, normalize, and build a PostgreSQL/MySQL database for a local SME.',
        ]);

        $ass2 = AssessmentTask::create([
            'course_unit_id' => $cbetDb->id,
            'title' => 'Mid-Semester Lab Competency Test',
            'type' => 'practical_lab',
            'weight_percentage' => 20.00,
            'description' => 'Timed practical coding test writing complex SQL queries and index evaluations in the computer lab.',
        ]);

        $ass3 = AssessmentTask::create([
            'course_unit_id' => $cbetDb->id,
            'title' => 'Final Practical Examination',
            'type' => 'written_exam',
            'weight_percentage' => 50.00,
            'description' => 'Authentic scenario-based examination testing database design, schema recovery, and security privileges.',
        ]);

        // Link outcomes to competences and assessments
        OutcomeCompetenceLink::create([
            'learning_outcome_id' => $clo1->id,
            'programme_competence_id' => $pc2->id,
            'similarity_score' => 0.8920,
            'is_primary' => true,
        ]);

        OutcomeCompetenceLink::create([
            'learning_outcome_id' => $clo2->id,
            'programme_competence_id' => $pc2->id,
            'similarity_score' => 0.9150,
            'is_primary' => true,
        ]);

        OutcomeCompetenceLink::create([
            'learning_outcome_id' => $clo3->id,
            'programme_competence_id' => $pc2->id,
            'similarity_score' => 0.8670,
            'is_primary' => true,
        ]);

        OutcomeAssessmentLink::create([
            'learning_outcome_id' => $clo1->id,
            'assessment_task_id' => $ass1->id,
            'coverage_score' => 1.0,
        ]);

        OutcomeAssessmentLink::create([
            'learning_outcome_id' => $clo2->id,
            'assessment_task_id' => $ass2->id,
            'coverage_score' => 1.0,
        ]);

        OutcomeAssessmentLink::create([
            'learning_outcome_id' => $clo3->id,
            'assessment_task_id' => $ass3->id,
            'coverage_score' => 1.0,
        ]);

        // Course 2: Legacy / Old Outline of Database Systems (for comparative analysis in proposal!)
        $oldDb = CourseUnit::firstOrCreate(
            ['programme_id' => $bbc->id, 'code' => 'BBC2102', 'version_type' => 'old'],
            [
                'title' => 'Introduction to Database Management Systems',
                'year_of_study' => 2,
                'semester' => 1,
                'credit_units' => 3,
                'description' => 'Traditional lecture-based overview of database concepts.',
                'lecturer_name' => 'Prof. S. Samuel',
                'alignment_status' => 'checked',
                'alignment_score' => 42.00,
            ]
        );

        // Intentionally weak/non-measurable outcomes in old version for the checker to detect!
        LearningOutcome::create([
            'course_unit_id' => $oldDb->id,
            'outcome_number' => 1,
            'description' => 'Understand the fundamental concepts of database management systems and relational models.',
            'action_verb' => 'understand',
            'bloom_level' => 'understand',
            'bloom_confidence' => 0.95,
            'is_measurable' => false,
            'suggested_verbs' => ['Design', 'Construct', 'Formulate'],
        ]);

        LearningOutcome::create([
            'course_unit_id' => $oldDb->id,
            'outcome_number' => 2,
            'description' => 'Appreciate the importance of data normalization in corporate organizations.',
            'action_verb' => 'appreciate',
            'bloom_level' => 'understand',
            'bloom_confidence' => 0.88,
            'is_measurable' => false,
            'suggested_verbs' => ['Apply', 'Execute', 'Evaluate'],
        ]);

        LearningOutcome::create([
            'course_unit_id' => $oldDb->id,
            'outcome_number' => 3,
            'description' => 'Know the syntax of SQL commands.',
            'action_verb' => 'know',
            'bloom_level' => 'remember',
            'bloom_confidence' => 0.92,
            'is_measurable' => false,
            'suggested_verbs' => ['Construct', 'Write', 'Implement'],
        ]);

        // 5. Seed Industry Evidence (from Great Uganda Jobs & DIT ATP cited in proposal)
        IndustryEvidence::create([
            'source_type' => 'dit_profile',
            'title' => 'Mobile Applications Developer Qualification Level 1 (ATP)',
            'organization' => 'Directorate of Industrial Training (DIT), Uganda',
            'publication_date' => '2025-06-15',
            'target_field' => 'computing',
            'extracted_competences' => [
                'Develop cross-platform mobile applications using Flutter or React Native',
                'Implement RESTful APIs and integrate JSON web services with backend databases',
                'Perform mobile app security testing and local SQLite offline data caching',
                'Deploy applications to Google Play Store and manage version releases'
            ],
            'full_text' => 'National occupational standard describing workplace tasks for junior mobile application programmers in Uganda.'
        ]);

        IndustryEvidence::create([
            'source_type' => 'job_advert',
            'title' => 'Junior Full-Stack Web Developer',
            'organization' => 'Great Uganda Jobs / Fintech Employer Kampala',
            'publication_date' => '2026-03-10',
            'target_field' => 'computing',
            'extracted_competences' => [
                'Laravel/PHP backend development',
                'React frontend interface engineering',
                'MySQL database query optimization and indexing',
                'Git version control and automated unit testing',
                'Payment gateway API integration (Mobile Money, MTN/Airtel)'
            ],
            'full_text' => 'We are seeking energetic computing graduates with strong hands-on coding in Laravel and modern React. Experience with MySQL and Mobile Money APIs is required.'
        ]);

        IndustryEvidence::create([
            'source_type' => 'job_advert',
            'title' => 'Business Data Analyst',
            'organization' => 'Great Uganda Jobs / Telecom Sector',
            'publication_date' => '2026-04-22',
            'target_field' => 'computing',
            'extracted_competences' => [
                'SQL query authoring and relational database manipulation',
                'PowerBI or Tableau dashboard visualization',
                'Statistical exploratory data analysis using Python or R',
                'Business requirements specification and stakeholder reporting'
            ],
            'full_text' => 'Leading telecom seeking a data analyst to interpret customer churn and financial performance metrics.'
        ]);
    }
}
