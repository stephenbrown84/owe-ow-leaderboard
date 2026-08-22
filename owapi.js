/**
 * owapi.js
 * OverFast API client adapter for Overwatch 2 stat retrieval with rate limit handling.
 */

const OVERFAST_API_BASE = 'https://overfast-api.tekrop.fr';

// Hero name mapping from OverFast API keys to legacy StatsEngine keys
const HERO_NAME_MAPPINGS = {
    'cassidy': 'mccree',
    'soldier-76': 'soldier',
    'wrecking-ball': 'hammond'
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch JSON with retry on HTTP 429 (Rate Limit)
 */
async function fetchJson(url, retries = 4, backoffMs = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                headers: { 'User-Agent': 'OverwatchLeaderboard/2.0' }
            });

            if (response.status === 429) {
                console.warn(`[HTTP 429 Rate Limit] Retrying ${url} in ${backoffMs}ms (Attempt ${attempt}/${retries})...`);
                await delay(backoffMs);
                backoffMs *= 1.5;
                continue;
            }

            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`Profile/stats not found (404) at: ${url}`);
                    return null;
                }
                console.warn(`HTTP ${response.status} fetching ${url}`);
                return null;
            }

            return await response.json();
        } catch (err) {
            console.error(`Network error fetching ${url}: ${err.message}`);
            if (attempt < retries) {
                await delay(backoffMs);
            }
        }
    }
    return null;
}

/**
 * Map hero object keys (e.g. cassidy -> mccree)
 */
function normalizeHeroStats(careerStats) {
    if (!careerStats) return {};
    const normalized = {};

    for (const [heroKey, stats] of Object.entries(careerStats)) {
        const mappedKey = HERO_NAME_MAPPINGS[heroKey] || heroKey;
        normalized[mappedKey] = stats;
    }
    return normalized;
}

/**
 * Get all stats for a BattleTag using OverFast API
 * @param {string} battletag e.g. "Nuuga-1351"
 */
async function getAllStats(battletag) {
    const formattedTag = battletag.replace('#', '-');
    console.log(`[OverFast API] Fetching stats for ${formattedTag}...`);

    const summaryUrl = `${OVERFAST_API_BASE}/players/${formattedTag}/summary`;
    const qpUrl = `${OVERFAST_API_BASE}/players/${formattedTag}/stats/career?gamemode=quickplay`;
    const compUrl = `${OVERFAST_API_BASE}/players/${formattedTag}/stats/career?gamemode=competitive`;

    const summary = await fetchJson(summaryUrl);
    await delay(400);
    const qpCareer = await fetchJson(qpUrl);
    await delay(400);
    const compCareer = await fetchJson(compUrl);

    if (!summary && !qpCareer && !compCareer) {
        console.error(`[OverFast API] No data retrieved for ${formattedTag}. Profile may be private or invalid.`);
        return null;
    }

    const qpStats = normalizeHeroStats(qpCareer);
    const compStats = normalizeHeroStats(compCareer);
    const detectedSeason = summary?.competitive?.pc?.season || summary?.competitive?.console?.season || null;

    return {
        battletag: battletag,
        iconURL: summary?.avatar || '',
        namecard: summary?.namecard || '',
        title: summary?.title || '',
        endorsementLevel: summary?.endorsement?.level || 1,
        currentSeason: detectedSeason,
        heroStats: {
            quickplay: qpStats,
            competitive: compStats
        }
    };
}

module.exports = {
    getAllStats
};
