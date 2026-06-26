import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CHANGELOG_PATH = path.join(process.cwd(), 'public', 'changelog.json');
const PACKAGE_PATH = path.join(process.cwd(), 'package.json');
const REPO_URL = 'https://github.com/cptnbrando/wearedogs';

// Hardcode base tracking start date to exactly 5 days ago from June 25, 2026 (i.e. June 20, 2026)
const INCEPTION_DATE_MS = new Date('2026-06-20T23:18:50-05:00').getTime();

// Helper to format duration
function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.join(' ') || '0m';
}

function run() {
    console.log('Generating/updating changelog...');

    // 1. Get all commits and their stats from git
    const gitLogOutput = execSync('git log --shortstat --pretty=format:"COMMIT:%H|%ct|%s"', { encoding: 'utf-8' });
    const commitBlocks = gitLogOutput.split('COMMIT:').slice(1);

    const allCommits = [];
    for (const block of commitBlocks) {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length === 0) continue;

        const [hash, timestampStr, ...messageParts] = lines[0].split('|');
        const timestamp = parseInt(timestampStr, 10);
        const message = messageParts.join('|');

        let linesChanged = 0;
        if (lines.length > 1) {
            const statLine = lines[1];
            // e.g. "4 files changed, 5 insertions(+), 6 deletions(-)" or "1 file changed, 6 insertions(+)"
            const insertMatch = statLine.match(/(\d+) insertion/);
            const deleteMatch = statLine.match(/(\d+) deletion/);
            const inserts = insertMatch ? parseInt(insertMatch[1], 10) : 0;
            const deletes = deleteMatch ? parseInt(deleteMatch[1], 10) : 0;
            linesChanged = inserts + deletes;
        }

        allCommits.push({
            hash,
            timestamp,
            message,
            linesChanged,
            url: `${REPO_URL}/commit/${hash}`
        });
    }

    // Sort chronologically (oldest to newest)
    allCommits.sort((a, b) => a.timestamp - b.timestamp);

    if (allCommits.length === 0) {
        console.error('No commits found in git history.');
        return;
    }

    // 2. Read current changelog file
    let data = { metrics: {}, entries: [] };
    if (fs.existsSync(CHANGELOG_PATH)) {
        try {
            data = JSON.parse(fs.readFileSync(CHANGELOG_PATH, 'utf-8'));
            if (!data.entries) data.entries = [];
            if (!data.metrics) data.metrics = {};
        } catch (e) {
            console.error('Error reading existing changelog.json, starting fresh.', e);
        }
    }

    // Get list of existing commit hashes in the changelog
    const existingHashes = new Set();
    data.entries.forEach(entry => {
        if (entry.commits) {
            entry.commits.forEach(c => existingHashes.add(c.hash));
        }
    });

    // Filter to find new (unreleased) commits
    const newCommits = allCommits.filter(c => !existingHashes.has(c.hash));

    // 3. If there are new commits, create a new entry
    if (newCommits.length > 0) {
        console.log(`Found ${newCommits.length} new commits. Adding new entry...`);

        // Read version from package.json
        let version = '1.0.0';
        try {
            const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf-8'));
            version = pkg.version || '1.0.0';
        } catch {}

        // If the latest entry in changelog already has this version, increment the patch version
        if (data.entries.length > 0 && data.entries[0].version === version) {
            const parts = version.split('.').map(Number);
            if (parts.length === 3) {
                parts[2]++;
                version = parts.join('.');
            } else {
                version += '.1';
            }
        }

        // Determine current branch to help name the change
        let branchName = 'Release';
        try {
            branchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
            // clean up branch name, e.g. "swarm/app-changelog" -> "App Changelog"
            if (branchName.startsWith('swarm/')) {
                branchName = branchName.replace('swarm/', '');
            }
            branchName = branchName
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        } catch {}

        const now = new Date();
        const newEntry = {
            version: version,
            name: branchName,
            date: now.toISOString().split('T')[0],
            timestamp: Math.floor(now.getTime() / 1000),
            commits: newCommits.map(c => ({
                hash: c.hash.substring(0, 7),
                message: c.message,
                url: c.url,
                timestamp: c.timestamp,
                linesChanged: c.linesChanged
            })).reverse() // reverse to show newest first inside this version
        };

        // Prepend new entry so that latest appears first
        data.entries.unshift(newEntry);
    } else {
        console.log('No new commits found. Re-calculating metrics...');
    }

    // 4. Calculate metrics over ALL commits
    const firstCommit = allCommits[0];
    const totalCommitsCount = allCommits.length;

    // Calculate intervals (in seconds) between consecutive commits
    let totalDuration = 0;
    let innerDurations = [];
    let linesAlteredSum = 0;

    for (let i = 0; i < allCommits.length; i++) {
        linesAlteredSum += allCommits[i].linesChanged;
        if (i > 0) {
            const diff = allCommits[i].timestamp - allCommits[i - 1].timestamp;
            totalDuration += diff;
            if (diff < 3600) { // less than 60 minutes
                innerDurations.push(diff);
            }
        }
    }

    const avgDurationSeconds = totalCommitsCount > 1 ? totalDuration / (totalCommitsCount - 1) : 0;
    const avgInnerDurationSeconds = innerDurations.length > 0 
        ? innerDurations.reduce((a, b) => a + b, 0) / innerDurations.length 
        : 0;

    const avgLinesAltered = totalCommitsCount > 0 ? (linesAlteredSum / totalCommitsCount) : 0;

    // Format metrics
    data.metrics = {
        inceptionTimestamp: Math.floor(INCEPTION_DATE_MS / 1000),
        firstCommitTimestamp: firstCommit.timestamp,
        grossAverageDurationSeconds: Math.round(avgDurationSeconds),
        averageInnerDurationSeconds: Math.round(avgInnerDurationSeconds),
        averageLinesAltered: Math.round(avgLinesAltered * 100) / 100
    };

    // Ensure the output directory exists
    const dir = path.dirname(CHANGELOG_PATH);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    // Write back to public/changelog.json
    fs.writeFileSync(CHANGELOG_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Changelog successfully written!');
}

run();
