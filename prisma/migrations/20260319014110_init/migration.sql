-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OPERATOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "ScriptStatus" AS ENUM ('DRAFT', 'CHECKLIST_PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('PENDING', 'GENERATING', 'COMPLETE', 'FAILED');

-- CreateEnum
CREATE TYPE "VariationStatus" AS ENUM ('PENDING', 'VOICE_QUEUED', 'VOICE_DONE', 'RENDER_QUEUED', 'RENDER_DONE', 'FAILED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETE', 'FAILED');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "AccountTier" AS ENUM ('SEED', 'GROWTH', 'SCALE');

-- CreateEnum
CREATE TYPE "AccountHealth" AS ENUM ('HEALTHY', 'WARNING', 'RESTRICTED', 'BANNED');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('TIKTOK', 'INSTAGRAM_REELS', 'YOUTUBE_SHORTS', 'FACEBOOK_REELS');

-- CreateEnum
CREATE TYPE "HookType" AS ENUM ('QUESTION', 'BOLD_CLAIM', 'STORY', 'STATISTIC', 'CONTROVERSY');

-- CreateEnum
CREATE TYPE "AvatarType" AS ENUM ('MALE_YOUNG', 'MALE_MIDDLE', 'FEMALE_YOUNG', 'FEMALE_MIDDLE', 'AI_GENERATED');

-- CreateEnum
CREATE TYPE "LengthType" AS ENUM ('SHORT_15', 'MEDIUM_30', 'LONG_60');

-- CreateEnum
CREATE TYPE "DeliveryRegister" AS ENUM ('CASUAL', 'AUTHORITATIVE', 'EMOTIONAL', 'HUMOROUS');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('CONNECTED', 'DISCONNECTED', 'ERROR');

-- CreateEnum
CREATE TYPE "IntegrationProvider" AS ENUM ('OPENAI', 'ANTHROPIC', 'ELEVENLABS', 'HEYGEN', 'SYNTHESIA', 'SUPABASE', 'AWS_S3', 'TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'FACEBOOK');

-- CreateEnum
CREATE TYPE "PromptCategory" AS ENUM ('HOOK_GENERATION', 'SCRIPT_WRITING', 'PERSONA_RESEARCH', 'CHECKLIST_SCORING', 'WEEKLY_REVIEW', 'OPTIMIZATION');

-- CreateEnum
CREATE TYPE "WeeklyTargetStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETE', 'MISSED');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('PLANNED', 'RUNNING', 'PAUSED', 'COMPLETE', 'FAILED');

-- CreateEnum
CREATE TYPE "JobLogType" AS ENUM ('SCRIPT_GENERATION', 'VOICE_SYNTHESIS', 'VIDEO_RENDER', 'SOCIAL_PUBLISH', 'CHECKLIST_SCORE', 'WEEKLY_ANALYSIS');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'RETRY', 'CONFIG_CHANGE');

-- CreateEnum
CREATE TYPE "CreativeType" AS ENUM ('HOOK', 'CTA', 'AVATAR_REF', 'VOICE_SAMPLE', 'CONCEPT', 'SCRIPT_TEMPLATE');

-- CreateEnum
CREATE TYPE "OutputFormat" AS ENUM ('VIDEO', 'IMAGE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerk_id" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OPERATOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aov" DECIMAL(10,2) NOT NULL,
    "ltv" DECIMAL(10,2) NOT NULL,
    "target_cac" DECIMAL(10,2) NOT NULL,
    "conversion_rate" DECIMAL(5,4) NOT NULL,
    "content_to_click_ratio" DECIMAL(5,4) NOT NULL,
    "revenue_target" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personas" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "demographic_json" JSONB NOT NULL,
    "psychographic_json" JSONB NOT NULL,
    "pain_json" JSONB NOT NULL,
    "failed_alternatives_json" JSONB NOT NULL,
    "transformation_json" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scripts" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,
    "concept_name" TEXT NOT NULL,
    "hook_text" TEXT NOT NULL,
    "pain_text" TEXT NOT NULL,
    "mechanism_text" TEXT NOT NULL,
    "solution_text" TEXT NOT NULL,
    "transformation_text" TEXT NOT NULL,
    "cta_text" TEXT NOT NULL,
    "full_script" TEXT NOT NULL,
    "duration_seconds" INTEGER NOT NULL,
    "status" "ScriptStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "script_checklists" (
    "id" TEXT NOT NULL,
    "script_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "script_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variation_batches" (
    "id" TEXT NOT NULL,
    "script_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variation_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variations" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "hook_type" "HookType" NOT NULL,
    "avatar_type" "AvatarType" NOT NULL,
    "length_type" "LengthType" NOT NULL,
    "delivery_register" "DeliveryRegister" NOT NULL,
    "platform" "Platform" NOT NULL,
    "output_format" "OutputFormat" NOT NULL DEFAULT 'VIDEO',
    "width" INTEGER NOT NULL DEFAULT 1080,
    "height" INTEGER NOT NULL DEFAULT 1920,
    "status" "VariationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_jobs" (
    "id" TEXT NOT NULL,
    "variation_id" TEXT NOT NULL,
    "source_audio_url" TEXT,
    "final_audio_url" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_jobs" (
    "id" TEXT NOT NULL,
    "variation_id" TEXT NOT NULL,
    "voice_job_id" TEXT NOT NULL,
    "video_url" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "handle" TEXT NOT NULL,
    "tier" "AccountTier" NOT NULL DEFAULT 'SEED',
    "warmth_day" INTEGER NOT NULL DEFAULT 0,
    "daily_post_target" INTEGER NOT NULL DEFAULT 1,
    "health_status" "AccountHealth" NOT NULL DEFAULT 'HEALTHY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_posts" (
    "id" TEXT NOT NULL,
    "video_job_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "scheduled_time" TIMESTAMP(3) NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'SCHEDULED',
    "published_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_metrics" (
    "id" TEXT NOT NULL,
    "scheduled_post_id" TEXT NOT NULL,
    "views_48h" INTEGER NOT NULL DEFAULT 0,
    "views_7d" INTEGER NOT NULL DEFAULT 0,
    "watch_through_7d" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "save_rate_7d" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "ctr_7d" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "purchases" INTEGER NOT NULL DEFAULT 0,
    "revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_reviews" (
    "id" TEXT NOT NULL,
    "week_start" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "top_patterns_json" JSONB NOT NULL,
    "weak_patterns_json" JSONB NOT NULL,
    "next_actions_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weekly_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" "IntegrationProvider" NOT NULL,
    "api_key_encrypted" TEXT NOT NULL,
    "base_url" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "last_tested_at" TIMESTAMP(3),
    "last_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "PromptCategory" NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_rules" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL DEFAULT 'default',
    "videos_per_week" INTEGER NOT NULL DEFAULT 30,
    "hook_variants_per_script" INTEGER NOT NULL DEFAULT 3,
    "avatar_variants_per_hook" INTEGER NOT NULL DEFAULT 2,
    "length_variants" INTEGER NOT NULL DEFAULT 2,
    "delivery_variants" INTEGER NOT NULL DEFAULT 2,
    "accounts_active" INTEGER NOT NULL DEFAULT 3,
    "posts_per_account" INTEGER NOT NULL DEFAULT 3,
    "approval_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_logs" (
    "id" TEXT NOT NULL,
    "job_type" "JobLogType" NOT NULL,
    "provider" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "error_message" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "cost_estimate" DECIMAL(8,4),

    CONSTRAINT "job_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_presets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "settings_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_presets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_targets" (
    "id" TEXT NOT NULL,
    "week_start" TIMESTAMP(3) NOT NULL,
    "video_goal" INTEGER NOT NULL,
    "post_goal" INTEGER NOT NULL,
    "script_goal" INTEGER NOT NULL,
    "render_goal" INTEGER NOT NULL,
    "status" "WeeklyTargetStatus" NOT NULL DEFAULT 'PLANNED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_runs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "week_start" TIMESTAMP(3) NOT NULL,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'PLANNED',
    "videos_target" INTEGER NOT NULL,
    "videos_completed" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "global_settings" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL DEFAULT 'default',
    "workspace_name" TEXT NOT NULL DEFAULT 'My Workspace',
    "brand_name" TEXT NOT NULL DEFAULT '',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "default_video_goal_per_week" INTEGER NOT NULL DEFAULT 30,
    "default_post_goal_per_account" INTEGER NOT NULL DEFAULT 3,
    "default_target_ctr" DECIMAL(5,4) NOT NULL DEFAULT 0.02,
    "default_target_conversion_rate" DECIMAL(5,4) NOT NULL DEFAULT 0.03,
    "default_target_cac" DECIMAL(10,2) NOT NULL DEFAULT 25.00,
    "default_aov" DECIMAL(10,2) NOT NULL DEFAULT 50.00,
    "default_ltv" DECIMAL(10,2) NOT NULL DEFAULT 150.00,
    "beginner_mode" BOOLEAN NOT NULL DEFAULT true,
    "advanced_mode" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_settings" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL DEFAULT 'default',
    "persona_approval" BOOLEAN NOT NULL DEFAULT false,
    "script_approval" BOOLEAN NOT NULL DEFAULT true,
    "hook_approval" BOOLEAN NOT NULL DEFAULT false,
    "voice_approval" BOOLEAN NOT NULL DEFAULT false,
    "video_approval" BOOLEAN NOT NULL DEFAULT true,
    "schedule_approval" BOOLEAN NOT NULL DEFAULT false,
    "weekly_brief_approval" BOOLEAN NOT NULL DEFAULT false,
    "auto_approve_low_risk" BOOLEAN NOT NULL DEFAULT true,
    "confidence_threshold" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approval_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_rules" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "default_aspect_ratio" TEXT NOT NULL DEFAULT '9:16',
    "caption_style" TEXT NOT NULL DEFAULT 'default',
    "max_daily_posts" INTEGER NOT NULL DEFAULT 3,
    "warm_up_rules" JSONB NOT NULL,
    "naming_convention" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_controls" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL DEFAULT 'default',
    "daily_spend_cap" DECIMAL(10,2),
    "weekly_spend_cap" DECIMAL(10,2),
    "pause_on_threshold" BOOLEAN NOT NULL DEFAULT false,
    "warn_on_cac_break" BOOLEAN NOT NULL DEFAULT true,
    "cost_per_script" DECIMAL(8,4),
    "cost_per_voice" DECIMAL(8,4),
    "cost_per_video" DECIMAL(8,4),
    "cost_per_post" DECIMAL(8,4),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cost_controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" "AuditAction" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "ip_address" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_library" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CreativeType" NOT NULL,
    "content" TEXT NOT NULL,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "is_winner" BOOLEAN NOT NULL DEFAULT false,
    "source_variation_id" TEXT,
    "performance_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creative_library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adapter_configs" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL DEFAULT 'default',
    "ai_provider" "IntegrationProvider",
    "voice_provider" "IntegrationProvider",
    "video_provider" "IntegrationProvider",
    "storage_provider" "IntegrationProvider",
    "social_tiktok_provider" "IntegrationProvider",
    "social_instagram_provider" "IntegrationProvider",
    "social_youtube_provider" "IntegrationProvider",
    "social_facebook_provider" "IntegrationProvider",
    "fallback_to_mock" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adapter_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "scripts_offer_id_idx" ON "scripts"("offer_id");

-- CreateIndex
CREATE INDEX "scripts_persona_id_idx" ON "scripts"("persona_id");

-- CreateIndex
CREATE INDEX "scripts_status_idx" ON "scripts"("status");

-- CreateIndex
CREATE INDEX "variation_batches_script_id_idx" ON "variation_batches"("script_id");

-- CreateIndex
CREATE INDEX "variations_batch_id_idx" ON "variations"("batch_id");

-- CreateIndex
CREATE INDEX "variations_status_idx" ON "variations"("status");

-- CreateIndex
CREATE INDEX "voice_jobs_variation_id_idx" ON "voice_jobs"("variation_id");

-- CreateIndex
CREATE INDEX "video_jobs_variation_id_idx" ON "video_jobs"("variation_id");

-- CreateIndex
CREATE INDEX "video_jobs_voice_job_id_idx" ON "video_jobs"("voice_job_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_platform_handle_key" ON "accounts"("platform", "handle");

-- CreateIndex
CREATE INDEX "scheduled_posts_account_id_idx" ON "scheduled_posts"("account_id");

-- CreateIndex
CREATE INDEX "scheduled_posts_scheduled_time_idx" ON "scheduled_posts"("scheduled_time");

-- CreateIndex
CREATE INDEX "scheduled_posts_status_idx" ON "scheduled_posts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "performance_metrics_scheduled_post_id_key" ON "performance_metrics"("scheduled_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_reviews_week_start_key" ON "weekly_reviews"("week_start");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_provider_key" ON "integrations"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_templates_category_version_key" ON "prompt_templates"("category", "version");

-- CreateIndex
CREATE UNIQUE INDEX "production_rules_workspace_id_key" ON "production_rules"("workspace_id");

-- CreateIndex
CREATE INDEX "job_logs_job_type_idx" ON "job_logs"("job_type");

-- CreateIndex
CREATE INDEX "job_logs_status_idx" ON "job_logs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_targets_week_start_key" ON "weekly_targets"("week_start");

-- CreateIndex
CREATE INDEX "workflow_runs_week_start_idx" ON "workflow_runs"("week_start");

-- CreateIndex
CREATE UNIQUE INDEX "global_settings_workspace_id_key" ON "global_settings"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "approval_settings_workspace_id_key" ON "approval_settings"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "platform_rules_platform_key" ON "platform_rules"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "cost_controls_workspace_id_key" ON "cost_controls"("workspace_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "creative_library_type_is_winner_idx" ON "creative_library"("type", "is_winner");

-- CreateIndex
CREATE UNIQUE INDEX "adapter_configs_workspace_id_key" ON "adapter_configs"("workspace_id");

-- AddForeignKey
ALTER TABLE "personas" ADD CONSTRAINT "personas_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "personas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "script_checklists" ADD CONSTRAINT "script_checklists_script_id_fkey" FOREIGN KEY ("script_id") REFERENCES "scripts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variation_batches" ADD CONSTRAINT "variation_batches_script_id_fkey" FOREIGN KEY ("script_id") REFERENCES "scripts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variations" ADD CONSTRAINT "variations_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "variation_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_jobs" ADD CONSTRAINT "voice_jobs_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_jobs" ADD CONSTRAINT "video_jobs_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_jobs" ADD CONSTRAINT "video_jobs_voice_job_id_fkey" FOREIGN KEY ("voice_job_id") REFERENCES "voice_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_posts" ADD CONSTRAINT "scheduled_posts_video_job_id_fkey" FOREIGN KEY ("video_job_id") REFERENCES "video_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_posts" ADD CONSTRAINT "scheduled_posts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_metrics" ADD CONSTRAINT "performance_metrics_scheduled_post_id_fkey" FOREIGN KEY ("scheduled_post_id") REFERENCES "scheduled_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creative_library" ADD CONSTRAINT "creative_library_source_variation_id_fkey" FOREIGN KEY ("source_variation_id") REFERENCES "variations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
