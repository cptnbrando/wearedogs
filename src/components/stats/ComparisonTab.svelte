<script>
  import { Scale, HelpCircle, Info } from "lucide-svelte";

  let { enrichedCountryStats = {} } = $props();

  let compareMode = $state("rate");
  let compareA = $state("us");
  let compareB = $state("ca");
  let compareSearchQuery = $state("");
  let selectedMobileMetric = $state(null);

  const metricDescriptions = {
    lifeExpectancy: {
      label: "Life Expectancy",
      desc: "Average lifespan of a newborn baby, calculated based on health boosts (A/C adoption, vaccines, healthcare) minus the combined mortality penalty.",
    },
    totalMortality: {
      label: "Total CDR (Crude Death Rate)",
      desc: "Aggregated annual deaths from all tracked causes per 100,000 residents.",
    },
    birth_rate: {
      label: "Births Rate",
      desc: "Estimated annual crude birth rate (CBR) per 1,000 residents.",
    },
    cancer: {
      label: "Cancer Rate",
      desc: "Annual cancer and tumor-related deaths per 100,000 residents.",
    },
    old_age: {
      label: "Old Age & Cardio",
      desc: "Annual deaths from age-related degeneration and cardiovascular failure per 100,000 residents.",
    },
    auto: {
      label: "Auto Accidents",
      desc: "Annual fatalities from motor vehicles, roads, and driving accidents per 100,000 residents.",
    },
    suicide: {
      label: "Suicide Rate",
      desc: "Annual suicide deaths per 100,000 residents, reflecting mental health support index.",
    },
    gun_violence: {
      label: "Gun Violence",
      desc: "Annual homicides and accidental deaths caused by firearms per 100,000 residents.",
    },
    knife_violence: {
      label: "Knife Violence",
      desc: "Annual homicides and assaults involving blade weapons per 100,000 residents.",
    },
    police_brutality: {
      label: "Police Brutality",
      desc: "Fatal incidents involving law enforcement intervention per 100,000 residents.",
    },
    food_poisoning: {
      label: "Food Poisoning",
      desc: "Deaths due to foodborne illnesses, toxic ingestions, and poor sanitization per 100,000 residents.",
    },
    overdose_heroin: {
      label: "Heroin Overdoses",
      desc: "Annual fatal overdoses specifically related to heroin and primary opioids per 100,000 residents.",
    },
    overdose_meth: {
      label: "Meth Overdoses",
      desc: "Annual fatal overdoses related to methamphetamine and amphetamine stimulants per 100,000 residents.",
    },
    overdose_cocaine: {
      label: "Cocaine Overdoses",
      desc: "Annual fatal overdoses related to cocaine and crack derivatives per 100,000 residents.",
    },
    overdose_alcohol: {
      label: "Alcohol Overdoses",
      desc: "Annual fatal incidents directly caused by acute alcohol poisoning and toxicity per 100,000 residents.",
    },
    ac_adoption: {
      label: "A/C Adoption",
      desc: "Percentage of homes equipped with air conditioning, heavily reducing heat-stroke mortality rates.",
    },
    vaccines: {
      label: "Vaccination Rate",
      desc: "Percentage of children receiving primary federal vaccination requirements, preventing infectious outbreaks.",
    },
    gov_healthcare: {
      label: "Gov Healthcare",
      desc: "Quality, funding, and scope of public health mandates and government-provided healthcare, scored out of 100.",
    },
  };

  function calculateTotalMortality(stats) {
    if (!stats) return 0;
    return (
      Math.round(
        (stats.cancer +
          stats.old_age +
          stats.auto +
          stats.suicide +
          stats.gun_violence +
          stats.knife_violence +
          stats.police_brutality +
          stats.food_poisoning +
          stats.overdose_heroin +
          stats.overdose_meth +
          stats.overdose_cocaine +
          stats.overdose_alcohol) *
          10,
      ) / 10
    );
  }

  function calculateLifeExpectancy(stats) {
    if (!stats) return 75;
    const base = 75;
    const acBonus = (stats.ac_adoption / 100) * 3.5;
    const vacBonus = (stats.vaccines / 100) * 4.2;
    const hcBonus = (stats.gov_healthcare / 100) * 5.0;
    const totalMortality = calculateTotalMortality(stats);
    const mortalityPenalty = totalMortality / 75;
    return (
      Math.round(
        (base + acBonus + vacBonus + hcBonus - mortalityPenalty) * 10,
      ) / 10
    );
  }

  function triggerQuickCompare(a, b) {
    compareA = a;
    compareB = b;
  }

  let compareFilteredCountries = $derived.by(() => {
    let list = Object.entries(enrichedCountryStats).map(([code, stats]) => ({
      code,
      ...stats,
      totalMortality: calculateTotalMortality(stats),
      lifeExpectancy: calculateLifeExpectancy(stats),
    }));

    if (compareSearchQuery.trim() !== "") {
      const q = compareSearchQuery.toLowerCase().trim();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }

    return list;
  });

  function formatMetricValue(value, key, population, mode) {
    if (mode === "rate") {
      if (key === "ac_adoption" || key === "vaccines") return `${value}%`;
      if (key === "gov_healthcare") return `${value}/100`;
      if (key === "lifeExpectancy") return `${value} yrs`;
      return typeof value === "number" ? value.toFixed(1) : value;
    }

    // Ratios, percentages, and life expectation values do not scale by population
    if (key === "ac_adoption" || key === "vaccines") return `${value}%`;
    if (key === "gov_healthcare") return `${value}/100`;
    if (key === "lifeExpectancy") return `${value} yrs`;

    const popVal = (population || 10.0) * 1000000;
    let annualCount = 0;

    if (key === "birth_rate") {
      // Birth rate is per 1,000 residents per year
      annualCount = (value / 1000) * popVal;
    } else {
      // Mortality rates are per 100,000 residents per year
      annualCount = (value / 100000) * popVal;
    }

    if (mode === "year") {
      return Math.round(annualCount).toLocaleString();
    }

    if (mode === "second") {
      const perSec = annualCount / (365.25 * 24 * 3600);
      if (perSec >= 0.1) {
        return `${perSec.toFixed(2)}/s`;
      } else {
        const perHour = annualCount / (365.25 * 24);
        if (perHour >= 0.1) {
          return `${perHour.toFixed(1)}/hr`;
        }
        const perDay = annualCount / 365.25;
        return `${perDay.toFixed(1)}/day`;
      }
    }
    return value;
  }
</script>

<div class="tab-pane animated-pane flex flex-col gap-6">
  <!-- Intro comparison section -->
  <div class="comparison-header">
    <h2 class="text-base font-bold text-white uppercase tracking-wider">
      Life & Death Stats
    </h2>
    <p class="text-xs text-white/50 mt-1">
      Compare health metrics, violence coefficients, drug overdoses,
      and calculations that derive final life expectancies between
      nations. Gold highlighted values represent the greater stat
      between the two countries.
    </p>
  </div>

  <!-- Stats Mode Selector -->
  <div
    class="flex items-center justify-between bg-white/[0.02] border border-white/5 p-3 rounded-xl gap-4"
  >
    <span class="text-xs font-bold text-white/50 uppercase tracking-wider pl-1"
      >Display Format</span
    >
    <div class="flex bg-black/40 p-1 border border-white/5 rounded-lg">
      <button
        class="px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer {compareMode === 'rate'
          ? 'bg-white/10 text-white shadow-sm'
          : 'text-white/40 hover:text-white/80'}"
        onclick={() => (compareMode = "rate")}
      >
        Rate (per 100k)
      </button>
      <button
        class="px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer {compareMode === 'year'
          ? 'bg-white/10 text-white shadow-sm'
          : 'text-white/40 hover:text-white/80'}"
        onclick={() => (compareMode = "year")}
      >
        Per Year
      </button>
      <button
        class="px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer {compareMode === 'second'
          ? 'bg-white/10 text-white shadow-sm'
          : 'text-white/40 hover:text-white/80'}"
        onclick={() => (compareMode = "second")}
      >
        Per Second
      </button>
    </div>
  </div>

  <!-- Quick Compare Links -->
  <div class="quick-comparisons bg-white/[0.02] border border-white/5 p-4 rounded-xl">
    <h4 class="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
      Quick Compare Shortcuts
    </h4>
    <div class="flex flex-wrap gap-2.5">
      <button
        class="px-3 py-1.5 bg-black/40 border border-white/5 hover:border-white/25 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
        onclick={() => triggerQuickCompare("ca", "au")}
      >
        🔫 Gun Violence: Canada vs Australia
      </button>
      <button
        class="px-3 py-1.5 bg-black/40 border border-white/5 hover:border-white/25 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
        onclick={() => triggerQuickCompare("mx", "nz")}
      >
        👮 Police Brutality: Mexico vs New Zealand
      </button>
      <button
        class="px-3 py-1.5 bg-black/40 border border-white/5 hover:border-white/25 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
        onclick={() => triggerQuickCompare("us", "jp")}
      >
        💊 Heroin & Overdoses: USA vs Japan
      </button>
      <button
        class="px-3 py-1.5 bg-black/40 border border-white/5 hover:border-white/25 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
        onclick={() => triggerQuickCompare("th", "gb")}
      >
        🚗 Road Safety: Thailand vs UK
      </button>
    </div>
  </div>

  <!-- Side by Side Comparative Widget (Desktop/Tablet) -->
  <div id="comparison-results" class="comparison-grid hidden lg:grid grid-cols-2 gap-6 mt-2">
    <!-- Left selection card -->
    {#if enrichedCountryStats[compareA]}
      {@const statsA = enrichedCountryStats[compareA]}
      {@const statsB = enrichedCountryStats[compareB] || statsA}
      {@const lifeA = calculateLifeExpectancy(statsA)}
      {@const lifeB = calculateLifeExpectancy(statsB)}
      {@const deathsA = calculateTotalMortality(statsA)}
      {@const deathsB = calculateTotalMortality(statsB)}

      <div class="compare-card p-5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-4 relative">
        <div class="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 class="text-sm font-bold text-white/40 uppercase tracking-wider">
            Country A
          </h3>
          <select
            bind:value={compareA}
            class="bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
          >
            {#each Object.entries(enrichedCountryStats) as [code, data]}
              <option value={code}>{data.name}</option>
            {/each}
          </select>
        </div>

        <div class="stats-overview flex justify-between items-center bg-black/30 p-4 rounded-lg">
          <div class="flex flex-col">
            <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Life Expectancy</span>
            <span class="text-xl font-bold font-mono" class:highlighted-stat-green={lifeA > lifeB}>
              {lifeA} years
            </span>
          </div>
          <div class="flex flex-col text-right">
            <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">
              Total Deaths ({compareMode === "rate" ? "per 100k" : compareMode === "year" ? "per year" : "per second"})
            </span>
            <span class="text-xl font-bold font-mono" class:highlighted-stat-red={deathsA > deathsB}>
              {formatMetricValue(deathsA, "totalMortality", statsA.population, compareMode)}
            </span>
          </div>
        </div>

        <div class="metrics-list flex flex-col gap-2.5 text-xs text-white/70">
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Births</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsA.birth_rate > statsB.birth_rate}>
              {formatMetricValue(statsA.birth_rate, "birth_rate", statsA.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Cancer Rate</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsA.cancer > statsB.cancer}>
              {formatMetricValue(statsA.cancer, "cancer", statsA.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Old Age / Cardiovascular</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsA.old_age > statsB.old_age}>
              {formatMetricValue(statsA.old_age, "old_age", statsA.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Automobile Accidents</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsA.auto > statsB.auto}>
              {formatMetricValue(statsA.auto, "auto", statsA.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Suicide Rate</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsA.suicide > statsB.suicide}>
              {formatMetricValue(statsA.suicide, "suicide", statsA.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Gun Violence</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsA.gun_violence > statsB.gun_violence}>
              {formatMetricValue(statsA.gun_violence, "gun_violence", statsA.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Knife Violence</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsA.knife_violence > statsB.knife_violence}>
              {formatMetricValue(statsA.knife_violence, "knife_violence", statsA.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Police Brutality</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsA.police_brutality > statsB.police_brutality}>
              {formatMetricValue(statsA.police_brutality, "police_brutality", statsA.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Food Poisoning</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsA.food_poisoning > statsB.food_poisoning}>
              {formatMetricValue(statsA.food_poisoning, "food_poisoning", statsA.population, compareMode)}
            </span>
          </div>

          <div class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5">
            <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">
              Drug Overdoses Detail ({compareMode === "rate" ? "per 100k" : compareMode === "year" ? "per year" : "per second"})
            </span>
            <div class="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span class="text-white/40 mr-1">Heroin:</span>
                <strong class="font-mono" class:highlighted-stat={statsA.overdose_heroin > statsB.overdose_heroin}>
                  {formatMetricValue(statsA.overdose_heroin, "overdose_heroin", statsA.population, compareMode)}
                </strong>
              </div>
              <div>
                <span class="text-white/40 mr-1">Meth:</span>
                <strong class="font-mono" class:highlighted-stat={statsA.overdose_meth > statsB.overdose_meth}>
                  {formatMetricValue(statsA.overdose_meth, "overdose_meth", statsA.population, compareMode)}
                </strong>
              </div>
              <div>
                <span class="text-white/40 mr-1">Cocaine:</span>
                <strong class="font-mono" class:highlighted-stat={statsA.overdose_cocaine > statsB.overdose_cocaine}>
                  {formatMetricValue(statsA.overdose_cocaine, "overdose_cocaine", statsA.population, compareMode)}
                </strong>
              </div>
              <div>
                <span class="text-white/40 mr-1">Alcohol:</span>
                <strong class="font-mono" class:highlighted-stat={statsA.overdose_alcohol > statsB.overdose_alcohol}>
                  {formatMetricValue(statsA.overdose_alcohol, "overdose_alcohol", statsA.population, compareMode)}
                </strong>
              </div>
            </div>
          </div>

          <div class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5">
            <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Life Expectancy Drivers</span>
            <div class="grid grid-cols-3 gap-2 text-[10px] text-center">
              <div class="bg-black/30 p-1.5 rounded">
                <span class="block text-white/30">A/C Adoption</span>
                <strong class="font-mono" class:highlighted-stat={statsA.ac_adoption > statsB.ac_adoption}>
                  {statsA.ac_adoption}%
                </strong>
              </div>
              <div class="bg-black/30 p-1.5 rounded">
                <span class="block text-white/30">Vaccination</span>
                <strong class="font-mono" class:highlighted-stat={statsA.vaccines > statsB.vaccines}>
                  {statsA.vaccines}%
                </strong>
              </div>
              <div class="bg-black/30 p-1.5 rounded">
                <span class="block text-white/30">Gov Healthcare</span>
                <strong class="font-mono" class:highlighted-stat={statsA.gov_healthcare > statsB.gov_healthcare}>
                  {statsA.gov_healthcare}/100
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Right selection card -->
    {#if enrichedCountryStats[compareB]}
      {@const statsB = enrichedCountryStats[compareB]}
      {@const statsA = enrichedCountryStats[compareA] || statsB}
      {@const lifeB = calculateLifeExpectancy(statsB)}
      {@const lifeA = calculateLifeExpectancy(statsA)}
      {@const deathsB = calculateTotalMortality(statsB)}
      {@const deathsA = calculateTotalMortality(statsA)}

      <div class="compare-card p-5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-4 relative">
        <div class="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 class="text-sm font-bold text-white/40 uppercase tracking-wider">
            Country B
          </h3>
          <select
            bind:value={compareB}
            class="bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
          >
            {#each Object.entries(enrichedCountryStats) as [code, data]}
              <option value={code}>{data.name}</option>
            {/each}
          </select>
        </div>

        <div class="stats-overview flex justify-between items-center bg-black/30 p-4 rounded-lg">
          <div class="flex flex-col">
            <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Life Expectancy</span>
            <span class="text-xl font-bold font-mono" class:highlighted-stat-green={lifeB > lifeA}>
              {lifeB} years
            </span>
          </div>
          <div class="flex flex-col text-right">
            <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">
              Total Deaths ({compareMode === "rate" ? "per 100k" : compareMode === "year" ? "per year" : "per second"})
            </span>
            <span class="text-xl font-bold font-mono" class:highlighted-stat-red={deathsB > deathsA}>
              {formatMetricValue(deathsB, "totalMortality", statsB.population, compareMode)}
            </span>
          </div>
        </div>

        <div class="metrics-list flex flex-col gap-2.5 text-xs text-white/70">
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Births</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsB.birth_rate > statsA.birth_rate}>
              {formatMetricValue(statsB.birth_rate, "birth_rate", statsB.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Cancer Rate</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsB.cancer > statsA.cancer}>
              {formatMetricValue(statsB.cancer, "cancer", statsB.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Old Age / Cardiovascular</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsB.old_age > statsA.old_age}>
              {formatMetricValue(statsB.old_age, "old_age", statsB.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Automobile Accidents</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsB.auto > statsA.auto}>
              {formatMetricValue(statsB.auto, "auto", statsB.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Suicide Rate</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsB.suicide > statsA.suicide}>
              {formatMetricValue(statsB.suicide, "suicide", statsB.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Gun Violence</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsB.gun_violence > statsA.gun_violence}>
              {formatMetricValue(statsB.gun_violence, "gun_violence", statsB.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Knife Violence</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsB.knife_violence > statsA.knife_violence}>
              {formatMetricValue(statsB.knife_violence, "knife_violence", statsB.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Police Brutality</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsB.police_brutality > statsA.police_brutality}>
              {formatMetricValue(statsB.police_brutality, "police_brutality", statsB.population, compareMode)}
            </span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/[0.02]">
            <span class="text-white/40">Food Poisoning</span>
            <span class="font-mono font-medium" class:highlighted-stat={statsB.food_poisoning > statsA.food_poisoning}>
              {formatMetricValue(statsB.food_poisoning, "food_poisoning", statsB.population, compareMode)}
            </span>
          </div>

          <div class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5">
            <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">
              Drug Overdoses Detail ({compareMode === "rate" ? "per 100k" : compareMode === "year" ? "per year" : "per second"})
            </span>
            <div class="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span class="text-white/40 mr-1">Heroin:</span>
                <strong class="font-mono" class:highlighted-stat={statsB.overdose_heroin > statsA.overdose_heroin}>
                  {formatMetricValue(statsB.overdose_heroin, "overdose_heroin", statsB.population, compareMode)}
                </strong>
              </div>
              <div>
                <span class="text-white/40 mr-1">Meth:</span>
                <strong class="font-mono" class:highlighted-stat={statsB.overdose_meth > statsA.overdose_meth}>
                  {formatMetricValue(statsB.overdose_meth, "overdose_meth", statsB.population, compareMode)}
                </strong>
              </div>
              <div>
                <span class="text-white/40 mr-1">Cocaine:</span>
                <strong class="font-mono" class:highlighted-stat={statsB.overdose_cocaine > statsA.overdose_cocaine}>
                  {formatMetricValue(statsB.overdose_cocaine, "overdose_cocaine", statsB.population, compareMode)}
                </strong>
              </div>
              <div>
                <span class="text-white/40 mr-1">Alcohol:</span>
                <strong class="font-mono" class:highlighted-stat={statsB.overdose_alcohol > statsA.overdose_alcohol}>
                  {formatMetricValue(statsB.overdose_alcohol, "overdose_alcohol", statsB.population, compareMode)}
                </strong>
              </div>
            </div>
          </div>

          <div class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5">
            <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Life Expectancy Drivers</span>
            <div class="grid grid-cols-3 gap-2 text-[10px] text-center">
              <div class="bg-black/30 p-1.5 rounded">
                <span class="block text-white/30">A/C Adoption</span>
                <strong class="font-mono" class:highlighted-stat={statsB.ac_adoption > statsA.ac_adoption}>
                  {statsB.ac_adoption}%
                </strong>
              </div>
              <div class="bg-black/30 p-1.5 rounded">
                <span class="block text-white/30">Vaccination</span>
                <strong class="font-mono" class:highlighted-stat={statsB.vaccines > statsA.vaccines}>
                  {statsB.vaccines}%
                </strong>
              </div>
              <div class="bg-black/30 p-1.5 rounded">
                <span class="block text-white/30">Gov Healthcare</span>
                <strong class="font-mono" class:highlighted-stat={statsB.gov_healthcare > statsA.gov_healthcare}>
                  {statsB.gov_healthcare}/100
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Mobile-Optimized Unified Comparison Table (Visible on mobile viewports) -->
  {#if enrichedCountryStats[compareA]}
    {@const statsA = enrichedCountryStats[compareA]}
    {@const statsB = enrichedCountryStats[compareB] || statsA}
    {@const lifeA = calculateLifeExpectancy(statsA)}
    {@const lifeB = calculateLifeExpectancy(statsB)}
    {@const deathsA = calculateTotalMortality(statsA)}
    {@const deathsB = calculateTotalMortality(statsB)}

    <div class="comparison-mobile-container block lg:hidden w-full mt-2 bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
      <!-- Mobile Select Row -->
      <div class="flex items-center justify-between border-b border-white/5 pb-4 mb-2 gap-4">
        <div class="flex-1 flex flex-col gap-1">
          <span class="text-[9px] font-bold text-white/30 tracking-widest uppercase">Country A</span>
          <select
            bind:value={compareA}
            class="w-full bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
          >
            {#each Object.entries(enrichedCountryStats) as [code, data]}
              <option value={code}>{data.name}</option>
            {/each}
          </select>
        </div>

        <div class="flex-none text-center font-bold text-white/30 text-xs self-end pb-2">
          VS
        </div>

        <div class="flex-1 flex flex-col gap-1 text-right">
          <span class="text-[9px] font-bold text-white/30 tracking-widest uppercase">Country B</span>
          <select
            bind:value={compareB}
            class="w-full bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
          >
            {#each Object.entries(enrichedCountryStats) as [code, data]}
              <option value={code}>{data.name}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Unified Table Rows -->
      <div class="flex flex-col">
        <!-- Row 1: Life Expectancy -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="grid grid-cols-[1fr_auto_1fr] items-center py-3 border-b border-white/5 hover:bg-white/[0.02] rounded-lg transition-all cursor-pointer {selectedMobileMetric === 'lifeExpectancy' ? 'bg-white/[0.03]' : ''}"
          onclick={() => (selectedMobileMetric = selectedMobileMetric === "lifeExpectancy" ? null : "lifeExpectancy")}
        >
          <div class="text-left font-mono text-sm font-bold pl-3" class:highlighted-stat-green={lifeA > lifeB}>
            {formatMetricValue(lifeA, "lifeExpectancy", statsA.population, compareMode)}
          </div>
          <div class="flex flex-col items-center justify-center min-w-[120px] px-2 text-center">
            <span class="text-sm mb-0.5">❤️</span>
            <span class="text-[9px] uppercase tracking-wider text-white/40 font-extrabold">Life Expectancy</span>
          </div>
          <div class="text-right font-mono text-sm font-bold pr-3" class:highlighted-stat-green={lifeB > lifeA}>
            {formatMetricValue(lifeB, "lifeExpectancy", statsB.population, compareMode)}
          </div>
        </div>

        <!-- Row 1.5: Births -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="grid grid-cols-[1fr_auto_1fr] items-center py-3 border-b border-white/5 hover:bg-white/[0.02] rounded-lg transition-all cursor-pointer {selectedMobileMetric === 'birth_rate' ? 'bg-white/[0.03]' : ''}"
          onclick={() => (selectedMobileMetric = selectedMobileMetric === "birth_rate" ? null : "birth_rate")}
        >
          <div class="text-left font-mono text-sm font-bold pl-3" class:highlighted-stat={statsA.birth_rate > statsB.birth_rate}>
            {formatMetricValue(statsA.birth_rate, "birth_rate", statsA.population, compareMode)}
          </div>
          <div class="flex flex-col items-center justify-center min-w-[120px] px-2 text-center">
            <span class="text-sm mb-0.5">🤰</span>
            <span class="text-[9px] uppercase tracking-wider text-white/40 font-extrabold">Births</span>
          </div>
          <div class="text-right font-mono text-sm font-bold pr-3" class:highlighted-stat={statsB.birth_rate > statsA.birth_rate}>
            {formatMetricValue(statsB.birth_rate, "birth_rate", statsB.population, compareMode)}
          </div>
        </div>

        <!-- Row 2: Total Deaths -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="grid grid-cols-[1fr_auto_1fr] items-center py-3 border-b border-white/5 hover:bg-white/[0.02] rounded-lg transition-all cursor-pointer {selectedMobileMetric === 'totalMortality' ? 'bg-white/[0.03]' : ''}"
          onclick={() => (selectedMobileMetric = selectedMobileMetric === "totalMortality" ? null : "totalMortality")}
        >
          <div class="text-left font-mono text-sm font-bold pl-3" class:highlighted-stat-red={deathsA > deathsB}>
            {formatMetricValue(deathsA, "totalMortality", statsA.population, compareMode)}
          </div>
          <div class="flex flex-col items-center justify-center min-w-[120px] px-2 text-center">
            <span class="text-sm mb-0.5">⚰️</span>
            <span class="text-[9px] uppercase tracking-wider text-white/40 font-extrabold">Total Deaths</span>
          </div>
          <div class="text-right font-mono text-sm font-bold pr-3" class:highlighted-stat-red={deathsB > deathsA}>
            {formatMetricValue(deathsB, "totalMortality", statsB.population, compareMode)}
          </div>
        </div>

        <!-- Loop through rest of metrics -->
        {#each [
          { key: "cancer", icon: "🎗️", label: "Cancer Rate" },
          { key: "old_age", icon: "👵", label: "Old Age" },
          { key: "auto", icon: "🚗", label: "Auto Accidents" },
          { key: "suicide", icon: "🧠", label: "Suicide Rate" },
          { key: "gun_violence", icon: "🔫", label: "Gun Violence" },
          { key: "knife_violence", icon: "🔪", label: "Knife Violence" },
          { key: "police_brutality", icon: "👮", label: "Police Brutality" },
          { key: "food_poisoning", icon: "🤢", label: "Food Poisoning" },
          { key: "overdose_heroin", icon: "💉", label: "Heroin OD" },
          { key: "overdose_meth", icon: "💎", label: "Meth OD" },
          { key: "overdose_cocaine", icon: "❄️", label: "Cocaine OD" },
          { key: "overdose_alcohol", icon: "🍺", label: "Alcohol OD" },
          { key: "ac_adoption", icon: "💨", label: "A/C Adoption" },
          { key: "vaccines", icon: "🛡️", label: "Vaccination" },
          { key: "gov_healthcare", icon: "🏥", label: "Gov Healthcare" }
        ] as m}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="grid grid-cols-[1fr_auto_1fr] items-center py-3 border-b border-white/5 hover:bg-white/[0.02] rounded-lg transition-all cursor-pointer {selectedMobileMetric === m.key ? 'bg-white/[0.03]' : ''}"
            onclick={() => (selectedMobileMetric = selectedMobileMetric === m.key ? null : m.key)}
          >
            <div class="text-left font-mono text-sm font-semibold pl-3" class:highlighted-stat={statsA[m.key] > statsB[m.key]}>
              {formatMetricValue(statsA[m.key], m.key, statsA.population, compareMode)}
            </div>
            <div class="flex flex-col items-center justify-center min-w-[120px] px-2 text-center">
              <span class="text-sm mb-0.5">{m.icon}</span>
              <span class="text-[9px] uppercase tracking-wider text-white/40 font-extrabold">{m.label}</span>
            </div>
            <div class="text-right font-mono text-sm font-semibold pr-3" class:highlighted-stat={statsB[m.key] > statsA[m.key]}>
              {formatMetricValue(statsB[m.key], m.key, statsB.population, compareMode)}
            </div>
          </div>
        {/each}
      </div>

      <!-- Active Metric Details Block -->
      {#if selectedMobileMetric && metricDescriptions[selectedMobileMetric]}
        <div class="mt-2 p-4 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-1 transition-all duration-300">
          <span class="text-xs font-bold text-white flex items-center gap-2">
            <span>{metricDescriptions[selectedMobileMetric].label}</span>
            <span class="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 uppercase tracking-widest font-mono">Info</span>
          </span>
          <p class="text-[11px] text-white/60 leading-relaxed mt-1">
            {metricDescriptions[selectedMobileMetric].desc}
          </p>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Full index lookup table -->
  <div class="country-search mt-4">
    <div class="flex justify-between items-center gap-4 mb-4">
      <h3 class="text-sm font-bold text-white uppercase tracking-wider">
        Search Country Index
      </h3>
      <input
        type="text"
        placeholder="Filter country table..."
        bind:value={compareSearchQuery}
        class="max-w-[300px] px-3.5 py-1.5 bg-black/40 border border-white/5 rounded-lg text-xs outline-none focus:border-white/20 transition-all"
      />
    </div>
    <div class="table-wrapper border border-white/5 rounded-xl overflow-x-auto bg-black/20 max-h-[350px] scroll-y">
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="bg-[#12121a] border-b border-white/5 sticky top-0 z-10">
            <th class="p-3 pl-4 font-bold text-white/40 uppercase">Country</th>
            <th class="p-3 font-bold text-white/40 uppercase text-center">Life Expectancy</th>
            <th class="p-3 font-bold text-white/40 uppercase text-center">Total CDR</th>
            <th class="p-3 font-bold text-white/40 uppercase text-center">Heroin</th>
            <th class="p-3 font-bold text-white/40 uppercase text-center">Meth</th>
            <th class="p-3 font-bold text-white/40 uppercase text-center">Cocaine</th>
            <th class="p-3 font-bold text-white/40 uppercase text-center">Alcohol</th>
            <th class="p-3 font-bold text-white/40 uppercase text-center">Auto</th>
            <th class="p-3 font-bold text-white/40 uppercase text-center">Gun</th>
            <th class="p-3 font-bold text-white/40 uppercase text-center">Police</th>
            <th class="p-3 font-bold text-white/40 uppercase text-center">A/C (%)</th>
          </tr>
        </thead>
        <tbody>
          {#each compareFilteredCountries as c}
            <tr class="border-b border-white/[0.02] hover:bg-white/[0.02] transition-all">
              <td class="p-3 pl-4 font-semibold text-white/90">{c.name}</td>
              <td class="p-3 text-center text-green-400 font-mono font-semibold">
                {formatMetricValue(c.lifeExpectancy, "lifeExpectancy", c.population, compareMode)}
              </td>
              <td class="p-3 text-center text-red-400 font-mono">
                {formatMetricValue(c.totalMortality, "totalMortality", c.population, compareMode)}
              </td>
              <td class="p-3 text-center font-mono">
                {formatMetricValue(c.overdose_heroin, "overdose_heroin", c.population, compareMode)}
              </td>
              <td class="p-3 text-center font-mono">
                {formatMetricValue(c.overdose_meth, "overdose_meth", c.population, compareMode)}
              </td>
              <td class="p-3 text-center font-mono">
                {formatMetricValue(c.overdose_cocaine, "overdose_cocaine", c.population, compareMode)}
              </td>
              <td class="p-3 text-center font-mono">
                {formatMetricValue(c.overdose_alcohol, "overdose_alcohol", c.population, compareMode)}
              </td>
              <td class="p-3 text-center font-mono">
                {formatMetricValue(c.auto, "auto", c.population, compareMode)}
              </td>
              <td class="p-3 text-center font-mono">
                {formatMetricValue(c.gun_violence, "gun_violence", c.population, compareMode)}
              </td>
              <td class="p-3 text-center font-mono">
                {formatMetricValue(c.police_brutality, "police_brutality", c.population, compareMode)}
              </td>
              <td class="p-3 text-center font-mono text-green-400/80">
                {formatMetricValue(c.ac_adoption, "ac_adoption", c.population, compareMode)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style lang="scss">
  /* Side-by-side comparative greater statistics highlight */
  .highlighted-stat {
    color: #ffb300 !important; /* Premium Gold/Yellow Highlight */
    font-weight: 700 !important;
    text-shadow: 0 0 8px rgba(255, 179, 0, 0.45);
  }

  .highlighted-stat-green {
    color: #00ff66 !important;
    font-weight: 700 !important;
    text-shadow: 0 0 10px rgba(0, 255, 102, 0.45);
  }

  .highlighted-stat-red {
    color: #ff3344 !important;
    font-weight: 700 !important;
    text-shadow: 0 0 10px rgba(255, 51, 68, 0.45);
  }

  /* Custom table styling to keep header visible and table scrollable */
  .scroll-y {
    overflow-y: auto;
  }
</style>
