CREATE TABLE `assignment_submissions` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`assignment_id` varchar(36) NOT NULL,
	`student_id` varchar(36) NOT NULL,
	`file_url` text,
	`submitted_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`score` int,
	`feedback` text,
	`status` varchar(32) DEFAULT 'pending',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `assignment_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`course_id` varchar(36) NOT NULL,
	`module_id` varchar(64),
	`lesson_id` varchar(64),
	`title` varchar(255),
	`description` text,
	`total_marks` int,
	`passing_marks` int,
	`submission_days` int DEFAULT 7,
	`allow_late_submission` boolean DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certifications` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`user_id` varchar(36) NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`enrollment_id` varchar(36),
	`status` varchar(32) NOT NULL DEFAULT 'PENDING',
	`overall_score` double NOT NULL DEFAULT 0,
	`completion_percentage` double NOT NULL DEFAULT 0,
	`task_progress` json DEFAULT (JSON_OBJECT(
    'totalTasks', 0,
    'completedTasks', 0,
    'completionPercentage', 0,
    'validated', FALSE,
    'manualNotes', NULL,
    'validatedAt', NULL,
    'validatedBy', NULL
  )),
	`validated` boolean NOT NULL DEFAULT false,
	`reviewer_notes` text,
	`certificate_url` text,
	`issued_at` datetime,
	`expires_at` datetime,
	`issued_by` varchar(191),
	`reviewed_by` varchar(191),
	`reviewed_at` datetime,
	`metadata` json DEFAULT (JSON_OBJECT()),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `certifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`code` varchar(64) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`type` varchar(32) NOT NULL,
	`value` int NOT NULL,
	`min_order_amount` int NOT NULL DEFAULT 0,
	`max_discount_amount` int,
	`usage_limit` int,
	`used_count` int NOT NULL DEFAULT 0,
	`usage_limit_per_user` int NOT NULL DEFAULT 1,
	`valid_from` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`valid_until` datetime,
	`is_active` boolean NOT NULL DEFAULT true,
	`applicable_courses` json DEFAULT (JSON_ARRAY()),
	`applicable_categories` json DEFAULT (JSON_ARRAY()),
	`created_by` varchar(36),
	`total_discount_given` int NOT NULL DEFAULT 0,
	`total_orders` int NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `course_passing_rules` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`course_id` varchar(36) NOT NULL,
	`completion_percentage` int DEFAULT 80,
	`practice_quiz_required` boolean DEFAULT false,
	`module_assessment_required` boolean DEFAULT true,
	`module_assessment_pass_score` int DEFAULT 70,
	`assignment_required` boolean DEFAULT false,
	`assignment_pass_score` int DEFAULT 60,
	`final_assessment_required` boolean DEFAULT false,
	`certificate_score` int DEFAULT 75,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `course_passing_rules_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_passing_rules_course_id_unique` UNIQUE(`course_id`)
);
--> statement-breakpoint
CREATE TABLE `course_reviews` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`course_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`rating` int NOT NULL,
	`review` text,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `course_reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_course_review_unq` UNIQUE(`user_id`,`course_id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`title` varchar(255) NOT NULL,
	`description` text,
	`short_description` text,
	`instructor` varchar(191),
	`instructor_bio` text,
	`thumbnail` text,
	`banner_image` text,
	`preview_video` text,
	`price` int NOT NULL,
	`original_price` int,
	`currency` varchar(16) NOT NULL DEFAULT 'INR',
	`duration` double,
	`difficulty` varchar(64) NOT NULL DEFAULT 'beginner',
	`language` varchar(64) NOT NULL DEFAULT 'English',
	`category` varchar(191),
	`modules` json DEFAULT (JSON_ARRAY()),
	`requirements` json DEFAULT (JSON_ARRAY()),
	`what_you_learn` json DEFAULT (JSON_ARRAY()),
	`content_access_url` text,
	`content_description` text,
	`total_enrollments` int NOT NULL DEFAULT 0,
	`average_rating` double NOT NULL DEFAULT 0,
	`total_ratings` int NOT NULL DEFAULT 0,
	`is_published` boolean NOT NULL DEFAULT false,
	`is_featured` boolean NOT NULL DEFAULT false,
	`is_bestseller` boolean NOT NULL DEFAULT false,
	`status` varchar(64) NOT NULL DEFAULT 'draft',
	`content_type` varchar(32) NOT NULL DEFAULT 'modules',
	`tags` json DEFAULT (JSON_ARRAY()),
	`meta_description` text,
	`slug` varchar(255),
	`published_at` datetime,
	`created_by` varchar(36),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`user_id` varchar(36) NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`course_title` varchar(255),
	`status` varchar(64) NOT NULL DEFAULT 'PENDING',
	`enrolled_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`completed_at` datetime,
	`payment_id` varchar(191),
	`amount` int,
	`currency` varchar(16),
	`coupon_code` varchar(64),
	`coupon_discount` int NOT NULL DEFAULT 0,
	`billing_info` json,
	`progress` json DEFAULT (JSON_OBJECT(
      'modulesCompleted', 0,
      'totalModules', 0,
      'completionPercentage', 0,
  'lastAccessedAt', DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-%dT%H:%i:%sZ'),
      'timeSpent', 0
    )),
	`module_progress` json DEFAULT (JSON_ARRAY()),
	`task_progress` json DEFAULT (JSON_OBJECT(
    'totalTasks', 0,
    'completedTasks', 0,
    'completionPercentage', 0,
    'validated', FALSE,
    'manualNotes', NULL,
    'validatedAt', NULL,
    'validatedBy', NULL
  )),
	`certificate_issued` boolean NOT NULL DEFAULT false,
	`certificate_downloadable` boolean NOT NULL DEFAULT false,
	`certificate_url` text,
	`certificate_issued_at` datetime,
	`certificate_unlocked_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_logs` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`payment_id` varchar(191) NOT NULL,
	`event` varchar(64) NOT NULL,
	`payload` json,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `payment_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`payment_id` varchar(191) NOT NULL,
	`order_id` varchar(191),
	`enrollment_id` varchar(36),
	`user_id` varchar(36) NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`course_title` varchar(255),
	`amount` int NOT NULL,
	`currency` varchar(16) NOT NULL DEFAULT 'INR',
	`status` varchar(64) NOT NULL DEFAULT 'created',
	`razorpay_data` json,
	`coupon_code` varchar(64),
	`coupon_discount` int NOT NULL DEFAULT 0,
	`pricing` json,
	`captured_at` datetime,
	`refunded_at` datetime,
	`refund` json,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_payment_id_unique` UNIQUE(`payment_id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`quiz_id` varchar(36) NOT NULL,
	`student_id` varchar(36) NOT NULL,
	`answers_json` json,
	`score` decimal(5,2),
	`percentage` decimal(5,2),
	`passed` boolean,
	`started_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`completed_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_questions` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`quiz_id` varchar(36) NOT NULL,
	`question_json` json NOT NULL,
	`sort_order` int DEFAULT 1,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`course_id` varchar(36) NOT NULL,
	`module_id` varchar(64),
	`lesson_id` varchar(64),
	`quiz_type` varchar(32) NOT NULL DEFAULT 'practice',
	`title` varchar(255),
	`description` text,
	`passing_percentage` int DEFAULT 70,
	`time_limit_minutes` int,
	`attempts_allowed` int DEFAULT 1,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `quizzes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`email` varchar(191) NOT NULL,
	`password` text,
	`password_reset_token` varchar(191),
	`password_reset_expires` datetime,
	`google_id` varchar(64),
	`auth_provider` varchar(32) NOT NULL DEFAULT 'password',
	`username` varchar(191),
	`photo_url` text,
	`first_name` varchar(191),
	`last_name` varchar(191),
	`phone` varchar(32),
	`college` varchar(191),
	`gender` varchar(32),
	`date_of_birth` datetime,
	`skills` json DEFAULT (JSON_ARRAY()),
	`interests` json DEFAULT (JSON_ARRAY()),
	`is_admin` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`email_verified` boolean NOT NULL DEFAULT false,
	`notifications` json DEFAULT (JSON_OBJECT('email', TRUE, 'sms', FALSE, 'push', FALSE)),
	`total_courses_enrolled` int NOT NULL DEFAULT 0,
	`total_courses_completed` int NOT NULL DEFAULT 0,
	`learning_streak` int NOT NULL DEFAULT 0,
	`last_login_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_google_id_unique` UNIQUE(`google_id`)
);
--> statement-breakpoint
ALTER TABLE `assignment_submissions` ADD CONSTRAINT `assignment_submissions_assignment_id_assignments_id_fk` FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assignment_submissions` ADD CONSTRAINT `assignment_submissions_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certifications` ADD CONSTRAINT `certifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certifications` ADD CONSTRAINT `certifications_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certifications` ADD CONSTRAINT `certifications_enrollment_id_enrollments_id_fk` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `coupons` ADD CONSTRAINT `coupons_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_passing_rules` ADD CONSTRAINT `course_passing_rules_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_reviews` ADD CONSTRAINT `course_reviews_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_reviews` ADD CONSTRAINT `course_reviews_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_enrollment_id_enrollments_id_fk` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `quiz_attempts_quiz_id_quizzes_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `quiz_attempts_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_quiz_id_quizzes_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quizzes` ADD CONSTRAINT `quizzes_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;