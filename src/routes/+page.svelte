<script lang="ts">
	import { onMount } from 'svelte';
	import { asset } from '$app/paths';
	import { reveal } from '#lib/reveal.js';

	// shortcut: release filenames carry the version, bump on each release; switch to reading latest.json if releases get frequent.
	const VERSION = '1.0.10';
	const REPO = 'https://github.com/yash1200/mystique';
	const REL = `${REPO}/releases/download/v${VERSION}`;

	type Os = 'mac' | 'win' | 'linux';
	let os = $state<Os | null>(null);
	let menuOpen = $state(false);

	onMount(() => {
		const ua = navigator.userAgent;
		if (/iPhone|iPad|Android/i.test(ua)) return;
		os = /Mac/i.test(ua) ? 'mac' : /Win/i.test(ua) ? 'win' : /Linux|X11/i.test(ua) ? 'linux' : null;
	});

	const primary = $derived(
		os === 'mac'
			? { href: `${REL}/Mystique_${VERSION}_aarch64.dmg`, label: 'Download for macOS' }
			: os === 'win'
				? { href: `${REL}/Mystique_${VERSION}_x64-setup.exe`, label: 'Download for Windows' }
				: os === 'linux'
					? { href: '#download', label: 'Download for Linux' }
					: { href: '#download', label: 'Download Mystique' }
	);

	const nav = [
		{ href: '#features', label: 'Features' },
		{ href: '#databases', label: 'Databases' },
		{ href: '#agent', label: 'Agent' },
		{ href: '#download', label: 'Download' }
	];

	const engines = [
		{ abbr: 'Pg', name: 'PostgreSQL', kind: 'SQL' },
		{ abbr: 'Cr', name: 'CockroachDB', kind: 'SQL' },
		{ abbr: 'My', name: 'MySQL', kind: 'SQL' },
		{ abbr: 'Ma', name: 'MariaDB', kind: 'SQL' },
		{ abbr: 'Ti', name: 'TiDB', kind: 'SQL' },
		{ abbr: 'Sq', name: 'SQLite', kind: 'File' },
		{ abbr: 'Mo', name: 'MongoDB', kind: 'Document' },
		{ abbr: 'Dd', name: 'Amazon DocumentDB', kind: 'Document' }
	];

	const platforms: {
		id: Os;
		name: string;
		firstRun: string;
		files: { arch: string; kind: string; file: string }[];
	}[] = [
		{
			id: 'mac',
			name: 'macOS',
			firstRun:
				'Open the .dmg and drag Mystique to Applications. If macOS says it can’t check the app, open System Settings › Privacy & Security and click Open Anyway.',
			files: [
				{ arch: 'Apple silicon', kind: '.dmg', file: `Mystique_${VERSION}_aarch64.dmg` },
				{ arch: 'Intel', kind: '.dmg', file: `Mystique_${VERSION}_x64.dmg` }
			]
		},
		{
			id: 'win',
			name: 'Windows',
			firstRun:
				'Run the installer. If SmartScreen says “Windows protected your PC”, click More info › Run anyway.',
			files: [
				{ arch: 'x64', kind: 'setup.exe', file: `Mystique_${VERSION}_x64-setup.exe` },
				{ arch: 'ARM64', kind: 'setup.exe', file: `Mystique_${VERSION}_arm64-setup.exe` }
			]
		},
		{
			id: 'linux',
			name: 'Linux',
			firstRun: '',
			files: [
				{ arch: 'x64', kind: '.deb', file: `Mystique_${VERSION}_amd64.deb` },
				{ arch: 'x64', kind: '.rpm', file: `Mystique-${VERSION}-1.x86_64.rpm` },
				{ arch: 'x64', kind: '.AppImage', file: `Mystique_${VERSION}_amd64.AppImage` },
				{ arch: 'ARM64', kind: '.deb', file: `Mystique_${VERSION}_arm64.deb` },
				{ arch: 'ARM64', kind: '.rpm', file: `Mystique-${VERSION}-1.aarch64.rpm` },
				{ arch: 'ARM64', kind: '.AppImage', file: `Mystique_${VERSION}_aarch64.AppImage` }
			]
		}
	];
	const [mac, win, linux] = platforms;

	const agents = [
		'Anthropic',
		'OpenAI',
		'Gemini',
		'OpenRouter',
		'Ollama',
		'Claude Code',
		'Codex',
		'Gemini CLI'
	];

	const themes = [
		{ name: 'Night', bg: '#0b0c0e', accent: '#3ecf9b' },
		{ name: 'Abyss', bg: '#080a12', accent: '#9d8cff' },
		{ name: 'Day', bg: '#f5f6f8', accent: '#087f56' },
		{ name: 'Linen', bg: '#f4f0e8', accent: '#c2410c' }
	];

	// Mock data for the feature cards; values mirror what the app shows.
	const sessions = [
		{ abbr: 'Pg', name: 'Main DB', color: '#4fd1c5', prod: true },
		{ abbr: 'Mo', name: 'Notifications', color: '#5ab0f0', prod: false },
		{ abbr: 'My', name: 'Analytics', color: '#f0875a', prod: true },
		{ abbr: 'Sq', name: 'local.db', color: '#a3e36a', prod: false }
	];
	const tabs = [
		{ kind: 'TABLE', name: 'users', color: '#4fd1c5' },
		{ kind: 'SQL', name: 'churn.sql', color: '#4fd1c5' },
		{ kind: 'COLL', name: 'events', color: '#5ab0f0' },
		{ kind: 'ER', name: 'public', color: '#4fd1c5' },
		{ kind: 'METRICS', name: 'Analytics', color: '#f0875a' }
	];

	const gridRows: {
		id: number;
		email: string;
		plan: string;
		settings: string;
		state?: 'edit' | 'del';
	}[] = [
		{ id: 1041, email: 'ada@lovelace.dev', plan: 'team', settings: '{"theme":"day"}' },
		{
			id: 1042,
			email: 'grace@hopper.io',
			plan: 'team',
			settings: '{"theme":"night","digest":true,"seats":12}',
			state: 'edit'
		},
		{ id: 1043, email: 'test@example.com', plan: 'free', settings: '{}', state: 'del' },
		{ id: 1044, email: 'linus@kernel.org', plan: 'pro', settings: '{"theme":"abyss"}' },
		{ id: 1045, email: 'edsger@dijkstra.nl', plan: 'pro', settings: '{"digest":false}' },
		{ id: 1046, email: 'barbara@liskov.mit', plan: 'team', settings: '{"seats":4}' }
	];
	const inspectRow = {
		id: 1042,
		email: 'grace@hopper.io',
		plan: 'team',
		settings: { theme: 'night', digest: true, seats: 12 },
		verified: true,
		created_at: '2026-03-04T09:12:44Z'
	};
	/** Pretty JSON with syntax colours, for {@html} on our own static data. */
	function json(value: unknown) {
		return JSON.stringify(value, null, 2)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(
				/("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?/g,
				(m, str, colon, lit) =>
					str
						? `<span class="${colon ? 'text-[#6fd6c4]' : 'text-jade'}">${str}</span>${colon ?? ''}`
						: `<span class="${lit ? 'text-[#f07aa8]' : 'text-[#f0875a]'}">${m}</span>`
			);
	}

	const erBoxes = [
		{ x: 6, y: 18, w: 106, t: 'users', r: ['id', 'email', 'name'] },
		{ x: 180, y: 70, w: 104, t: 'orders', r: ['id', 'user_id', 'total'] },
		{ x: 6, y: 130, w: 106, t: 'products', r: ['id', 'sku'] },
		{ x: 150, y: 160, w: 120, t: 'order_items', r: ['order_id', 'product_id'] }
	];

	const metrics = [
		{ label: 'Active queries', value: '12', fill: 0 },
		{ label: 'Cache hit', value: '99.2%', fill: 99 },
		{ label: 'Database size', value: '4.8 GB', fill: 0 },
		{ label: 'Committed', value: '1.28M', fill: 0 }
	];
	const backends = [
		{
			pid: 48213,
			user: 'app_rw',
			state: 'active',
			query: "SELECT * FROM orders WHERE status = 'open'",
			time: '2.4 s',
			warn: false
		},
		{
			pid: 48190,
			user: 'etl',
			state: 'idle in transaction',
			query: 'UPDATE inventory SET qty = qty - 1',
			time: '41 s',
			warn: true
		},
		{
			pid: 48177,
			user: 'reporting',
			state: 'active',
			query: 'SELECT date_trunc(week, created_at)',
			time: '812 ms',
			warn: false
		}
	];

	const transferFormats = [
		{ label: 'Import', items: ['CSV', 'JSON', 'JSONL'] },
		{ label: 'Export', items: ['CSV', 'JSON', 'JSONL', 'SQL'] },
		{ label: 'Copy as', items: ['CSV', 'TSV', 'JSON', 'Markdown', 'INSERT', 'UPDATE', 'WHERE'] }
	];
	const transfers = [
		{ dir: 'IN', file: 'customers.csv', note: '8,986 / 12,480', pct: 72 },
		{ dir: 'OUT', file: 'orders.jsonl', note: 'done', pct: 100 },
		{ dir: 'OUT', file: 'churn_q3.sql', note: '31%', pct: 31 }
	];

	const quickOpen = [
		{ k: 'Table', v: 'orders', s: 'Main DB' },
		{ k: 'Table', v: 'order_items', s: 'Main DB' },
		{ k: 'Saved', v: 'Orders by week', s: 'Analytics' },
		{ k: 'Command', v: 'Open ER diagram', s: '' }
	];
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (menuOpen = false)} />

<!-- ───────────── shared bits ───────────── -->
{#snippet arrow(kind: 'out' | 'down' | 'right')}
	<svg
		viewBox="0 0 16 16"
		class="size-3.5"
		fill="none"
		stroke="currentColor"
		stroke-width="1.4"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		{#if kind === 'out'}<path d="M5 11 11 5M6 5h5v5" />{:else if kind === 'down'}<path
				d="M8 3v10M4 9l4 4 4-4"
			/>{:else}<path d="M3 8h10M9 4l4 4-4 4" />{/if}
	</svg>
{/snippet}

{#snippet github(cls = 'size-4')}
	<svg viewBox="0 0 16 16" class={cls} fill="currentColor" aria-hidden="true"
		><path
			d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
		/></svg
	>
{/snippet}

{#snippet cta(href: string, label: string, kind: 'out' | 'down' | 'right', solid = true)}
	<a
		{href}
		target={href.startsWith('http') && !href.includes('/download/') ? '_blank' : undefined}
		rel="noopener"
		class="group inline-flex items-center gap-4 rounded-full py-1.5 pr-1.5 pl-6 text-[15px] font-medium tracking-[-0.01em] transition-[transform,background-color] duration-500 ease-spring active:scale-[0.98] {solid
			? 'bg-jade text-ink shadow-[0_10px_40px_-12px_rgb(62_207_155/0.55),inset_0_1px_0_rgb(255_255_255/0.35)] hover:bg-[#55d8a8]'
			: 'bg-white/[0.04] text-fg ring-1 ring-white/10 ring-inset hover:bg-white/[0.08]'}"
	>
		{label}
		<span
			class="grid size-9 place-items-center rounded-full transition-transform duration-500 ease-spring group-hover:scale-105 {kind ===
			'down'
				? 'group-hover:translate-y-0.5'
				: 'group-hover:translate-x-1 group-hover:-translate-y-px'} {solid
				? 'bg-ink/10'
				: 'bg-white/10'}"
		>
			{@render arrow(kind)}
		</span>
	</a>
{/snippet}

{#snippet check()}
	<svg
		viewBox="0 0 16 16"
		class="mt-[3px] size-3.5 shrink-0 text-jade"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		aria-hidden="true"
		><path d="m3.5 8.5 3 3 6-7" stroke-linecap="round" stroke-linejoin="round" /></svg
	>
{/snippet}

{#snippet eyebrow(text: string)}
	<span
		class="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-fg-2 uppercase ring-1 ring-white/[0.08] ring-inset"
	>
		<span class="size-1.5 rounded-full bg-jade"></span>{text}
	</span>
{/snippet}

{#snippet tile(abbr: string, cls = '')}
	<span
		class="grid size-8 shrink-0 place-items-center rounded-lg bg-jade/10 font-mono text-[11px] font-medium text-jade ring-1 ring-jade/20 ring-inset {cls}"
		>{abbr}</span
	>
{/snippet}

<div class="grain" aria-hidden="true"></div>

<!-- ───────────── nav: floating island ───────────── -->
<header class="fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-6">
	<nav
		aria-label="Main"
		class="flex w-full max-w-max items-center gap-1 rounded-full bg-ink-2/70 p-1.5 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_255_255/0.06)] ring-1 ring-white/[0.08] backdrop-blur-2xl max-md:max-w-none max-md:justify-between"
	>
		<a
			href="#top"
			class="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1.5"
			aria-label="Mystique home"
		>
			<img src={asset('brand/mystique-mark.svg')} alt="" class="size-7" width="28" height="28" />
			<span class="text-[15px] font-semibold tracking-[-0.02em]">Mystique</span>
		</a>
		<ul class="hidden items-center md:flex">
			{#each nav as item (item.href)}
				<li>
					<a
						href={item.href}
						class="rounded-full px-3.5 py-2 text-[13.5px] text-fg-2 transition-colors duration-300 ease-spring hover:bg-white/[0.05] hover:text-fg"
						>{item.label}</a
					>
				</li>
			{/each}
		</ul>
		<div class="hidden items-center gap-1 pl-2 md:flex">
			<a
				href={REPO}
				target="_blank"
				rel="noopener"
				class="grid size-9 place-items-center rounded-full text-fg-2 transition-colors duration-300 ease-spring hover:bg-white/[0.06] hover:text-fg"
				aria-label="Mystique on GitHub">{@render github()}</a
			>
			<a
				href="#download"
				class="rounded-full bg-fg px-4 py-2 text-[13.5px] font-medium text-ink transition-transform duration-500 ease-spring hover:bg-white active:scale-[0.97]"
				>Download</a
			>
		</div>
		<button
			type="button"
			class="relative grid size-10 place-items-center rounded-full bg-white/[0.05] md:hidden"
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={menuOpen}
			aria-controls="mobile-menu"
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span
				class="absolute h-px w-4 bg-fg transition-transform duration-500 ease-spring {menuOpen
					? 'rotate-45'
					: '-translate-y-[3px]'}"
			></span>
			<span
				class="absolute h-px w-4 bg-fg transition-transform duration-500 ease-spring {menuOpen
					? '-rotate-45'
					: 'translate-y-[3px]'}"
			></span>
		</button>
	</nav>
</header>

<!-- mobile overlay -->
<div
	id="mobile-menu"
	class="fixed inset-0 z-40 flex flex-col justify-end bg-ink/85 px-6 pb-14 backdrop-blur-3xl transition-opacity duration-500 ease-spring md:hidden {menuOpen
		? 'opacity-100'
		: 'pointer-events-none opacity-0'}"
	inert={!menuOpen}
>
	<ul class="space-y-1">
		{#each [...nav, { href: REPO, label: 'GitHub' }] as item, i (item.href)}
			<li class="overflow-hidden">
				<a
					href={item.href}
					onclick={() => (menuOpen = false)}
					class="block py-2 text-5xl font-medium tracking-[-0.04em] transition-[transform,opacity] duration-700 ease-spring {menuOpen
						? 'translate-y-0 opacity-100'
						: 'translate-y-12 opacity-0'}"
					style="transition-delay: {menuOpen ? 100 + i * 60 : 0}ms">{item.label}</a
				>
			</li>
		{/each}
	</ul>
	<p class="mt-10 font-mono text-xs text-fg-3">v{VERSION} · MIT licensed</p>
</div>

<main id="top" class="overflow-x-clip">
	<!-- ───────────── hero ───────────── -->
	<section class="relative px-4 pt-36 pb-24 md:px-8 md:pt-48 md:pb-32">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1100px] bg-[radial-gradient(60%_50%_at_25%_10%,rgb(62_207_155/0.16),transparent_70%),radial-gradient(40%_35%_at_85%_30%,rgb(218_231_222/0.07),transparent_70%)]"
		></div>

		<div class="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-12 lg:items-end">
			<div class="lg:col-span-8">
				<div use:reveal>{@render eyebrow(`v${VERSION} · Free & open source`)}</div>
				<h1
					use:reveal={80}
					class="mt-7 text-[clamp(3.1rem,9vw,7.6rem)] leading-[0.9] font-medium tracking-[-0.055em] text-balance"
				>
					Quiet surfaces.<br /><span class="text-jade">Loud data.</span>
				</h1>
				<p use:reveal={160} class="mt-8 max-w-xl text-lg leading-relaxed text-fg-2 md:text-xl">
					A calm, fast desktop client for PostgreSQL, MySQL, SQLite and MongoDB. Query, edit and map
					your data, and let your AI agents in on your terms.
				</p>
				<div use:reveal={240} class="mt-10 flex flex-wrap items-center gap-3">
					{@render cta(
						primary.href,
						primary.label,
						primary.href.startsWith('#') ? 'right' : 'down'
					)}
					{@render cta(REPO, 'Star on GitHub', 'out', false)}
				</div>
				<p use:reveal={300} class="mt-5 text-[13px] text-fg-3">
					{#if os === 'mac'}Apple silicon build. <a
							href="#download"
							class="text-fg-2 underline decoration-white/20 underline-offset-4 hover:text-fg"
							>Intel, Windows &amp; Linux</a
						>{:else}macOS · Windows · Linux, on x64 and ARM64{/if}
				</p>
			</div>

			<dl
				use:reveal={360}
				class="grid grid-cols-3 gap-6 border-t border-white/[0.07] pt-6 lg:col-span-4 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
			>
				<div>
					<dt class="text-[11px] tracking-[0.18em] text-fg-3 uppercase">Engines</dt>
					<dd class="mt-1.5 text-3xl font-medium tracking-tight">8</dd>
				</div>
				<div>
					<dt class="text-[11px] tracking-[0.18em] text-fg-3 uppercase">Platforms</dt>
					<dd class="mt-1.5 text-3xl font-medium tracking-tight">3</dd>
				</div>
				<div>
					<dt class="text-[11px] tracking-[0.18em] text-fg-3 uppercase">Credentials</dt>
					<dd class="mt-1.5 text-[15px] leading-snug text-fg-2">
						In your system keychain. Nothing leaves until you connect.
					</dd>
				</div>
			</dl>
		</div>

		<!-- product shot -->
		<div class="mx-auto mt-20 max-w-[1320px] [perspective:2200px] md:mt-28">
			<div use:reveal={200} class="tilt bezel !rounded-[2.25rem] p-2 md:p-2.5">
				<div
					class="overflow-hidden bezel-core !rounded-[1.75rem] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
				>
					<img
						src={asset('app-home.jpg')}
						width="2400"
						height="1508"
						alt="Creating a PostgreSQL connection in Mystique, with saved connections grouped by environment in the sidebar"
						fetchpriority="high"
						class="block h-auto w-full"
					/>
				</div>
			</div>
		</div>
	</section>

	<!-- engines marquee -->
	<section aria-label="Supported engines" class="group border-y border-white/[0.05] py-7">
		<div
			class="flex w-max animate-[marquee_45s_linear_infinite] group-hover:[animation-play-state:paused]"
		>
			{#each [0, 1] as copy (copy)}
				<ul class="flex shrink-0 items-center" aria-hidden={copy === 1}>
					{#each engines as e (e.name)}
						<li class="flex items-center gap-3 px-8 text-[15px] whitespace-nowrap text-fg-3">
							{@render tile(e.abbr, 'size-7 text-[10px]')}{e.name}
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	</section>

	<!-- ───────────── features bento ───────────── -->
	<section id="features" class="scroll-mt-24 px-4 py-28 md:px-8 md:py-40">
		<div class="mx-auto max-w-[1240px]">
			<div class="max-w-4xl">
				<div use:reveal>{@render eyebrow('The studio')}</div>
				<h2
					use:reveal={80}
					class="mt-6 text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance"
				>
					The parts other database clients make you live without.
				</h2>
			</div>

			<div class="mt-16 grid grid-cols-1 gap-5 md:mt-20 lg:grid-cols-12">
				<!-- Workspace: many connections, many tabs -->
				<article use:reveal class="bezel lg:col-span-12">
					<div
						class="grid items-center gap-10 bezel-core p-7 md:p-12 lg:grid-cols-[5fr_7fr] lg:gap-14"
					>
						<div>
							<p class="font-mono text-[11px] tracking-[0.14em] text-jade uppercase">Workspace</p>
							<h3
								class="mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance"
							>
								Every connection. One window.
							</h3>
							<p class="mt-5 max-w-md leading-relaxed text-fg-2">
								Keep Postgres prod, Mongo staging and a local SQLite file open side by side and hop
								between them from the session rail. Tables, queries, ER diagrams and metrics each
								open as a tab.
							</p>
							<ul class="mt-7 space-y-2.5 text-[14.5px] text-fg-2">
								{#each ['Several live sessions at once, no extra windows', 'Tabs kept per connection, closed ones reopen', 'Production stays amber in the rail and every tab'] as b (b)}
									<li class="flex items-start gap-2.5">{@render check()}{b}</li>
								{/each}
							</ul>
						</div>

						<div
							class="overflow-hidden rounded-2xl bg-ink shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/[0.07]"
						>
							<div class="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-2.5">
								{#each [0, 1, 2] as d (d)}<span class="size-2.5 rounded-full bg-white/10"
									></span>{/each}
								<span class="ml-3 text-[11.5px] text-fg-3">Mystique</span>
							</div>
							<div class="flex">
								<div
									class="flex w-14 shrink-0 flex-col items-center gap-2.5 border-r border-white/[0.06] py-3"
									aria-hidden="true"
								>
									{#each sessions as s, i (s.name)}
										<span
											class="relative grid size-9 place-items-center rounded-xl font-mono text-[11px]"
											style="color:{s.color};background:color-mix(in oklab,{s.color} 14%,transparent);box-shadow:inset 0 0 0 1px color-mix(in oklab,{s.color} 35%,transparent)"
										>
											{s.abbr}
											{#if i === 0}<span class="absolute -left-[11px] h-5 w-0.5 rounded-full bg-fg"
												></span>{/if}
											{#if s.prod}<span
													class="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-amber ring-2 ring-ink"
												></span>{/if}
										</span>
									{/each}
									<span
										class="grid size-9 place-items-center rounded-xl text-fg-3 ring-1 ring-white/[0.08] ring-inset"
										>+</span
									>
								</div>
								<div class="min-w-0 flex-1">
									<ul
										class="flex overflow-hidden border-b border-white/[0.06] [mask-image:linear-gradient(to_right,black_85%,transparent)]"
										aria-label="Open tabs"
									>
										{#each tabs as t, i (t.name)}
											<li
												class="flex shrink-0 items-center gap-2 border-r border-white/[0.05] px-3.5 py-2.5 text-[12px] {i ===
												0
													? 'bg-white/[0.04] text-fg shadow-[inset_0_-1px_0_var(--color-jade)]'
													: 'text-fg-3'}"
											>
												<span class="size-1.5 rounded-full" style="background:{t.color}"></span>
												<span class="font-mono text-[9.5px] tracking-wider text-fg-3">{t.kind}</span
												>
												{t.name}
											</li>
										{/each}
									</ul>
									<div class="flex items-center gap-2 px-4 pt-3.5 text-[12px] text-fg-3">
										<span class="text-fg-2">Main DB</span>
										<span
											class="rounded-md bg-amber/10 px-1.5 py-px font-mono text-[9.5px] text-amber ring-1 ring-amber/30"
											>PROD</span
										>
										<span>› public › users</span>
										<span class="ml-auto font-mono text-[11px]">2,091 rows</span>
									</div>
									<div class="space-y-2 px-4 pt-4 pb-5" aria-hidden="true">
										{#each [62, 48, 70, 40, 56, 66, 52, 44] as w, i (i)}
											<div class="flex items-center gap-3">
												<span class="h-2 w-8 rounded-full bg-white/[0.06]"></span>
												<span class="h-2 rounded-full bg-white/[0.08]" style="width:{w}%"></span>
												<span class="ml-auto h-2 w-14 rounded-full bg-white/[0.05]"></span>
											</div>
										{/each}
									</div>
								</div>
							</div>
						</div>
					</div>
				</article>

				<!-- Data grid -->
				<article use:reveal class="bezel lg:col-span-7">
					<div class="flex h-full flex-col bezel-core p-7 md:p-10">
						<p class="font-mono text-[11px] tracking-[0.14em] text-jade uppercase">Data grid</p>
						<h3 class="mt-4 text-[1.75rem] leading-tight font-medium tracking-[-0.03em]">
							Edit like a spreadsheet.<br />Commit like SQL.
						</h3>
						<p class="mt-4 max-w-md leading-relaxed text-fg-2">
							Filter, sort and page any table or collection. Edit cells inline, add and delete rows
							with undo, then review the exact SQL before you save.
						</p>

						<div
							class="mt-10 overflow-hidden rounded-2xl bg-ink ring-1 ring-white/[0.06] md:mt-auto"
						>
							<div
								class="flex flex-wrap items-center gap-2 border-b border-white/[0.06] px-3 py-2.5 font-mono text-[11px]"
							>
								<span class="rounded-md bg-white/[0.05] px-2 py-1 text-fg-2"
									>plan <span class="text-fg-3">in</span>
									<span class="text-amber">pro, team</span></span
								>
								<span class="rounded-md bg-white/[0.05] px-2 py-1 text-fg-2"
									>created_at <span class="text-fg-3">↓</span></span
								>
								<span class="ml-auto text-fg-3">1–50 of 2,091</span>
							</div>
							<div class="overflow-x-auto">
								<table class="w-full min-w-[440px] font-mono text-[12px] tabular-nums">
									<thead class="text-left text-fg-3">
										<tr class="border-b border-white/[0.06]">
											<th class="px-4 py-3 font-normal">id</th>
											<th class="px-4 py-3 font-normal">email</th>
											<th class="px-4 py-3 font-normal">plan</th>
											<th class="px-4 py-3 font-normal">settings</th>
										</tr>
									</thead>
									<tbody class="text-fg-2">
										{#each gridRows as r (r.id)}
											<tr
												class="border-b border-white/[0.04] last:border-0 {r.state === 'edit'
													? 'bg-jade/[0.05]'
													: r.state === 'del'
														? 'bg-[#ff6b6b]/[0.05] text-fg-3 line-through decoration-[#ff6b6b]/60'
														: ''}"
											>
												<td class="px-4 py-2.5">{r.id}</td>
												<td class="px-4">{r.email}</td>
												<td class="px-4"
													>{#if r.state === 'edit'}<span
															class="rounded-md bg-jade/15 px-1.5 py-0.5 text-jade ring-1 ring-jade/40"
															>{r.plan}</span
														>{:else}{r.plan}{/if}</td
												>
												<td class="max-w-[9rem] truncate px-4 text-fg-3">{r.settings}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
							<div
								class="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] bg-white/[0.02] px-4 py-3"
							>
								<code class="font-mono text-[11.5px] text-fg-2"
									><span class="text-jade">UPDATE</span> users <span class="text-jade">SET</span>
									plan = <span class="text-amber">'team'</span> <span class="text-jade">WHERE</span> id
									= 1042;</code
								>
								<span class="rounded-full bg-jade px-3 py-1 text-[11px] font-medium text-ink"
									>Save 2 changes</span
								>
							</div>
						</div>
					</div>
				</article>

				<!-- Inspector: row details + cell viewer -->
				<article use:reveal={100} class="bezel lg:col-span-5">
					<div class="flex h-full flex-col bezel-core p-7 md:p-9">
						<p class="font-mono text-[11px] tracking-[0.14em] text-jade uppercase">Inspector</p>
						<h3 class="mt-4 text-2xl font-medium tracking-[-0.03em]">
							Read the row, not the ellipsis.
						</h3>
						<p class="mt-3 leading-relaxed text-fg-2">
							Pin any row in a side panel as fields or JSON. Open a long cell in its own viewer as
							text, JSON or HTML, prettify it, edit and apply.
						</p>

						<div class="relative mt-8">
							<div class="rounded-2xl bg-ink ring-1 ring-white/[0.07]">
								<div class="flex items-center justify-between px-4 pt-3.5">
									<span class="text-[13px] font-medium">Row details</span>
									<span class="font-mono text-[11px] text-fg-3">✕</span>
								</div>
								<div
									class="mx-3 mt-3 grid grid-cols-2 rounded-lg bg-white/[0.03] p-0.5 text-center text-[11.5px] ring-1 ring-white/[0.05]"
								>
									<span class="py-1 text-fg-3">Fields</span>
									<span class="rounded-md bg-white/[0.07] py-1 text-fg">JSON</span>
								</div>
								<pre
									class="overflow-x-auto px-4 pt-3 pb-4 font-mono text-[11.5px] leading-[1.7] text-fg-2">{@html json(
										inspectRow
									)}</pre>
								<p class="border-t border-white/[0.06] px-4 py-2 font-mono text-[10.5px] text-fg-3">
									6 keys
								</p>
							</div>

							<div
								class="relative mt-3 rounded-2xl bg-ink-3 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.95)] ring-1 ring-white/[0.1] lg:-mt-24 lg:ml-10 lg:-rotate-[1.5deg]"
							>
								<div class="flex items-start justify-between gap-3 px-4 pt-3.5">
									<div>
										<p class="font-mono text-[12.5px]">settings</p>
										<p class="font-mono text-[10.5px] text-fg-3">Row 1042 · jsonb</p>
									</div>
									<div
										class="flex rounded-lg bg-white/[0.03] p-0.5 text-[11px] ring-1 ring-white/[0.06]"
									>
										<span class="px-2 py-0.5 text-fg-3">Text</span>
										<span class="rounded-md bg-jade/15 px-2 py-0.5 text-jade">JSON</span>
										<span class="px-2 py-0.5 text-fg-3">HTML</span>
									</div>
								</div>
								<pre
									class="mx-3 mt-3 overflow-x-auto rounded-xl bg-ink px-3 py-2.5 font-mono text-[11.5px] leading-[1.7] text-fg-2 ring-1 ring-white/[0.05]">{@html json(
										inspectRow.settings
									)}</pre>
								<div class="flex items-center justify-between px-4 py-3 text-[11px] text-fg-3">
									<span
										><kbd class="rounded bg-white/[0.06] px-1 font-mono">⌘↵</kbd> apply ·
										<kbd class="rounded bg-white/[0.06] px-1 font-mono">esc</kbd> cancel</span
									>
									<span class="flex gap-2"
										><span class="px-1.5 py-1">Prettify</span><span
											class="rounded-full bg-jade px-3 py-1 font-medium text-ink">Apply</span
										></span
									>
								</div>
							</div>
						</div>
					</div>
				</article>

				<!-- Agent -->
				<article id="agent" use:reveal class="scroll-mt-24 bezel lg:col-span-12">
					<div
						class="relative grid gap-10 overflow-hidden bezel-core p-7 md:p-12 lg:grid-cols-2 lg:gap-16"
					>
						<div
							aria-hidden="true"
							class="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(62_207_155/0.14),transparent)]"
						></div>
						<div class="relative">
							<p class="font-mono text-[11px] tracking-[0.14em] text-jade uppercase">
								Agent &amp; MCP
							</p>
							<h3
								class="mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance"
							>
								Bring your own model. Keep your hand on the leash.
							</h3>
							<p class="mt-5 max-w-lg leading-relaxed text-fg-2">
								Ask the agent in any query tab to draft or fix a query against the open connection.
								Claude Code, Codex, Cursor and other MCP clients on your machine can use Mystique’s
								database tools too. Each connection gets an access level, and risky writes wait for
								your approval.
							</p>
							<ul class="mt-8 flex flex-wrap gap-2">
								{#each agents as a (a)}
									<li
										class="rounded-full bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-fg-2 ring-1 ring-white/[0.08] ring-inset"
									>
										{a}
									</li>
								{/each}
							</ul>
						</div>

						<div class="relative flex flex-col justify-center gap-4">
							<div
								class="flex w-max items-center gap-1 rounded-full bg-ink p-1 ring-1 ring-white/[0.07]"
								role="img"
								aria-label="Access level: write"
							>
								{#each ['read', 'write', 'full'] as lvl (lvl)}
									<span
										class="rounded-full px-4 py-1.5 font-mono text-[12px] {lvl === 'write'
											? 'bg-white/[0.08] text-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]'
											: 'text-fg-3'}">{lvl}</span
									>
								{/each}
							</div>
							<div class="rounded-2xl bg-ink p-5 ring-1 ring-white/[0.06]">
								<p class="text-[13px] text-fg-3">You</p>
								<p class="mt-1 text-[15px]">Which customers churned last month?</p>
								<div
									class="mt-4 rounded-xl bg-white/[0.03] p-3.5 font-mono text-[11.5px] leading-relaxed text-fg-2 ring-1 ring-white/[0.05]"
								>
									<span class="text-jade">SELECT</span> c.id, c.name
									<span class="text-jade">FROM</span>
									customers c<br />
									<span class="text-jade">WHERE</span> c.cancelled_at &gt;= date_trunc(<span
										class="text-amber">'month'</span
									>, now()) - interval <span class="text-amber">'1 month'</span>;
								</div>
							</div>
							<div class="rounded-2xl bg-amber/[0.06] p-5 ring-1 ring-amber/25 md:ml-10">
								<p class="text-[13px] text-amber">
									<span class="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-amber"
									></span>Claude Code wants to write to
									<b class="font-medium">Main&nbsp;DB&nbsp;·&nbsp;PROD</b>
								</p>
								<code class="mt-3 block font-mono text-[11.5px] text-fg-2"
									>DELETE FROM sessions WHERE expires_at &lt; now();</code
								>
								<div class="mt-4 flex gap-2">
									<span class="rounded-full bg-fg px-3.5 py-1.5 text-[12px] font-medium text-ink"
										>Approve</span
									>
									<span
										class="rounded-full px-3.5 py-1.5 text-[12px] text-fg-2 ring-1 ring-white/10"
										>Deny</span
									>
								</div>
							</div>
						</div>
					</div>
				</article>

				<!-- ER diagrams -->
				<article use:reveal class="bezel lg:col-span-5">
					<div class="flex h-full flex-col bezel-core p-7 md:p-9">
						<p class="font-mono text-[11px] tracking-[0.14em] text-jade uppercase">ER diagrams</p>
						<h3 class="mt-4 text-2xl font-medium tracking-[-0.03em]">See how it all connects.</h3>
						<p class="mt-3 leading-relaxed text-fg-2">
							Auto-laid-out diagrams for any schema. Download a PNG or copy it as DBML. Columns,
							keys, indexes, triggers and schema compare are a click away.
						</p>
						<svg
							viewBox="0 0 360 220"
							class="mt-8 w-full md:mt-auto"
							role="img"
							aria-label="ER diagram: users has many orders, orders has many order_items, products has many order_items"
						>
							<g fill="none" stroke="rgb(62 207 155 / 0.55)" stroke-width="1">
								<path d="M112 40 C150 40 140 92 180 92" />
								<path d="M232 139 C232 150 210 150 210 160" />
								<path d="M112 152 C140 152 140 176 150 176" />
							</g>
							{#each erBoxes as box (box.t)}
								<g transform="translate({box.x} {box.y})">
									<rect
										width={box.w}
										height={24 + box.r.length * 15}
										rx="8"
										fill="#070807"
										stroke="rgb(255 255 255 / 0.12)"
									/>
									<text
										x="10"
										y="16"
										fill="#ecf1ee"
										font-size="10.5"
										font-family="Geist Mono, monospace">{box.t}</text
									>
									{#each box.r as col, j (col)}
										<text
											x="10"
											y={33 + j * 15}
											fill={col.endsWith('_id') || col === 'id' ? '#3ecf9b' : '#6b7570'}
											font-size="9.5"
											font-family="Geist Mono, monospace">{col}</text
										>
									{/each}
								</g>
							{/each}
						</svg>
						<div class="mt-6 flex gap-2 text-[11.5px]">
							<span
								class="rounded-full px-3 py-1 font-mono text-fg-2 ring-1 ring-white/[0.08] ring-inset"
								>Download PNG</span
							>
							<span
								class="rounded-full px-3 py-1 font-mono text-fg-2 ring-1 ring-white/[0.08] ring-inset"
								>Copy as DBML</span
							>
						</div>
					</div>
				</article>

				<!-- Server metrics -->
				<article use:reveal={100} class="bezel lg:col-span-7">
					<div class="flex h-full flex-col bezel-core p-7 md:p-9">
						<p class="font-mono text-[11px] tracking-[0.14em] text-jade uppercase">
							Server metrics
						</p>
						<h3 class="mt-4 text-2xl font-medium tracking-[-0.03em]">
							Find what’s holding up prod.
						</h3>
						<p class="mt-3 max-w-lg leading-relaxed text-fg-2">
							Active queries, cache hit ratio, database size and transactions at a glance. Spot the
							session idle in a transaction and end it, or filter slow queries from 500 ms up.
						</p>

						<div
							class="mt-8 overflow-hidden rounded-2xl bg-ink ring-1 ring-white/[0.06] md:mt-auto"
						>
							<div
								class="flex items-center gap-1 border-b border-white/[0.06] px-2 py-1.5 text-[12px]"
							>
								{#each ['Overview', 'Connections', 'Slow queries'] as t, i (t)}
									<span
										class="rounded-lg px-3 py-1.5 {i === 1
											? 'bg-white/[0.06] text-fg'
											: 'text-fg-3'}">{t}</span
									>
								{/each}
								<span class="ml-auto flex items-center gap-2 pr-2 font-mono text-[10.5px] text-fg-3"
									><span
										class="size-1.5 animate-[pulse-halo_2.4s_ease-out_infinite] rounded-full bg-jade"
									></span>live</span
								>
							</div>
							<dl class="grid grid-cols-2 gap-px bg-white/[0.05] sm:grid-cols-4">
								{#each metrics as m (m.label)}
									<div class="bg-ink px-4 py-3.5">
										<dt class="text-[10px] tracking-[0.12em] text-fg-3 uppercase">{m.label}</dt>
										<dd class="mt-1 text-xl font-medium tracking-tight tabular-nums">{m.value}</dd>
										{#if m.fill}<div class="mt-2 h-1 rounded-full bg-white/[0.06]">
												<div class="h-full rounded-full bg-jade" style="width:{m.fill}%"></div>
											</div>{/if}
									</div>
								{/each}
							</dl>
							<div class="overflow-x-auto">
								<table class="w-full min-w-[460px] font-mono text-[11.5px]">
									<tbody class="text-fg-2">
										{#each backends as b (b.pid)}
											<tr class="border-t border-white/[0.05]">
												<td class="py-2.5 pl-4 text-fg-3">{b.pid}</td>
												<td class="px-3">{b.user}</td>
												<td class="px-3"
													><span
														class="rounded-md px-1.5 py-0.5 text-[10.5px] {b.warn
															? 'bg-amber/10 text-amber ring-1 ring-amber/30'
															: 'bg-jade/10 text-jade ring-1 ring-jade/25'}">{b.state}</span
													></td
												>
												<td class="max-w-[10rem] truncate px-3 text-fg-3">{b.query}</td>
												<td class="px-3 text-right tabular-nums">{b.time}</td>
												<td class="pr-3 text-right"
													>{#if b.warn}<span
															class="rounded-full px-2.5 py-1 font-sans text-[11px] text-[#ff8a8a] ring-1 ring-[#ff6b6b]/30"
															>Terminate</span
														>{/if}</td
												>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</article>

				<!-- Import & export -->
				<article use:reveal class="bezel lg:col-span-7">
					<div class="grid h-full gap-8 bezel-core p-7 md:grid-cols-2 md:p-9">
						<div>
							<p class="font-mono text-[11px] tracking-[0.14em] text-jade uppercase">
								Import &amp; export
							</p>
							<h3 class="mt-4 text-2xl font-medium tracking-[-0.03em]">
								Data in, data out. No scripts.
							</h3>
							<p class="mt-3 leading-relaxed text-fg-2">
								Import rows from a file, export a table or a result, and keep working while
								transfers run in the background. Copy any selection straight into a ticket or a
								test.
							</p>
							<dl class="mt-7 space-y-3 text-[12px]">
								{#each transferFormats as g (g.label)}
									<div class="flex flex-wrap items-center gap-1.5">
										<dt class="w-16 text-fg-3">{g.label}</dt>
										{#each g.items as f (f)}
											<dd
												class="rounded-full px-2.5 py-0.5 font-mono text-fg-2 ring-1 ring-white/[0.08] ring-inset"
											>
												{f}
											</dd>
										{/each}
									</div>
								{/each}
							</dl>
						</div>
						<div class="self-center rounded-2xl bg-ink ring-1 ring-white/[0.07]">
							<p
								class="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 text-[12.5px] font-medium"
							>
								Background transfers <span class="font-mono text-[10.5px] font-normal text-fg-3"
									>3</span
								>
							</p>
							<ul class="divide-y divide-white/[0.05]">
								{#each transfers as t (t.file)}
									<li class="px-4 py-3">
										<div class="flex items-center justify-between gap-3 text-[12px]">
											<span class="flex min-w-0 items-center gap-2">
												<span class="font-mono text-[10px] text-fg-3">{t.dir}</span>
												<span class="truncate font-mono text-fg-2">{t.file}</span>
											</span>
											<span class="shrink-0 font-mono text-[10.5px] text-fg-3">{t.note}</span>
										</div>
										<div class="mt-2 h-1 rounded-full bg-white/[0.06]">
											<div
												class="h-full rounded-full {t.pct === 100 ? 'bg-white/25' : 'bg-jade'}"
												style="width:{t.pct}%"
											></div>
										</div>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</article>

				<!-- Quick open + themes -->
				<article use:reveal={100} class="bezel lg:col-span-5">
					<div class="flex h-full flex-col bezel-core p-7 md:p-9">
						<p class="font-mono text-[11px] tracking-[0.14em] text-jade uppercase">Quick open</p>
						<h3 class="mt-4 text-2xl font-medium tracking-[-0.03em]">⌘K to anywhere.</h3>
						<p class="mt-3 leading-relaxed text-fg-2">
							Jump to any connection, table, saved query or command. Four themes, two dark and two
							light, or follow the system.
						</p>
						<div
							class="mt-7 rounded-2xl bg-ink p-2 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/[0.07] md:mt-auto"
						>
							<div
								class="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2.5 text-[13px]"
							>
								<span class="text-fg">ord</span><span
									class="h-4 w-px animate-[caret_1.1s_steps(1)_infinite] bg-jade"
								></span>
								<kbd class="ml-auto rounded bg-white/[0.06] px-1.5 font-mono text-[10px] text-fg-3"
									>⌘K</kbd
								>
							</div>
							<ul class="p-1 text-[12.5px]">
								{#each quickOpen as r, i (r.v)}
									<li
										class="flex items-center gap-3 rounded-lg px-2.5 py-2 {i === 0
											? 'bg-white/[0.06]'
											: ''}"
									>
										<span class="w-14 font-mono text-[10px] tracking-wide text-fg-3 uppercase"
											>{r.k}</span
										>
										<span class={i === 0 ? 'text-fg' : 'text-fg-2'}>{r.v}</span>
										<span class="ml-auto truncate text-[11px] text-fg-3">{r.s}</span>
									</li>
								{/each}
							</ul>
						</div>
						<ul class="mt-6 flex gap-4">
							{#each themes as t (t.name)}
								<li class="flex items-center gap-2 text-[11.5px] text-fg-3">
									<span
										class="grid size-6 place-items-center rounded-full ring-1 ring-white/10"
										style="background:{t.bg}"
									>
										<span class="size-2 rounded-full" style="background:{t.accent}"></span>
									</span>{t.name}
								</li>
							{/each}
						</ul>
					</div>
				</article>
			</div>
		</div>
	</section>

	<!-- ───────────── databases: editorial split ───────────── -->
	<section id="databases" class="scroll-mt-24 px-4 py-28 md:px-8 md:py-40">
		<div class="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-2 lg:gap-20">
			<div class="lg:sticky lg:top-32 lg:self-start">
				<div use:reveal>{@render eyebrow('Supported databases')}</div>
				<h2
					use:reveal={80}
					class="mt-6 text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance"
				>
					Eight engines. No second-class drivers.
				</h2>
				<p use:reveal={160} class="mt-6 max-w-md text-lg leading-relaxed text-fg-2">
					Every engine gets the whole studio: query editor, data grid, ER diagram and server
					metrics.
				</p>
			</div>

			<ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{#each engines as e, i (e.name)}
					<li use:reveal={(i % 2) * 80} class="bezel !rounded-[1.5rem] !p-1">
						<div class="bezel-core !rounded-[calc(1.5rem-0.25rem)] p-5">
							<div class="flex items-center gap-3">
								{@render tile(e.abbr, 'size-10 rounded-xl text-[13px]')}
								<div>
									<p class="text-[15px] font-medium tracking-[-0.01em]">{e.name}</p>
									<p class="text-[12px] text-fg-3">{e.kind}</p>
								</div>
							</div>
							<ul class="mt-5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px] text-fg-2">
								{#each ['Query editor', 'Data grid', 'ER diagram', 'Server metrics'] as cap (cap)}
									<li class="flex items-center gap-1.5">
										<svg
											viewBox="0 0 16 16"
											class="size-3 text-jade"
											fill="none"
											stroke="currentColor"
											stroke-width="1.5"
											aria-hidden="true"
											><path
												d="m3.5 8.5 3 3 6-7"
												stroke-linecap="round"
												stroke-linejoin="round"
											/></svg
										>{cap}
									</li>
								{/each}
							</ul>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- ───────────── download ───────────── -->
	<section id="download" class="relative scroll-mt-24 px-4 py-28 md:px-8 md:py-40">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[800px] bg-[radial-gradient(50%_45%_at_50%_0%,rgb(62_207_155/0.10),transparent_70%)]"
		></div>
		<div class="mx-auto max-w-[1240px]">
			<div class="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
				<div>
					<div use:reveal>{@render eyebrow(`Version ${VERSION}`)}</div>
					<h2
						use:reveal={80}
						class="mt-6 text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.045em]"
					>
						Download Mystique.
					</h2>
					<p use:reveal={160} class="mt-5 max-w-lg text-lg leading-relaxed text-fg-2">
						Free for every desktop. Builds aren’t signed by Apple or Microsoft yet, so the first
						launch needs one extra step.
					</p>
				</div>
				<div use:reveal={200}>
					{@render cta(`${REPO}/releases/latest`, 'All releases', 'out', false)}
				</div>
			</div>

			{#snippet platform(p: (typeof platforms)[number], cls = '')}
				<article
					use:reveal
					class="bezel {cls} {os === p.id
						? '!shadow-[inset_0_0_0_1px_rgb(62_207_155/0.35),0_40px_80px_-40px_rgb(62_207_155/0.25)]'
						: ''}"
				>
					<div class="flex h-full flex-col bezel-core p-6 md:p-8">
						<div class="flex items-center justify-between">
							<h3 class="text-2xl font-medium tracking-[-0.03em]">{p.name}</h3>
							{#if os === p.id}<span
									class="rounded-full bg-jade/10 px-2.5 py-1 text-[10px] font-medium tracking-[0.16em] text-jade uppercase ring-1 ring-jade/30"
									>Your system</span
								>{/if}
						</div>
						<ul class="mt-6 grid gap-1.5 {p.files.length > 2 ? 'sm:grid-cols-2' : ''}">
							{#each p.files as f (f.file)}
								<li>
									<a
										href="{REL}/{f.file}"
										class="group flex items-center justify-between gap-3 rounded-2xl bg-white/[0.02] py-2.5 pr-2.5 pl-4 ring-1 ring-white/[0.05] transition-[background-color,transform] duration-500 ease-spring ring-inset hover:bg-white/[0.06] active:scale-[0.99]"
									>
										<span>
											<span class="block text-[14.5px]">{f.arch}</span>
											<span class="block font-mono text-[11.5px] text-fg-3">{f.kind}</span>
										</span>
										<span
											class="grid size-9 place-items-center rounded-full bg-white/[0.06] text-fg-2 transition-[transform,background-color,color] duration-500 ease-spring group-hover:translate-y-0.5 group-hover:scale-105 group-hover:bg-jade group-hover:text-ink"
										>
											{@render arrow('down')}
										</span>
										<span class="sr-only">Download {p.name} {f.arch} {f.kind}</span>
									</a>
								</li>
							{/each}
						</ul>
						{#if p.firstRun}<p class="mt-6 text-[13px] leading-relaxed text-fg-3">
								{p.firstRun}
							</p>{/if}
						{#if p.id === 'linux'}
							<pre
								class="mt-6 overflow-x-auto rounded-2xl bg-ink p-4 font-mono text-[12px] leading-[1.8] text-fg-2 ring-1 ring-white/[0.06]"><code
									><span class="text-fg-3"># Debian, Ubuntu</span>
sudo apt install ./Mystique_*_amd64.deb
<span class="text-fg-3"># Fedora, RHEL</span>
sudo dnf install ./Mystique-*.x86_64.rpm
<span class="text-fg-3"># anywhere else</span>
chmod +x Mystique_*.AppImage && ./Mystique_*.AppImage</code
								></pre>
						{/if}
					</div>
				</article>
			{/snippet}

			<div class="mt-14 grid gap-5 lg:grid-cols-12">
				<div class="grid gap-5 lg:col-span-5">
					{@render platform(mac)}
					{@render platform(win)}
				</div>
				{@render platform(linux, 'lg:col-span-7')}
			</div>

			<p use:reveal class="mt-10 text-[14px] text-fg-3">
				Prefer to build it yourself? You’ll need Node 22+, pnpm, Rust and the Tauri prerequisites,
				then
				<code class="rounded-md bg-white/[0.05] px-1.5 py-0.5 font-mono text-[12.5px] text-fg-2"
					>pnpm install &amp;&amp; pnpm tauri dev</code
				>.
				<a
					href="{REPO}/blob/main/CONTRIBUTING.md"
					target="_blank"
					rel="noopener"
					class="text-fg-2 underline decoration-white/20 underline-offset-4 hover:text-fg"
					>Contributing guide</a
				>
			</p>
		</div>
	</section>

	<!-- ───────────── closing ───────────── -->
	<section class="px-4 pt-16 pb-28 md:px-8 md:pb-40">
		<div use:reveal class="mx-auto max-w-[1240px] bezel !rounded-[2.5rem] !p-2">
			<div
				class="relative overflow-hidden bezel-core !rounded-[2.25rem] px-6 py-20 text-center md:py-28"
			>
				<div
					aria-hidden="true"
					class="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_50%_100%,rgb(62_207_155/0.16),transparent_70%)]"
				></div>
				<img
					src={asset('brand/mystique-dog.svg')}
					alt=""
					width="88"
					height="88"
					class="relative mx-auto size-20 md:size-22"
				/>
				<h2
					class="relative mt-8 text-[clamp(2.4rem,6vw,5rem)] leading-[0.95] font-medium tracking-[-0.05em]"
				>
					Give me a name to fetch.
				</h2>
				<p class="relative mx-auto mt-5 max-w-md text-lg text-fg-2">
					Open source, MIT licensed, and ready on macOS, Windows and Linux.
				</p>
				<div class="relative mt-10 flex flex-wrap justify-center gap-3">
					{@render cta(
						primary.href,
						primary.label,
						primary.href.startsWith('#') ? 'right' : 'down'
					)}
					{@render cta(REPO, 'View source', 'out', false)}
				</div>
			</div>
		</div>
	</section>
</main>

<footer class="border-t border-white/[0.05] px-4 py-12 md:px-8">
	<div
		class="mx-auto flex max-w-[1240px] flex-col gap-8 md:flex-row md:items-center md:justify-between"
	>
		<div class="flex items-center gap-3">
			<img src={asset('brand/mystique-mark.svg')} alt="" class="size-8" width="32" height="32" />
			<div>
				<p class="text-[15px] font-semibold tracking-[-0.02em]">Mystique</p>
				<p class="font-mono text-[11.5px] text-fg-3">v{VERSION} · MIT licensed</p>
			</div>
		</div>
		<ul class="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-fg-2">
			{#each [{ l: 'GitHub', h: REPO }, { l: 'Releases', h: `${REPO}/releases` }, { l: 'Changelog', h: `${REPO}/blob/main/CHANGELOG.md` }, { l: 'Contributing', h: `${REPO}/blob/main/CONTRIBUTING.md` }, { l: 'License', h: `${REPO}/blob/main/LICENSE` }] as link (link.l)}
				<li>
					<a
						href={link.h}
						target="_blank"
						rel="noopener"
						class="transition-colors duration-300 ease-spring hover:text-fg">{link.l}</a
					>
				</li>
			{/each}
		</ul>
	</div>
</footer>
