<script setup>
const { t } = useLang();

/* One list, rendered once. The section previously carried two full copies
   of this content — one for desktop, one for mobile — kept in sync by hand. */
const chapters = [
  { titleKey: "story.firstMeet", textKey: "story.firstMeetText" },
  { titleKey: "story.fallingInLove", textKey: "story.fallingInLoveText" },
  { titleKey: "story.proposal", textKey: "story.proposalText" },
];
</script>

<template>
  <section id="story" class="story-section">
    <div class="story-inner">
      <p class="k-eyebrow" data-aos="fade-up">{{ t("story.eyebrow") }}</p>
      <h2 class="section-title" data-aos="fade-up" data-aos-delay="60">
        {{ t("story.title") }}
      </h2>

      <div class="chapters">
        <article
          v-for="(chapter, i) in chapters"
          :key="chapter.titleKey"
          class="k-panel chapter"
          data-aos="fade-up"
          :data-aos-delay="80 + i * 90"
        >
          <h3 class="chapter-title">{{ t(chapter.titleKey) }}</h3>
          <p class="chapter-text">{{ t(chapter.textKey) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story-section {
  padding: 64px 20px;
  background: transparent;
}

.story-inner {
  width: min(100%, var(--k-measure));
  margin: 0 auto;
  text-align: center;
}

.section-title {
  margin: 6px 0 34px;
}

.chapters {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chapter {
  padding: 24px 26px;
  text-align: center;
}

.chapter-title {
  font-family: "Cormorant Garamond", "Moul", serif;
  font-weight: 500;
  font-size: clamp(16px, 4vw, 21px);
  line-height: 1.9;
  margin: 0 0 8px;

  background: var(--k-foil);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.chapter-text {
  font-family: "Cormorant Garamond", "Kantumruy Pro", serif;
  font-size: clamp(14px, 3.6vw, 17px);
  line-height: 2.05;
  color: rgba(232, 220, 207, 0.82);
  margin: 0;
}

@media (max-width: 640px) {
  .story-section {
    padding: 44px 18px;
  }
  .section-title {
    margin-bottom: 26px;
  }
  .chapter {
    padding: 20px 20px;
  }
}
</style>
