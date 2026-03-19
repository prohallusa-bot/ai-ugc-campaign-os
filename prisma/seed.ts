import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");

  await prisma.$transaction([
    prisma.performanceMetric.deleteMany(),
    prisma.scheduledPost.deleteMany(),
    prisma.videoJob.deleteMany(),
    prisma.voiceJob.deleteMany(),
    prisma.variation.deleteMany(),
    prisma.variationBatch.deleteMany(),
    prisma.scriptChecklist.deleteMany(),
    prisma.script.deleteMany(),
    prisma.persona.deleteMany(),
    prisma.offer.deleteMany(),
    prisma.account.deleteMany(),
    prisma.weeklyReview.deleteMany(),
    prisma.jobLog.deleteMany(),
    prisma.creativeLibrary.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.workflowRun.deleteMany(),
    prisma.weeklyTarget.deleteMany(),
    prisma.campaignPreset.deleteMany(),
    prisma.promptTemplate.deleteMany(),
    prisma.productionRule.deleteMany(),
    prisma.integration.deleteMany(),
    prisma.platformRule.deleteMany(),
    prisma.costControl.deleteMany(),
    prisma.approvalSettings.deleteMany(),
    prisma.globalSettings.deleteMany(),
    prisma.adapterConfig.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log("Seeding database...");

  // 1. User
  const user = await prisma.user.create({
    data: { name: "Admin User", email: "admin@ugc-os.local", role: "ADMIN" },
  });

  // 2. Offer
  const offer = await prisma.offer.create({
    data: {
      name: "NeuroFocus Pro - Cognitive Enhancement Supplement",
      aov: 67.0,
      ltv: 201.0,
      targetCac: 25.0,
      conversionRate: 0.028,
      contentToClickRatio: 0.035,
      revenueTarget: 150000.0,
    },
  });

  // 3. Persona
  const persona = await prisma.persona.create({
    data: {
      offerId: offer.id,
      name: "Burned-Out Professional",
      demographicJson: {
        ageRange: "28-42",
        gender: "mixed",
        income: "$75k-$150k",
        occupation: "knowledge worker",
        location: "US urban/suburban",
      },
      psychographicJson: {
        identity: "high achiever who feels slipping",
        values: ["productivity", "career growth", "health"],
        mediaConsumption: ["TikTok", "YouTube", "podcasts"],
        purchaseBehavior: "researches then impulse buys on emotional trigger",
      },
      painJson: {
        primary: "Afternoon brain fog destroying productivity",
        secondary: "Forgetting important details in meetings",
        emotional: "Fear of being outperformed by younger colleagues",
        physical: "Fatigue despite 8 hours of sleep",
      },
      failedAlternativesJson: {
        tried: ["coffee (jitters)", "energy drinks (crash)", "meditation apps (no time)", "prescription (side effects)"],
        whyFailed: "All solutions either had side effects or required too much time commitment",
      },
      transformationJson: {
        before: "Struggling through afternoon meetings, reaching for 4th coffee",
        after: "Laser-focused through 6pm, impressing leadership with sharp recall",
        timeframe: "Within 2 weeks of consistent use",
      },
      version: 1,
    },
  });

  // 4. Scripts
  const scriptData = [
    {
      conceptName: "The 3pm Wall",
      hookText: "I used to hit a wall every day at 3pm until I discovered this one thing...",
      painText: "That afternoon fog where you're reading the same email 3 times and still not processing it.",
      mechanismText: "It's not about caffeine. Your brain's acetylcholine levels drop by 40% after lunch. NeuroFocus Pro replenishes them naturally.",
      solutionText: "Two capsules with lunch and you'll feel the difference by day 3.",
      transformationText: "Now I'm the sharpest person in every afternoon meeting. My boss literally asked what changed.",
      ctaText: "Link in bio for 20% off your first order. Your future self will thank you.",
      durationSeconds: 45,
    },
    {
      conceptName: "Meeting Embarrassment",
      hookText: "Have you ever forgotten someone's name RIGHT after they introduced themselves?",
      painText: "It's not just names. It's forgetting action items, losing your train of thought mid-sentence, blanking on numbers you reviewed an hour ago.",
      mechanismText: "Your working memory has a biological limit, but it's way lower than it should be because of chronic neuroinflammation from stress and screen time.",
      solutionText: "NeuroFocus Pro contains 6 clinically-studied nootropics that reduce neuroinflammation and boost working memory capacity.",
      transformationText: "Last week I recalled a specific data point from a report I read 3 days ago. In a boardroom. Without notes. The CFO was impressed.",
      ctaText: "Tap the link below. Risk-free 30-day trial. If your memory doesn't improve, full refund.",
      durationSeconds: 60,
    },
    {
      conceptName: "Outperformed by Juniors",
      hookText: "A 25-year-old just got promoted over me. Here's what I did about it.",
      painText: "When younger colleagues start outperforming you, you question everything. Am I getting old? Is this it?",
      mechanismText: "The truth is your brain peaks at 25 then declines — unless you actively support it. The right stack of nootropics can reverse 10 years of cognitive decline.",
      solutionText: "NeuroFocus Pro is the exact stack. Lions Mane, Bacopa, Alpha-GPC, and 3 more compounds backed by peer-reviewed research.",
      transformationText: "6 weeks in, I'm outworking people half my age. Got the promotion. Got the raise. Got my confidence back.",
      ctaText: "Link in bio. Use code FOCUS for 25% off. This changed my career trajectory.",
      durationSeconds: 55,
    },
  ];

  const scripts = [];
  for (const sd of scriptData) {
    const script = await prisma.script.create({
      data: {
        offerId: offer.id,
        personaId: persona.id,
        ...sd,
        fullScript: `${sd.hookText}\n\n${sd.painText}\n\n${sd.mechanismText}\n\n${sd.solutionText}\n\n${sd.transformationText}\n\n${sd.ctaText}`,
        status: "APPROVED",
      },
    });
    scripts.push(script);
  }

  // 5. Variation Batch
  const batch = await prisma.variationBatch.create({
    data: { scriptId: scripts[0].id, name: "The 3pm Wall - Batch 1", status: "COMPLETE" },
  });

  // 6. Variations
  const variationConfigs = [
    { hookType: "QUESTION" as const, avatarType: "FEMALE_YOUNG" as const, lengthType: "SHORT_15" as const, deliveryRegister: "CASUAL" as const, platform: "TIKTOK" as const, outputFormat: "VIDEO" as const, width: 1080, height: 1920 },
    { hookType: "BOLD_CLAIM" as const, avatarType: "MALE_MIDDLE" as const, lengthType: "MEDIUM_30" as const, deliveryRegister: "AUTHORITATIVE" as const, platform: "TIKTOK" as const, outputFormat: "VIDEO" as const, width: 1080, height: 1920 },
    { hookType: "STORY" as const, avatarType: "FEMALE_MIDDLE" as const, lengthType: "LONG_60" as const, deliveryRegister: "EMOTIONAL" as const, platform: "INSTAGRAM_REELS" as const, outputFormat: "VIDEO" as const, width: 1080, height: 1920 },
    { hookType: "STATISTIC" as const, avatarType: "MALE_YOUNG" as const, lengthType: "SHORT_15" as const, deliveryRegister: "CASUAL" as const, platform: "YOUTUBE_SHORTS" as const, outputFormat: "IMAGE" as const, width: 1080, height: 1920 },
    { hookType: "CONTROVERSY" as const, avatarType: "AI_GENERATED" as const, lengthType: "MEDIUM_30" as const, deliveryRegister: "HUMOROUS" as const, platform: "TIKTOK" as const, outputFormat: "VIDEO" as const, width: 1080, height: 1920 },
    { hookType: "QUESTION" as const, avatarType: "FEMALE_YOUNG" as const, lengthType: "MEDIUM_30" as const, deliveryRegister: "AUTHORITATIVE" as const, platform: "FACEBOOK_REELS" as const, outputFormat: "IMAGE" as const, width: 1080, height: 1350 },
  ];

  const variations = [];
  for (const vc of variationConfigs) {
    const variation = await prisma.variation.create({
      data: { batchId: batch.id, ...vc, status: "RENDER_DONE" },
    });
    variations.push(variation);
  }

  // 7. Voice Jobs + Video Jobs
  const videoJobs = [];
  for (const v of variations) {
    const voiceJob = await prisma.voiceJob.create({
      data: {
        variationId: v.id,
        sourceAudioUrl: `https://mock-storage.local/voice/${v.id}/source.mp3`,
        finalAudioUrl: `https://mock-storage.local/voice/${v.id}/final.mp3`,
        status: "COMPLETE",
      },
    });
    const videoJob = await prisma.videoJob.create({
      data: {
        variationId: v.id,
        voiceJobId: voiceJob.id,
        videoUrl: `https://mock-storage.local/video/${v.id}/output.mp4`,
        status: "COMPLETE",
      },
    });
    videoJobs.push(videoJob);
  }

  // 8. Accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: { platform: "TIKTOK", handle: "@neurofocus.health", tier: "GROWTH", warmthDay: 45, dailyPostTarget: 3, healthStatus: "HEALTHY" },
    }),
    prisma.account.create({
      data: { platform: "INSTAGRAM_REELS", handle: "@neurofocuspro", tier: "SEED", warmthDay: 12, dailyPostTarget: 2, healthStatus: "HEALTHY" },
    }),
    prisma.account.create({
      data: { platform: "YOUTUBE_SHORTS", handle: "@NeuroFocusOfficial", tier: "SEED", warmthDay: 8, dailyPostTarget: 1, healthStatus: "WARNING" },
    }),
  ]);

  // 9. Scheduled Posts + 10. Performance Metrics
  const now = new Date();
  for (let i = 0; i < 10; i++) {
    const videoJob = videoJobs[i % videoJobs.length];
    const account = accounts[i % accounts.length];
    const scheduledTime = new Date(now.getTime() - (10 - i) * 24 * 60 * 60 * 1000);

    const post = await prisma.scheduledPost.create({
      data: {
        videoJobId: videoJob.id,
        accountId: account.id,
        scheduledTime,
        status: "PUBLISHED",
        publishedUrl: `https://${account.platform.toLowerCase().replace("_", "")}.com/v/${1000 + i}`,
      },
    });

    await prisma.performanceMetric.create({
      data: {
        scheduledPostId: post.id,
        views48h: Math.floor(Math.random() * 49000) + 1000,
        views7d: Math.floor(Math.random() * 145000) + 5000,
        watchThrough7d: Math.random() * 0.4 + 0.15,
        saveRate7d: Math.random() * 0.08 + 0.01,
        ctr7d: Math.random() * 0.05 + 0.005,
        clicks: Math.floor(Math.random() * 480) + 20,
        purchases: Math.floor(Math.random() * 29) + 1,
        revenue: Math.random() * 2000 + 50,
      },
    });
  }

  // 11. Integrations
  await Promise.all([
    prisma.integration.create({
      data: { name: "OpenAI GPT-4", provider: "OPENAI", apiKeyEncrypted: "enc_mock_openai_key", baseUrl: "https://api.openai.com/v1", isEnabled: true, status: "CONNECTED", lastTestedAt: now },
    }),
    prisma.integration.create({
      data: { name: "Anthropic Claude", provider: "ANTHROPIC", apiKeyEncrypted: "enc_mock_anthropic_key", baseUrl: "https://api.anthropic.com/v1", isEnabled: true, status: "CONNECTED", lastTestedAt: now },
    }),
    prisma.integration.create({
      data: { name: "ElevenLabs Voice", provider: "ELEVENLABS", apiKeyEncrypted: "enc_mock_elevenlabs_key", baseUrl: "https://api.elevenlabs.io/v1", isEnabled: true, status: "CONNECTED", lastTestedAt: now },
    }),
    prisma.integration.create({
      data: { name: "HeyGen Video", provider: "HEYGEN", apiKeyEncrypted: "enc_mock_heygen_key", baseUrl: "https://api.heygen.com/v2", isEnabled: false, status: "DISCONNECTED" },
    }),
  ]);

  // 12. Prompt Templates
  await Promise.all([
    prisma.promptTemplate.create({
      data: {
        name: "Default Hook Generator",
        category: "HOOK_GENERATION",
        content: "Generate {{count}} unique hooks for the following script concept.\n\nPersona: {{persona}}\nPain Point: {{pain}}\nProduct: {{product}}\n\nEach hook should be under 10 words and use one of these styles: question, bold claim, story opener, statistic, controversy.",
        version: 1,
        isDefault: true,
      },
    }),
    prisma.promptTemplate.create({
      data: {
        name: "Default Script Writer",
        category: "SCRIPT_WRITING",
        content: "Write a UGC-style video script for {{platform}}.\n\nDuration: {{duration}} seconds\nPersona: {{persona}}\nHook: {{hook}}\n\nStructure: Hook > Pain > Mechanism > Solution > Transformation > CTA",
        version: 1,
        isDefault: true,
      },
    }),
    prisma.promptTemplate.create({
      data: {
        name: "Checklist Scorer",
        category: "CHECKLIST_SCORING",
        content: "Score the following UGC script on a scale of 1-100.\n\nCriteria:\n- Hook strength (0-20)\n- Pain resonance (0-20)\n- Mechanism clarity (0-20)\n- CTA effectiveness (0-20)\n- Overall flow (0-20)\n\nScript:\n{{script}}",
        version: 1,
        isDefault: true,
      },
    }),
  ]);

  // 13. Production Rule
  await prisma.productionRule.create({
    data: {
      workspaceId: "default",
      videosPerWeek: 30,
      hookVariantsPerScript: 3,
      avatarVariantsPerHook: 2,
      lengthVariants: 2,
      deliveryVariants: 2,
      accountsActive: 3,
      postsPerAccount: 3,
      approvalRequired: true,
    },
  });

  // 14. Campaign Presets
  await Promise.all([
    prisma.campaignPreset.create({
      data: {
        name: "Aggressive Growth",
        category: "growth",
        settingsJson: { videosPerWeek: 50, postsPerAccount: 5, hookVariants: 5, targetCtr: 0.04 },
      },
    }),
    prisma.campaignPreset.create({
      data: {
        name: "Conservative Test",
        category: "testing",
        settingsJson: { videosPerWeek: 10, postsPerAccount: 1, hookVariants: 2, targetCtr: 0.02 },
      },
    }),
  ]);

  // 15. Weekly Target
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
  weekStart.setHours(0, 0, 0, 0);

  await prisma.weeklyTarget.create({
    data: { weekStart, videoGoal: 30, postGoal: 27, scriptGoal: 10, renderGoal: 24, status: "IN_PROGRESS" },
  });

  // 16. Workflow Run
  await prisma.workflowRun.create({
    data: { name: "Week 12 Production Run", weekStart, status: "RUNNING", videosTarget: 30, videosCompleted: 18 },
  });

  // 17. Global Settings
  await prisma.globalSettings.create({
    data: {
      workspaceId: "default",
      workspaceName: "AI UGC Campaign OS",
      brandName: "NeuroFocus Pro",
      timezone: "UTC",
      currency: "USD",
      defaultVideoGoalPerWeek: 30,
      defaultPostGoalPerAccount: 3,
      defaultTargetCtr: 0.035,
      defaultTargetConversionRate: 0.028,
      defaultTargetCac: 25.0,
      defaultAov: 67.0,
      defaultLtv: 201.0,
      beginnerMode: false,
      advancedMode: true,
    },
  });

  // 18. Approval Settings
  await prisma.approvalSettings.create({
    data: {
      workspaceId: "default",
      personaApproval: false,
      scriptApproval: true,
      hookApproval: false,
      voiceApproval: false,
      videoApproval: true,
      scheduleApproval: false,
      weeklyBriefApproval: false,
      autoApproveLowRisk: true,
      confidenceThreshold: 0.8,
    },
  });

  // 19. Platform Rules
  await Promise.all([
    prisma.platformRule.create({
      data: {
        platform: "TIKTOK",
        defaultAspectRatio: "9:16",
        captionStyle: "bold-bottom",
        maxDailyPosts: 3,
        warmUpRules: { day1to7: 1, day8to14: 2, day15plus: 3, restDayEvery: 7 },
        namingConvention: "tt_{concept}_{hook}_{date}",
        isEnabled: true,
      },
    }),
    prisma.platformRule.create({
      data: {
        platform: "INSTAGRAM_REELS",
        defaultAspectRatio: "9:16",
        captionStyle: "subtitle-center",
        maxDailyPosts: 2,
        warmUpRules: { day1to7: 1, day8to14: 1, day15plus: 2, restDayEvery: 5 },
        namingConvention: "ig_{concept}_{hook}_{date}",
        isEnabled: true,
      },
    }),
    prisma.platformRule.create({
      data: {
        platform: "YOUTUBE_SHORTS",
        defaultAspectRatio: "9:16",
        captionStyle: "default",
        maxDailyPosts: 2,
        warmUpRules: { day1to7: 1, day8to21: 1, day22plus: 2, restDayEvery: 7 },
        namingConvention: "yt_{concept}_{hook}_{date}",
        isEnabled: true,
      },
    }),
    prisma.platformRule.create({
      data: {
        platform: "FACEBOOK_REELS",
        defaultAspectRatio: "9:16",
        captionStyle: "default",
        maxDailyPosts: 2,
        warmUpRules: { day1to7: 1, day8to14: 1, day15plus: 2, restDayEvery: 7 },
        isEnabled: false,
      },
    }),
  ]);

  // 20. Cost Control
  await prisma.costControl.create({
    data: {
      workspaceId: "default",
      dailySpendCap: 50.0,
      weeklySpendCap: 200.0,
      pauseOnThreshold: true,
      warnOnCacBreak: true,
      costPerScript: 0.05,
      costPerVoice: 0.15,
      costPerVideo: 1.5,
      costPerPost: 0.0,
    },
  });

  // 21. Audit Log Entries
  await Promise.all([
    prisma.auditLog.create({ data: { userId: user.id, action: "CREATE", entityType: "Offer", entityId: offer.id, changes: { name: offer.name } } }),
    prisma.auditLog.create({ data: { userId: user.id, action: "CREATE", entityType: "Persona", entityId: persona.id, changes: { name: persona.name } } }),
    prisma.auditLog.create({ data: { userId: user.id, action: "APPROVE", entityType: "Script", entityId: scripts[0].id, changes: { status: { from: "DRAFT", to: "APPROVED" } } } }),
    prisma.auditLog.create({ data: { userId: user.id, action: "APPROVE", entityType: "Script", entityId: scripts[1].id, changes: { status: { from: "DRAFT", to: "APPROVED" } } } }),
    prisma.auditLog.create({ data: { userId: user.id, action: "CONFIG_CHANGE", entityType: "GlobalSettings", entityId: "default", changes: { advancedMode: { from: false, to: true } } } }),
  ]);

  // 22. Creative Library
  await Promise.all([
    prisma.creativeLibrary.create({ data: { name: "3pm Wall Hook", type: "HOOK", content: "I used to hit a wall every day at 3pm...", tags: ["afternoon", "productivity", "relatable"], isWinner: true, performanceScore: 92 } }),
    prisma.creativeLibrary.create({ data: { name: "Name Forgetting Hook", type: "HOOK", content: "Have you ever forgotten someone's name RIGHT after they introduced themselves?", tags: ["memory", "embarrassment", "question"], isWinner: true, performanceScore: 87 } }),
    prisma.creativeLibrary.create({ data: { name: "Youth Competition Hook", type: "HOOK", content: "A 25-year-old just got promoted over me.", tags: ["competition", "age", "career"], isWinner: true, performanceScore: 78 } }),
    prisma.creativeLibrary.create({ data: { name: "Risk-Free CTA", type: "CTA", content: "Risk-free 30-day trial. Full refund if it doesn't work.", tags: ["guarantee", "risk-reversal"], isWinner: false, performanceScore: 65 } }),
    prisma.creativeLibrary.create({ data: { name: "Discount Code CTA", type: "CTA", content: "Use code FOCUS for 25% off. Link in bio.", tags: ["discount", "urgency"], isWinner: false, performanceScore: 72 } }),
    prisma.creativeLibrary.create({ data: { name: "Cognitive Decline Concept", type: "CONCEPT", content: "Brain peaks at 25 then declines. Nootropics can reverse this. Target fear of aging among ambitious professionals.", tags: ["aging", "science", "fear"], isWinner: false } }),
  ]);

  // 23. Adapter Config
  await prisma.adapterConfig.create({
    data: {
      workspaceId: "default",
      aiProvider: "ANTHROPIC",
      fallbackToMock: true,
    },
  });

  // 24. Weekly Review
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  await prisma.weeklyReview.create({
    data: {
      weekStart: lastWeekStart,
      summary: "Strong week with 24/30 videos completed. TikTok outperformed other platforms. Question-style hooks had 2.3x higher watch-through rates. Short-form (15s) videos drove the most engagement on TikTok while medium (30s) performed better on Instagram Reels.",
      topPatternsJson: {
        patterns: [
          { pattern: "Question hooks", metric: "watch_through", improvement: "+130%", platforms: ["TIKTOK"] },
          { pattern: "Female young avatars", metric: "ctr", improvement: "+45%", platforms: ["TIKTOK", "INSTAGRAM_REELS"] },
          { pattern: "15s format on TikTok", metric: "views_48h", improvement: "+80%", platforms: ["TIKTOK"] },
        ],
      },
      weakPatternsJson: {
        patterns: [
          { pattern: "60s videos on TikTok", metric: "watch_through", decline: "-40%", note: "Audience drops off after 30s" },
          { pattern: "Controversy hooks", metric: "save_rate", decline: "-25%", note: "High views but low saves" },
        ],
      },
      nextActionsJson: {
        actions: [
          "Double down on question hooks for TikTok",
          "Test 15s vs 30s on Instagram Reels",
          "Phase out 60s TikTok videos",
          "Create 3 new concepts targeting afternoon productivity",
          "A/B test male vs female avatars on YouTube Shorts",
        ],
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
