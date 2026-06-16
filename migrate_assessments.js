import { db } from './backend/db/index.js';
import { sql } from 'drizzle-orm';

const queries = [
`CREATE TABLE IF NOT EXISTS \`assignments\` (
	\`id\` varchar(36) NOT NULL DEFAULT (UUID()),
	\`course_id\` varchar(36) NOT NULL,
	\`module_id\` varchar(64),
	\`lesson_id\` varchar(64),
	\`title\` varchar(255),
	\`description\` text,
	\`total_marks\` int,
	\`passing_marks\` int,
	\`submission_days\` int DEFAULT 7,
	\`allow_late_submission\` boolean DEFAULT false,
	\`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	\`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT \`assignments_id\` PRIMARY KEY(\`id\`)
);`,
`CREATE TABLE IF NOT EXISTS \`assignment_submissions\` (
	\`id\` varchar(36) NOT NULL DEFAULT (UUID()),
	\`assignment_id\` varchar(36) NOT NULL,
	\`student_id\` varchar(36) NOT NULL,
	\`file_url\` text,
	\`submitted_at\` datetime DEFAULT CURRENT_TIMESTAMP,
	\`score\` int,
	\`feedback\` text,
	\`status\` varchar(32) DEFAULT 'pending',
	\`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	\`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT \`assignment_submissions_id\` PRIMARY KEY(\`id\`)
);`,
`CREATE TABLE IF NOT EXISTS \`quizzes\` (
	\`id\` varchar(36) NOT NULL DEFAULT (UUID()),
	\`course_id\` varchar(36) NOT NULL,
	\`module_id\` varchar(64),
	\`lesson_id\` varchar(64),
	\`quiz_type\` varchar(32) NOT NULL DEFAULT 'practice',
	\`title\` varchar(255),
	\`description\` text,
	\`passing_percentage\` int DEFAULT 70,
	\`time_limit_minutes\` int,
	\`attempts_allowed\` int DEFAULT 1,
	\`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	\`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT \`quizzes_id\` PRIMARY KEY(\`id\`)
);`,
`CREATE TABLE IF NOT EXISTS \`quiz_questions\` (
	\`id\` varchar(36) NOT NULL DEFAULT (UUID()),
	\`quiz_id\` varchar(36) NOT NULL,
	\`question_json\` json NOT NULL,
	\`sort_order\` int DEFAULT 1,
	\`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	\`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT \`quiz_questions_id\` PRIMARY KEY(\`id\`)
);`,
`CREATE TABLE IF NOT EXISTS \`quiz_attempts\` (
	\`id\` varchar(36) NOT NULL DEFAULT (UUID()),
	\`quiz_id\` varchar(36) NOT NULL,
	\`student_id\` varchar(36) NOT NULL,
	\`answers_json\` json,
	\`score\` decimal(5,2),
	\`percentage\` decimal(5,2),
	\`passed\` boolean,
	\`started_at\` datetime DEFAULT CURRENT_TIMESTAMP,
	\`completed_at\` datetime,
	\`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	\`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT \`quiz_attempts_id\` PRIMARY KEY(\`id\`)
);`,
`CREATE TABLE IF NOT EXISTS \`course_passing_rules\` (
	\`id\` varchar(36) NOT NULL DEFAULT (UUID()),
	\`course_id\` varchar(36) NOT NULL,
	\`completion_percentage\` int DEFAULT 80,
	\`practice_quiz_required\` boolean DEFAULT false,
	\`module_assessment_required\` boolean DEFAULT true,
	\`module_assessment_pass_score\` int DEFAULT 70,
	\`assignment_required\` boolean DEFAULT false,
	\`assignment_pass_score\` int DEFAULT 60,
	\`final_assessment_required\` boolean DEFAULT false,
	\`certificate_score\` int DEFAULT 75,
	\`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	\`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT \`course_passing_rules_id\` PRIMARY KEY(\`id\`),
	CONSTRAINT \`course_passing_rules_course_id_unique\` UNIQUE(\`course_id\`)
);`,
// Foreign Keys
`ALTER TABLE \`assignment_submissions\` ADD CONSTRAINT \`assignment_submissions_assignment_id_assignments_id_fk\` FOREIGN KEY (\`assignment_id\`) REFERENCES \`assignments\`(\`id\`) ON DELETE cascade ON UPDATE no action;`,
`ALTER TABLE \`assignment_submissions\` ADD CONSTRAINT \`assignment_submissions_student_id_users_id_fk\` FOREIGN KEY (\`student_id\`) REFERENCES \`users\`(\`id\`) ON DELETE cascade ON UPDATE no action;`,
`ALTER TABLE \`assignments\` ADD CONSTRAINT \`assignments_course_id_courses_id_fk\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE cascade ON UPDATE no action;`,
`ALTER TABLE \`course_passing_rules\` ADD CONSTRAINT \`course_passing_rules_course_id_courses_id_fk\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE cascade ON UPDATE no action;`,
`ALTER TABLE \`quiz_attempts\` ADD CONSTRAINT \`quiz_attempts_quiz_id_quizzes_id_fk\` FOREIGN KEY (\`quiz_id\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE cascade ON UPDATE no action;`,
`ALTER TABLE \`quiz_attempts\` ADD CONSTRAINT \`quiz_attempts_student_id_users_id_fk\` FOREIGN KEY (\`student_id\`) REFERENCES \`users\`(\`id\`) ON DELETE cascade ON UPDATE no action;`,
`ALTER TABLE \`quiz_questions\` ADD CONSTRAINT \`quiz_questions_quiz_id_quizzes_id_fk\` FOREIGN KEY (\`quiz_id\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE cascade ON UPDATE no action;`,
`ALTER TABLE \`quizzes\` ADD CONSTRAINT \`quizzes_course_id_courses_id_fk\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE cascade ON UPDATE no action;`
];

async function run() {
  console.log("Creating tables...");
  for (const q of queries) {
    try {
      await db.execute(sql.raw(q));
      console.log("Success");
    } catch (err) {
      console.log("Error running query, might already exist:", err.message);
    }
  }
  console.log("Done.");
  process.exit(0);
}

run();
