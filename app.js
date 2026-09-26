// ============================================
// R6S 武器配件数据库 - 应用逻辑
// ============================================

(function() {
    'use strict';

    // ---- 工具函数 ----
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);
    const calcDPS = w => Math.round(w.damage * w.rpm / 60);
    const calcTTK = w => {
        if (w.rpm === 0) return '—';
        const stk = Math.ceil(100 / w.damage);
        const interval = 60000 / w.rpm;
        return Math.round((stk - 1) * interval);
    };
    const maxDPS = Math.max(...WEAPONS.filter(w => w.rpm > 0).map(calcDPS));

    // 武器缩略图降级链：主源（灰机 / Fandom）→ 备用源（Fandom）→ 隐藏
    // 注意：灰机 wiki 有防盗链，所有缩略图 img 必须带 referrerpolicy="no-referrer"
    const thumbFallbackURL = name =>
        (typeof getWeaponThumbFallbackURL === 'function') ? getWeaponThumbFallbackURL(name) : null;

    window.__thumbFallback = function(img, altUrl) {
        if (!img) return;
        if (altUrl && !img.dataset.fell) {
            img.dataset.fell = '1';
            img.src = altUrl;
            return;
        }
        img.style.display = 'none';
    };

    const thumbImgHTML = (name, cls) => {
        const url = (typeof getWeaponThumbURL === 'function') ? getWeaponThumbURL(name) : null;
        if (!url) return '';
        const alt = thumbFallbackURL(name);
        return `<img class="${cls}" src="${url}" alt="${String(name).replace(/"/g, '&quot;')}" loading="lazy"`
            + ` referrerpolicy="no-referrer" onerror="__thumbFallback(this${alt ? ",'" + alt + "'" : ''})">`;
    };

    const BARREL_NAMES = {
        muzzle_brake: '枪口制退器', compensator: '补偿器', flash_hider: '消焰器',
        suppressor: '消音器', extended_barrel: '延伸枪管'
    };
    const GRIP_NAMES = {
        vertical_grip: '垂直前握把', angled_grip: '拐角握把', horizontal_grip: '水平前握把'
    };
    // Y9S1 重构后的瞄具键（1.5x / 2.0x / 3.0x 已从游戏移除）
    const SIGHT_NAMES = {
        iron: '机瞄', red_dot: '红点', holographic: '全息', reflex: '反射',
        magnified: '2.5x 放大镜', telescopic: '3.5x 望远镜'
    };
    const RECOIL_LABELS = {
        'very_low': '极低', 'low': '低', 'medium': '中', 'high': '高', 'very_high': '极高', 'n/a': '—'
    };
    const RECOIL_COLORS = {
        'very_low': 'var(--success)', 'low': 'var(--success)', 'medium': 'var(--warning)',
        'high': 'var(--danger)', 'very_high': 'var(--danger)', 'n/a': 'var(--text-muted)'
    };

    // 判断是否为主武器
    const isPrimary = type => WEAPON_CATEGORY[type] === 'primary';
    const isSecondary = type => WEAPON_CATEGORY[type] === 'secondary';

    // ---- Tab 切换 ----
    function switchTab(tab) {
        $$('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tab));
        $$('.tab-content').forEach(t => t.classList.toggle('active', t.id === `tab-${tab}`));
    }
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            const tab = link.dataset.tab;
            if (!tab) return; // 没有 data-tab 的链接走默认行为（允许跳外部页面）
            e.preventDefault();
            switchTab(tab);
        });
    });

    // ---- 武器库 ----
    let currentFilter = 'all';
    let currentSearch = '';
    let currentSort = 'name';
    let currentView = 'card';   // card | table

    function getFilteredWeapons() {
        let weapons = [...WEAPONS];
        if (currentFilter === 'primary') {
            weapons = weapons.filter(w => isPrimary(w.type));
        } else if (currentFilter === 'secondary') {
            weapons = weapons.filter(w => isSecondary(w.type));
        } else if (currentFilter !== 'all') {
            weapons = weapons.filter(w => w.type === currentFilter);
        }
        if (currentSearch) {
            const q = currentSearch.toLowerCase();
            weapons = weapons.filter(w =>
                w.name.toLowerCase().includes(q) ||
                w.operators.some(op => op.toLowerCase().includes(q)) ||
                (TYPE_NAMES[w.type] || '').includes(q)
            );
        }
        weapons.sort((a, b) => {
            switch (currentSort) {
                case 'damage': return b.damage - a.damage;
                case 'rpm': return b.rpm - a.rpm;
                case 'dps': return calcDPS(b) - calcDPS(a);
                default: return a.name.localeCompare(b.name);
            }
        });
        return weapons;
    }

    // ---- 表格视图：保留武器立绘，一屏看更多行，数值等宽右对齐便于竖扫 ----
    const TABLE_COLS = [
        { key: 'name', label: '武器', sortable: true },
        { key: 'type', label: '类型', sortable: false },
        { key: 'damage', label: '伤害', sortable: true, num: true },
        { key: 'rpm', label: '射速', sortable: true, num: true },
        { key: 'mag', label: '弹匣', sortable: false, num: true },
        { key: 'dps', label: 'DPS', sortable: true, num: true },
        { key: 'ttk', label: 'TTK (s)', sortable: false, num: true, title: '击倒 100 血目标所需秒数（不含首发延迟与伤害衰减）' },
        { key: 'operators', label: '可用干员', sortable: false }
    ];

    function weaponTableHTML(weapons) {
        const dpsList = weapons.filter(w => w.rpm > 0).map(calcDPS);
        const topDPS = dpsList.length ? Math.max(...dpsList) : 0;

        const head = `<tr>${TABLE_COLS.map(c => `
            <th class="${c.num ? 'num' : ''}${currentSort === c.key ? ' sorted' : ''}"${c.sortable ? ` data-sort="${c.key}" role="button" tabindex="0"` : ''}${c.title ? ` title="${c.title}"` : ''}>
                ${c.label}${c.sortable ? '<i class="sort-arrow">↕</i>' : ''}
            </th>`).join('')}</tr>`;

        const row = w => {
            const dps = calcDPS(w);
            const ttk = calcTTK(w);
            const isTop = w.rpm > 0 && topDPS > 0 && Math.round(dps) >= Math.round(topDPS);
            const thumb = (typeof thumbImgHTML === 'function') ? thumbImgHTML(w.name, 'wt-thumb') : '';
            return `<tr class="wt-row" data-name="${w.name.replace(/'/g, "\\'")}" tabindex="0">
                <td class="wt-name">
                    ${thumb || '<i class="wt-thumb-fb">🔫</i>'}
                    <span>${esc(w.name)}</span>
                </td>
                <td><span class="weapon-type-badge ${w.type}">${TYPE_NAMES[w.type]}</span></td>
                <td class="num">${w.damage}</td>
                <td class="num">${w.rpm || '—'}</td>
                <td class="num">${w.mag}</td>
                <td class="num${isTop ? ' top' : ''}">${w.rpm > 0 ? Math.round(dps) : '—'}</td>
                <td class="num">${w.rpm > 0 && typeof ttk === 'number' ? (ttk / 1000).toFixed(2) : '—'}</td>
                <td class="wt-ops">${esc((w.operators || []).join('、'))}</td>
            </tr>`;
        };

        const renderGroup = (title, sub) => sub.length
            ? `<div class="weapon-group-title"><span>${title}</span><em>${sub.length} 把</em></div>
               <table class="weapon-table"><thead>${head}</thead><tbody>${sub.map(row).join('')}</tbody></table>`
            : '';

        if (currentFilter === 'all') {
            return renderGroup('🔫 主武器', weapons.filter(w => isPrimary(w.type)))
                + renderGroup('🔫 副武器', weapons.filter(w => isSecondary(w.type)))
                + renderGroup('🧰 其他', weapons.filter(w => !isPrimary(w.type) && !isSecondary(w.type)));
        }
        return `<table class="weapon-table"><thead>${head}</thead><tbody>${weapons.map(row).join('')}</tbody></table>`;
    }

    function bindWeaponTable(wrap) {
        wrap.querySelectorAll('.wt-row').forEach(tr => {
            const open = () => showWeaponDetail(tr.dataset.name);
            tr.addEventListener('click', open);
            tr.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
            });
        });
        wrap.querySelectorAll('th[data-sort]').forEach(th => {
            const sort = () => {
                currentSort = th.dataset.sort;
                const sel = $('#weapon-sort');
                if (sel) sel.value = currentSort;
                renderWeaponGrid();
            };
            th.addEventListener('click', sort);
            th.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sort(); }
            });
        });
    }

    function renderWeaponGrid() {
        const weapons = getFilteredWeapons();
        const grid = $('#weapon-grid');
        const tableWrap = $('#weapon-table-wrap');
        const count = $('#weapon-count');

        // 统计主副武器数量
        const primaryCount = weapons.filter(w => isPrimary(w.type)).length;
        const secondaryCount = weapons.filter(w => isSecondary(w.type)).length;
        count.textContent = `共 ${weapons.length} 把武器（主武器 ${primaryCount} / 副武器 ${secondaryCount}）`;

        if (!grid) return;
        const isTable = currentView === 'table';

        if (weapons.length === 0) {
            const empty = '<div class="empty-state">没有匹配的武器 —— 试试清空搜索词，或把筛选切回「全部」</div>';
            if (isTable && tableWrap) { tableWrap.innerHTML = empty; tableWrap.hidden = false; grid.hidden = true; }
            else { grid.innerHTML = empty; grid.hidden = false; if (tableWrap) tableWrap.hidden = true; }
            return;
        }

        if (tableWrap) {
            tableWrap.hidden = !isTable;
            grid.hidden = isTable;
            if (isTable) {
                tableWrap.innerHTML = weaponTableHTML(weapons);
                bindWeaponTable(tableWrap);
                return;
            }
            tableWrap.innerHTML = '';
        }

        // 「全部」视图下主武器 / 副武器分两个区块展示，不再混在一起
        const renderGroup = (title, sub) => sub.length
            ? `<div class="weapon-group-title"><span>${title}</span><em>${sub.length} 把</em></div>`
                + sub.map(weaponCardHTML).join('')
            : '';
        if (currentFilter === 'all') {
            grid.innerHTML = renderGroup('🔫 主武器', weapons.filter(w => isPrimary(w.type)))
                + renderGroup('🔫 副武器', weapons.filter(w => isSecondary(w.type)))
                + renderGroup('🧰 其他', weapons.filter(w => !isPrimary(w.type) && !isSecondary(w.type)));
            return;
        }

        grid.innerHTML = weapons.map(w => weaponCardHTML(w)).join('');
    }

    // 单张武器卡片
    function weaponCardHTML(w) {
        const dps = calcDPS(w);
            const ttk = calcTTK(w);
            const dpsPercent = w.rpm > 0 ? Math.round(dps / maxDPS * 100) : 0;
            const typeColor = `var(--${w.type})`;
            const category = isPrimary(w.type) ? 'primary' : 'secondary';
            const detail = (typeof WEAPON_DETAILS !== 'undefined') ? WEAPON_DETAILS[w.name] : null;

            // 配件预览标签
            const attTags = [];
            w.barrels.forEach(b => {
                const isNew = w.y7s3_new?.barrels?.includes(b);
                attTags.push(attChipHTML(b, 'barrel', { className: 'att-tag', newIn: isNew, title: `${BARREL_NAMES[b]} · 查看配件详情` }));
            });
            w.grips.forEach(g => {
                const isNew = w.y7s3_new?.grips?.includes(g);
                attTags.push(attChipHTML(g, 'grip', { className: 'att-tag', newIn: isNew, title: `${GRIP_NAMES[g]} · 查看配件详情` }));
            });
            if (w.barrels.length === 0 && w.grips.length === 0) {
                attTags.push('<span class="att-tag empty">无配件</span>');
            }

            return `
                <div class="weapon-card" data-type="${w.type}" data-category="${category}" data-name="${w.name}" onclick="showWeaponDetail('${w.name.replace(/'/g, "\\'")}')">
                    <div class="weapon-card-header">
                        <span class="weapon-name">${w.name}</span>
                        <span class="weapon-type-badge ${w.type}">${TYPE_NAMES[w.type]}</span>
                    </div>
                    ${thumbImgHTML(w.name, 'weapon-thumb') ? `<div class="weapon-thumb-row">${thumbImgHTML(w.name, 'weapon-thumb')}</div>` : ''}
                    ${detail ? `
                    <div class="weapon-real-info">
                        <span class="real-name" title="现实原型">${detail.realName}</span>
                        <span class="real-origin">${detail.country}</span>
                    </div>` : ''}
                    <div class="weapon-stats">
                        <div class="stat-item">
                            <div class="stat-value">${w.damage}</div>
                            <div class="stat-label">伤害</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${w.rpm || '—'}</div>
                            <div class="stat-label">射速</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${w.mag}</div>
                            <div class="stat-label">弹匣</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${w.rpm > 0 ? dps : '—'}</div>
                            <div class="stat-label">DPS</div>
                        </div>
                    </div>
                    ${detail && detail.caliber ? `<div class="weapon-caliber"><span>⊕</span> ${detail.caliber}</div>` : ''}
                    <div class="weapon-operators">
                        <span>干员：</span>${w.operators.map(op => {
                            const iconUrl = getOperatorIconURL(op);
                            return iconUrl
                                ? `<span class="op-chip"><img class="op-icon" src="${iconUrl}" alt="${op}" loading="lazy">${op}</span>`
                                : `<span class="op-chip">${op}</span>`;
                        }).join('')}
                    </div>
                    <div class="weapon-attachments-preview">${attTags.join('')}</div>
                    ${w.rpm > 0 ? `
                    <div class="dps-bar-container">
                        <div class="dps-bar" style="width:${dpsPercent}%;background:${typeColor}"></div>
                    </div>` : ''}
                </div>
            `;
    }

    // 筛选按钮
    $$('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.type;
            renderWeaponGrid();
        });
    });

    // 搜索框（防抖 180ms，避免每敲一键重建上百张卡片）
    let searchTimer = null;
    $('#weapon-search').addEventListener('input', e => {
        const v = e.target.value;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => { currentSearch = v; renderWeaponGrid(); }, 180);
    });

    // 排序
    $('#weapon-sort').addEventListener('change', e => {
        currentSort = e.target.value;
        renderWeaponGrid();
    });

    // 视图切换：卡片 / 表格
    $$('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentView = btn.dataset.view;
            $$('.view-btn').forEach(b => b.classList.toggle('active', b === btn));
            renderWeaponGrid();
        });
    });

    // ---- 武器详情弹窗 ----
    window.showWeaponDetail = function(name) {
        const w = WEAPONS.find(x => x.name === name);
        if (!w) return;

        const dps = calcDPS(w);
        const ttk = calcTTK(w);
        const modal = $('#weapon-modal');
        const body = $('#modal-body');
        const category = isPrimary(w.type) ? '主武器' : '副武器';
        const detail = (typeof WEAPON_DETAILS !== 'undefined') ? WEAPON_DETAILS[w.name] : null;
        const ext = (typeof WEAPON_EXTENDED !== 'undefined') ? WEAPON_EXTENDED[w.name] : null;
        const recoilURL = (typeof getWeaponRecoilURL === 'function') ? getWeaponRecoilURL(w.name) : null;

        // ADS时间
        const adsInfo = ADS_TIMES[w.type];

        // 武器档案（现实原型信息，始终显示）
        let profileHTML = '';
        if (detail) {
            profileHTML = `
            <div class="modal-section">
                <div class="modal-section-title">武器档案</div>
                <div class="weapon-profile">
                    <div class="profile-grid">
                        <div class="profile-item">
                            <div class="profile-label">现实原型</div>
                            <div class="profile-value">${detail.realName}</div>
                        </div>
                        <div class="profile-item">
                            <div class="profile-label">口径</div>
                            <div class="profile-value">${detail.caliber}</div>
                        </div>
                        <div class="profile-item">
                            <div class="profile-label">产地</div>
                            <div class="profile-value">${detail.country}</div>
                        </div>
                        <div class="profile-item">
                            <div class="profile-label">制造商</div>
                            <div class="profile-value">${detail.manufacturer}</div>
                        </div>
                    </div>
                </div>
            </div>`;
        } else {
            profileHTML = `
            <div class="modal-section">
                <div class="modal-section-title">武器档案</div>
                <div class="no-data-placeholder">暂无武器档案数据</div>
            </div>`;
        }

        // 琐事/冷知识（始终显示）
        let triviaHTML = '';
        if (detail && detail.trivia && detail.trivia.length > 0) {
            triviaHTML = `
            <div class="modal-section">
                <div class="modal-section-title">冷知识 & 琐事</div>
                <div class="trivia-list">
                    ${detail.trivia.map(t => `<div class="trivia-item"><span class="trivia-bullet">▸</span>${t}</div>`).join('')}
                </div>
            </div>`;
        } else {
            triviaHTML = `
            <div class="modal-section">
                <div class="modal-section-title">冷知识 & 琐事</div>
                <div class="no-data-placeholder">暂无冷知识数据</div>
            </div>`;
        }

        // === 后坐力模式（始终显示，无数据时提示） ===
        let recoilHTML = '';
        if (ext && ext.recoil) {
            const r = ext.recoil;
            const isHuijiRecoil = recoilURL && recoilURL.includes('huijistatic.com');
            const recoilCaption = isHuijiRecoil
                ? '▲ 无配件后坐力模式（游戏内截图，来源: 灰机wiki）'
                : '▲ 无配件后坐力散布图（来源: Fandom Wiki）';
            const recoilImgHTML = recoilURL
                ? `<div class="recoil-image-wrap">
                       <img class="recoil-image" src="${recoilURL}" alt="${w.name} 后坐力散布" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.style.display='none'">
                       <div class="recoil-image-caption">${recoilCaption}</div>
                   </div>`
                : '';
            recoilHTML = `
            <div class="modal-section">
                <div class="modal-section-title">后坐力模式</div>
                <div class="recoil-container">
                    ${recoilImgHTML}
                    <div class="recoil-bars">
                        <div class="recoil-bar-row">
                            <span class="recoil-bar-label">垂直</span>
                            <div class="recoil-bar-track">
                                <div class="recoil-bar-fill" style="width:${recoilPercent(r.vertical)};background:${RECOIL_COLORS[r.vertical] || 'var(--text-muted)'}"></div>
                            </div>
                            <span class="recoil-bar-value" style="color:${RECOIL_COLORS[r.vertical] || 'var(--text-muted)'}">${RECOIL_LABELS[r.vertical] || r.vertical}</span>
                        </div>
                        <div class="recoil-bar-row">
                            <span class="recoil-bar-label">水平</span>
                            <div class="recoil-bar-track">
                                <div class="recoil-bar-fill" style="width:${recoilPercent(r.horizontal)};background:${RECOIL_COLORS[r.horizontal] || 'var(--text-muted)'}"></div>
                            </div>
                            <span class="recoil-bar-value" style="color:${RECOIL_COLORS[r.horizontal] || 'var(--text-muted)'}">${RECOIL_LABELS[r.horizontal] || r.horizontal}</span>
                        </div>
                    </div>
                    <div class="recoil-desc">${r.pattern}</div>
                </div>
            </div>`;
        } else {
            recoilHTML = `
            <div class="modal-section">
                <div class="modal-section-title">后坐力模式</div>
                <div class="no-data-placeholder">暂无后坐力数据</div>
            </div>`;
        }

        // === 伤害衰减（始终显示，无数据时提示） ===
        let falloffHTML = '';
        if (ext && ext.falloff && ext.falloff.start > 0) {
            const f = ext.falloff;
            const hasPellets = f.pellets && f.pellets > 1;
            const pelletLabel = hasPellets ? ` ×${f.pellets}` : '';
            const totalDmg = hasPellets ? w.damage * f.pellets : w.damage;
            const totalMin = hasPellets ? f.min * f.pellets : f.min;
            // 是否有两段衰减（三段伤害）
            const hasMid = f.mid !== undefined && f.midStart !== undefined && f.midEnd !== undefined;
            const totalMid = hasMid && hasPellets ? f.mid * f.pellets : (hasMid ? f.mid : 0);

            // SVG 折线图参数
            const svgW = 460, svgH = 160, padL = 45, padR = 15, padT = 20, padB = 30;
            const chartW = svgW - padL - padR;
            const chartH = svgH - padT - padB;
            const maxDist = 50;
            const maxDmg = Math.max(w.damage, 80); // Y轴上限
            const minDmg = Math.max(0, f.min - 10);
            const dmgRange = maxDmg - minDmg;

            const xScale = d => padL + (d / maxDist) * chartW;
            const yScale = d => padT + (1 - (d - minDmg) / dmgRange) * chartH;

            // 关键点（支持两段衰减）
            let pts, xTicks, yTicks;
            if (hasMid) {
                // 三段伤害：全额 → 第一段衰减 → 中间值 → 第二段衰减 → 最低值
                pts = [
                    { x: xScale(0),         y: yScale(w.damage) },
                    { x: xScale(f.start),   y: yScale(w.damage) },
                    { x: xScale(f.midStart), y: yScale(f.mid) },
                    { x: xScale(f.midEnd),  y: yScale(f.mid) },
                    { x: xScale(f.end),     y: yScale(f.min) },
                    { x: xScale(maxDist),   y: yScale(f.min) }
                ];
                xTicks = [0, f.start, f.midStart, f.midEnd, f.end, maxDist];
                yTicks = [w.damage, f.mid, f.min];
            } else {
                // 两段伤害：全额 → 线性衰减 → 最低值
                pts = [
                    { x: xScale(0),       y: yScale(w.damage) },
                    { x: xScale(f.start), y: yScale(w.damage) },
                    { x: xScale(f.end),   y: yScale(f.min) },
                    { x: xScale(maxDist), y: yScale(f.min) }
                ];
                xTicks = [0, f.start, f.end, maxDist];
                yTicks = [w.damage, f.min];
                if (w.damage - f.min > 20) yTicks.push(Math.round((w.damage + f.min) / 2));
            }
            // 去重X轴刻度（防止重叠）
            xTicks = [...new Set(xTicks)];

            const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
            // 填充区域
            const fillPts = [...pts, { x: xScale(maxDist), y: padT + chartH }, { x: xScale(0), y: padT + chartH }];
            const fillPoly = fillPts.map(p => `${p.x},${p.y}`).join(' ');

            // 渐变色（两段衰减时中间段用黄色）
            const gradStops = hasMid
                ? `<stop offset="0%" stop-color="#66bb6a"/>
                   <stop offset="${(f.start / maxDist * 100)}%" stop-color="#66bb6a"/>
                   <stop offset="${(f.midStart / maxDist * 100)}%" stop-color="#ffa726"/>
                   <stop offset="${(f.midEnd / maxDist * 100)}%" stop-color="#ffa726"/>
                   <stop offset="${(f.end / maxDist * 100)}%" stop-color="#ef5350"/>
                   <stop offset="100%" stop-color="#ef5350"/>`
                : `<stop offset="0%" stop-color="#66bb6a"/>
                   <stop offset="${(f.start / maxDist * 100)}%" stop-color="#66bb6a"/>
                   <stop offset="${(f.end / maxDist * 100)}%" stop-color="#ef5350"/>
                   <stop offset="100%" stop-color="#ef5350"/>`;

            // 关键点圆和数值标注
            let circlesHTML, labelsHTML;
            if (hasMid) {
                circlesHTML = `
                    <circle cx="${pts[0].x}" cy="${pts[0].y}" r="4" fill="#66bb6a" stroke="#0a0e14" stroke-width="1.5"/>
                    <circle cx="${pts[1].x}" cy="${pts[1].y}" r="4" fill="#66bb6a" stroke="#0a0e14" stroke-width="1.5"/>
                    <circle cx="${pts[2].x}" cy="${pts[2].y}" r="4" fill="#ffa726" stroke="#0a0e14" stroke-width="1.5"/>
                    <circle cx="${pts[3].x}" cy="${pts[3].y}" r="4" fill="#ffa726" stroke="#0a0e14" stroke-width="1.5"/>
                    <circle cx="${pts[4].x}" cy="${pts[4].y}" r="4" fill="#ef5350" stroke="#0a0e14" stroke-width="1.5"/>
                    <circle cx="${pts[5].x}" cy="${pts[5].y}" r="4" fill="#ef5350" stroke="#0a0e14" stroke-width="1.5"/>`;
                labelsHTML = `
                    <text x="${pts[0].x + 4}" y="${pts[0].y - 8}" fill="#66bb6a" font-size="12" font-weight="700" font-family="var(--font-mono)">${w.damage}</text>
                    <text x="${pts[2].x + 4}" y="${pts[2].y - 8}" fill="#ffa726" font-size="12" font-weight="700" font-family="var(--font-mono)">${f.mid}</text>
                    <text x="${pts[4].x + 4}" y="${pts[4].y - 8}" fill="#ef5350" font-size="12" font-weight="700" font-family="var(--font-mono)">${f.min}</text>`;
            } else {
                circlesHTML = `
                    <circle cx="${pts[0].x}" cy="${pts[0].y}" r="4" fill="#66bb6a" stroke="#0a0e14" stroke-width="1.5"/>
                    <circle cx="${pts[1].x}" cy="${pts[1].y}" r="4" fill="#ffa726" stroke="#0a0e14" stroke-width="1.5"/>
                    <circle cx="${pts[2].x}" cy="${pts[2].y}" r="4" fill="#ef5350" stroke="#0a0e14" stroke-width="1.5"/>
                    <circle cx="${pts[3].x}" cy="${pts[3].y}" r="4" fill="#ef5350" stroke="#0a0e14" stroke-width="1.5"/>`;
                labelsHTML = `
                    <text x="${pts[0].x + 4}" y="${pts[0].y - 8}" fill="#66bb6a" font-size="12" font-weight="700" font-family="var(--font-mono)">${w.damage}</text>
                    <text x="${pts[2].x + 4}" y="${pts[2].y - 8}" fill="#ef5350" font-size="12" font-weight="700" font-family="var(--font-mono)">${f.min}</text>`;
            }

            // 图例
            let legendHTML;
            if (hasMid) {
                legendHTML = `
                    <span class="falloff-legend-item"><span class="falloff-dot full"></span>0–${f.start}m 全额伤害 <strong>${w.damage}${pelletLabel}</strong>${hasPellets ? ` (总计${totalDmg})` : ''}</span>
                    <span class="falloff-legend-item"><span class="falloff-dot" style="background:#ffa726"></span>${f.start}–${f.midStart}m 第一段衰减</span>
                    <span class="falloff-legend-item"><span class="falloff-dot" style="background:#ffa726"></span>${f.midStart}–${f.midEnd}m 中间伤害 <strong>${f.mid}${pelletLabel}</strong>${hasPellets ? ` (总计${totalMid})` : ''}</span>
                    <span class="falloff-legend-item"><span class="falloff-dot trans"></span>${f.midEnd}–${f.end}m 第二段衰减</span>
                    <span class="falloff-legend-item"><span class="falloff-dot min"></span>${f.end}m+ 最低伤害 <strong>${f.min}${pelletLabel}</strong>${hasPellets ? ` (总计${totalMin})` : ''}</span>`;
            } else {
                legendHTML = `
                    <span class="falloff-legend-item"><span class="falloff-dot full"></span>0–${f.start}m 全额伤害 <strong>${w.damage}${pelletLabel}</strong>${hasPellets ? ` (总计${totalDmg})` : ''}</span>
                    <span class="falloff-legend-item"><span class="falloff-dot trans"></span>${f.start}–${f.end}m 线性衰减</span>
                    <span class="falloff-legend-item"><span class="falloff-dot min"></span>${f.end}m+ 最低伤害 <strong>${f.min}${pelletLabel}</strong>${hasPellets ? ` (总计${totalMin})` : ''}</span>`;
            }

            falloffHTML = `
            <div class="modal-section">
                <div class="modal-section-title">伤害衰减${hasPellets ? ' <span style="font-size:12px;font-weight:400;color:var(--text-muted)">（每发' + f.pellets + '颗弹丸，图表显示单颗弹丸伤害）</span>' : ''}</div>
                <div class="falloff-container">
                    <div class="falloff-chart-wrap">
                        <svg viewBox="0 0 ${svgW} ${svgH}" class="falloff-svg">
                            <!-- 网格线 -->
                            ${yTicks.map(d => `<line x1="${padL}" y1="${yScale(d)}" x2="${svgW - padR}" y2="${yScale(d)}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3"/>`).join('')}
                            ${xTicks.map(d => `<line x1="${xScale(d)}" y1="${padT}" x2="${xScale(d)}" y2="${padT + chartH}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3"/>`).join('')}
                            <!-- 填充 -->
                            <polygon points="${fillPoly}" fill="url(#falloffGrad)" opacity="0.3"/>
                            <defs>
                                <linearGradient id="falloffGrad" x1="0" y1="0" x2="1" y2="0">
                                    ${gradStops}
                                </linearGradient>
                            </defs>
                            <!-- 折线 -->
                            <polyline points="${polyline}" fill="none" stroke="#4fc3f7" stroke-width="2.5" stroke-linejoin="round"/>
                            <!-- 关键点圆 -->
                            ${circlesHTML}
                            <!-- Y轴标签 -->
                            ${yTicks.map(d => `<text x="${padL - 6}" y="${yScale(d) + 4}" text-anchor="end" fill="var(--text-muted)" font-size="11" font-family="var(--font-mono)">${d}</text>`).join('')}
                            <!-- X轴标签 -->
                            ${xTicks.map(d => `<text x="${xScale(d)}" y="${padT + chartH + 16}" text-anchor="middle" fill="var(--text-muted)" font-size="11" font-family="var(--font-mono)">${d}m</text>`).join('')}
                            <!-- 关键数值标注 -->
                            ${labelsHTML}
                            <!-- 坐标轴 -->
                            <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + chartH}" stroke="var(--border-light)" stroke-width="1"/>
                            <line x1="${padL}" y1="${padT + chartH}" x2="${svgW - padR}" y2="${padT + chartH}" stroke="var(--border-light)" stroke-width="1"/>
                            <!-- 轴标题 -->
                            <text x="${padL - 6}" y="${padT - 6}" fill="var(--text-muted)" font-size="10" text-anchor="end">伤害</text>
                            <text x="${svgW - padR}" y="${padT + chartH + 16}" fill="var(--text-muted)" font-size="10" text-anchor="end">距离</text>
                        </svg>
                    </div>
                    <div class="falloff-legend">
                        ${legendHTML}
                    </div>
                    ${(ext && ext.falloffExt && ext.falloffExt.start > 0) ? `
                    <div class="falloff-ext">
                        <div class="falloff-ext-title">📏 装备延伸枪管后</div>
                        <div class="falloff-ext-body">
                            <span>0–${ext.falloffExt.start}m 全额伤害</span>
                            <span class="trans">${ext.falloffExt.start}–${ext.falloffExt.end}m 线性衰减</span>
                            <span class="min">${ext.falloffExt.end}m+ 最低 <strong>${ext.falloffExt.min}</strong></span>
                        </div>
                        <div class="falloff-ext-note">
                            对比基础衰减最低 <strong>${f.min}</strong>
                            ${ext.falloffExt.min > f.min
                                ? `，延伸枪管使远距离多保留 <strong>${ext.falloffExt.min - f.min}</strong> 点伤害`
                                : ''}
                            ；衰减起始距离不推迟。数据来源：GitHub hanslhansl 实测曲线
                        </div>
                    </div>` : ''}
                </div>
            </div>`;
        } else {
            falloffHTML = `
            <div class="modal-section">
                <div class="modal-section-title">伤害衰减</div>
                <div class="no-data-placeholder">暂无伤害衰减数据</div>
            </div>`;
        }

        // === 四类配件 ===
        // 1. 瞄准镜 —— 大类按放大倍率分组，小类按瞄具类型，再列具体型号 ICON
        let sightsHTML = '';
        if (ext && ext.sights && ext.sights.length > 0) {
            const SD = ATTACHMENT_DATA.sights;
            const groupsHTML = SIGHT_GROUPS.map(g => {
                // iron（机瞄）对所有可装瞄具的武器都可用；其余家族看武器白名单
                const fams = g.families.filter(f => f === 'iron' || ext.sights.includes(f));
                if (!fams.length) return '';
                return `
                    <div class="sight-group">
                        <div class="sight-group-head">
                            <span class="sight-group-mag">${g.icon} ${g.label}</span>
                            <span class="sight-group-desc">${g.desc}</span>
                        </div>
                        ${fams.map(f => {
                            const fam = SD[f];
                            if (!fam) return '';
                            // 家族标题也带一枚代表 ICON（取首款型号的图），与枪管/握把的 chip 视觉一致
                            const rep = (fam.variants && fam.variants[0]) ? fam.variants[0].icon : null;
                            const repIcon = (rep && String(rep).startsWith('images/'))
                                ? `<img class="att-chip-img" src="${rep}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('icon-broken');this.remove()">`
                                : `<i class="att-chip-glyph">${fam.icon || '🔭'}</i>`;
                            const head = `<span class="sight-family-name${fam.variants.length ? ' modal-att-item sight-item' : ''}"${fam.variants.length ? ` data-att-key="${f}" data-att-slot="sight"` : ''}>${repIcon}${fam.name}<em>${fam.nameEn}</em>${fam.noSlot ? '<b class="noslot">不占配件槽</b>' : ''}</span>`;
                            if (!fam.variants.length) {
                                return `<div class="sight-family">${head}</div>`;
                            }
                            return `<div class="sight-family">${head}
                                <div class="sight-variants">
                                    ${fam.variants.map(v => `
                                        <div class="sight-variant" title="${v.desc}">
                                            <img src="${v.icon}" alt="${v.name}" loading="lazy" onerror="this.style.visibility='hidden'">
                                            <span>${v.name}</span>
                                        </div>`).join('')}
                                </div>
                            </div>`;
                        }).join('')}
                    </div>`;
            }).join('');
            const noteHTML = ext.sightNote
                ? `<div class="sight-note">⚠️ ${ext.sightNote}</div>` : '';
            sightsHTML = `<div class="modal-att-group"><div class="modal-att-group-title">🔭 瞄准镜</div>${groupsHTML}${noteHTML}</div>`;
        } else if (ext && ext.specialNote) {
            sightsHTML = `<div class="modal-att-group"><div class="modal-att-group-title">🔭 瞄准镜</div><span class="modal-att-item unavailable">${ext.specialNote}</span></div>`;
        } else {
            sightsHTML = `<div class="modal-att-group"><div class="modal-att-group-title">🔭 瞄准镜</div><span class="modal-att-item unavailable">暂无数据</span></div>`;
        }

        // 2. 枪管配件
        let barrelHTML = '';
        if (w.barrels.length > 0) {
            barrelHTML = `
                <div class="modal-att-group">
                    <div class="modal-att-group-title">🔧 枪管配件</div>
                    <div class="modal-att-list">
                        ${w.barrels.map(b => {
                            const isNew = w.y7s3_new?.barrels?.includes(b);
                            return attChipHTML(b, 'barrel', { className: 'modal-att-item' + (isNew ? ' y7s3-new' : '') });
                        }).join('')}
                    </div>
                </div>
            `;
        } else {
            barrelHTML = '<div class="modal-att-group"><div class="modal-att-group-title">🔧 枪管配件</div><span class="modal-att-item unavailable">无可用枪管配件</span></div>';
        }

        // 3. 握把配件
        let gripHTML = '';
        if (w.grips.length > 0) {
            gripHTML = `
                <div class="modal-att-group">
                    <div class="modal-att-group-title">✊ 握把配件</div>
                    <div class="modal-att-list">
                        ${w.grips.map(g => {
                            const isNew = w.y7s3_new?.grips?.includes(g);
                            return attChipHTML(g, 'grip', { className: 'modal-att-item' + (isNew ? ' y7s3-new' : '') });
                        }).join('')}
                    </div>
                </div>
            `;
        } else {
            gripHTML = '<div class="modal-att-group"><div class="modal-att-group-title">✊ 握把配件</div><span class="modal-att-item unavailable">无可用握把配件</span></div>';
        }

        // 4. 下挂配件
        let underbarrelHTML = '';
        if (ext && ext.underbarrel) {
            underbarrelHTML = `
                <div class="modal-att-group">
                    <div class="modal-att-group-title">🔴 下挂配件</div>
                    <div class="modal-att-list">
                        ${attChipHTML('laser_sight', 'underbarrel', { className: 'modal-att-item' })}
                    </div>
                </div>
            `;
        } else if (ext) {
            underbarrelHTML = '<div class="modal-att-group"><div class="modal-att-group-title">🔴 下挂配件</div><span class="modal-att-item unavailable">无下挂配件</span></div>';
        } else {
            underbarrelHTML = '<div class="modal-att-group"><div class="modal-att-group-title">🔴 下挂配件</div><span class="modal-att-item unavailable">暂无数据</span></div>';
        }

        // 配件效果面板（默认隐藏，点击配件时展开）
        const effectsPanelHTML = '<div id="att-effect-panel" class="att-effect-panel" style="display:none"></div>';

        body.innerHTML = `
            ${thumbImgHTML(w.name, '') ? `<div class="modal-weapon-image">${thumbImgHTML(w.name, '')}</div>` : ''}
            <div class="modal-weapon-name">${w.name}</div>
            <div class="modal-weapon-type">${category} · ${TYPE_NAMES[w.type]}${w.notes ? ' · ' + w.notes : ''}</div>
            ${detail ? `<div class="modal-weapon-real">${detail.realName} · ${detail.country}</div>` : ''}

            <div class="modal-stats-grid">
                <div class="modal-stat">
                    <div class="modal-stat-value" style="color:var(--${w.type})">${w.damage}</div>
                    <div class="modal-stat-label">伤害</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value">${w.rpm || '—'}</div>
                    <div class="modal-stat-label">射速 RPM</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value">${w.rpm > 0 ? dps : '—'}</div>
                    <div class="modal-stat-label">DPS</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value">${w.rpm > 0 ? ttk + 'ms' : '—'}</div>
                    <div class="modal-stat-label">TTK</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value">${w.mag}</div>
                    <div class="modal-stat-label">弹匣容量</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value">${adsInfo ? adsInfo.base + 'ms' : '—'}</div>
                    <div class="modal-stat-label">ADS 时间</div>
                </div>
                ${ext ? `
                <div class="modal-stat">
                    <div class="modal-stat-value">${ext.mobility}</div>
                    <div class="modal-stat-label">机动性</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value" style="font-size:14px">${ext.reloadTactical}s / ${ext.reloadEmpty}s</div>
                    <div class="modal-stat-label">换弹 (战术/空仓)</div>
                </div>
                ` : `
                <div class="modal-stat">
                    <div class="modal-stat-value" style="color:var(--text-muted)">—</div>
                    <div class="modal-stat-label">机动性</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value" style="color:var(--text-muted)">—</div>
                    <div class="modal-stat-label">换弹 (战术/空仓)</div>
                </div>
                `}
                <div class="modal-stat">
                    <div class="modal-stat-value" style="font-size:13px">${detail ? detail.caliber : '<span style="color:var(--text-muted)">—</span>'}</div>
                    <div class="modal-stat-label">口径</div>
                </div>
            </div>

            ${recoilHTML}

            ${falloffHTML}

            ${profileHTML}

            <div class="modal-section">
                <div class="modal-section-title">使用干员 <span style="font-size:11px;color:var(--text-muted);font-weight:400">点击查看干员档案</span></div>
                <div class="modal-operators">
                    ${w.operators.map(op => {
                        const side = w.side === 'atk' ? 'atk' : w.side === 'def' ? 'def' : 'atk';
                        const iconUrl = getOperatorIconURL(op);
                        const iconHTML = iconUrl ? `<img class="modal-op-icon" src="${iconUrl}" alt="${op}" loading="lazy">` : '';
                        return `<span class="modal-op-tag ${side}" style="cursor:pointer" data-op-name="${op.replace(/'/g, "\\'")}">${iconHTML}${op}</span>`;
                    }).join('')}
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-title">可用配件 <span style="font-size:11px;color:var(--accent);font-weight:400">★ = Y7S3新增 · 点击配件查看效果</span></div>
                ${sightsHTML}
                ${barrelHTML}
                ${gripHTML}
                ${underbarrelHTML}
                ${effectsPanelHTML}
            </div>

            ${w.mag > 0 && w.rpm > 0 ? `
            <div class="modal-section">
                <div class="modal-section-title">衍生数据</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
                    <div style="padding:10px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid var(--border);text-align:center">
                        <div style="font-size:16px;font-weight:700;font-family:var(--font-mono)">${Math.ceil(100/w.damage)}</div>
                        <div style="font-size:10px;color:var(--text-muted)">击杀子弹数 (1甲)</div>
                    </div>
                    <div style="padding:10px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid var(--border);text-align:center">
                        <div style="font-size:16px;font-weight:700;font-family:var(--font-mono)">${Math.ceil(100/(w.damage*0.9))}</div>
                        <div style="font-size:10px;color:var(--text-muted)">击杀子弹数 (2甲)</div>
                    </div>
                    <div style="padding:10px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid var(--border);text-align:center">
                        <div style="font-size:16px;font-weight:700;font-family:var(--font-mono)">${Math.ceil(100/(w.damage*0.8))}</div>
                        <div style="font-size:10px;color:var(--text-muted)">击杀子弹数 (3甲)</div>
                    </div>
                </div>
            </div>` : `
            <div class="modal-section">
                <div class="modal-section-title">衍生数据</div>
                <div class="no-data-placeholder">该武器类型不适用自动射击衍生数据</div>
            </div>`}

            ${triviaHTML}
        `;

        // 干员点击事件绑定 → 跳转干员档案
        if (typeof OPERATORS !== 'undefined' && typeof openOperatorModal === 'function') {
            body.querySelectorAll('.modal-op-tag[data-op-name]').forEach(el => {
                el.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (OPERATORS.find(o => o.name === this.dataset.opName)) {
                        $('#weapon-modal').classList.remove('active');
                        openOperatorModal(this.dataset.opName);
                    }
                });
            });
        }

        // 配件点击事件绑定
        body.querySelectorAll('.modal-att-item[data-att-key]').forEach(el => {
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                const key = this.dataset.attKey;
                const slot = this.dataset.attSlot;
                const panel = body.querySelector('#att-effect-panel');

                // 切换高亮
                body.querySelectorAll('.modal-att-item').forEach(i => i.classList.remove('att-selected'));
                this.classList.add('att-selected');

                // 查找配件数据
                let att = null;
                if (slot === 'barrel') att = ATTACHMENT_DATA.barrels[key];
                else if (slot === 'grip') att = ATTACHMENT_DATA.grips[key];
                else if (slot === 'underbarrel') att = ATTACHMENT_DATA.underbarrel[key];
                else if (slot === 'sight') att = ATTACHMENT_DATA.sights ? ATTACHMENT_DATA.sights[key] : null;

                if (!att) { panel.style.display = 'none'; return; }

                panel.style.display = 'block';
                panel.innerHTML = `
                    <div class="att-effect-header">
                        <span class="att-effect-icon">${att.icon}</span>
                        <span class="att-effect-name">${att.name}</span>
                        <span class="att-effect-name-en">${att.nameEn}</span>
                    </div>
                    <div class="att-effect-body">
                        ${att.effects.map(ef => `
                            <div class="att-effect-row ${ef.type}">
                                <span class="att-effect-val">${ef.value}</span>
                                <span>${ef.label}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="att-effect-desc">${att.description}</div>
                    ${att.bestFor ? `<div class="att-effect-best">适用：${att.bestFor}</div>` : ''}
                `;

                // 滚动到面板
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });

        openDrawer(modal);
    };

    // 后坐力百分比工具函数
    function recoilPercent(level) {
        const map = { 'very_low': '15%', 'low': '30%', 'medium': '55%', 'high': '75%', 'very_high': '95%', 'n/a': '0%' };
        return map[level] || '50%';
    }

    // ---- 统一抽屉控制 ----
    // 武器 / 干员 / 配件三个二级详情共用同一套开关：滚动锁 + 焦点进入 + 关闭后焦点归位
    let drawerReturnFocus = null;

    function openDrawer(modalEl) {
        if (!modalEl) return;
        drawerReturnFocus = document.activeElement;
        modalEl.classList.add('active');
        modalEl.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        const content = modalEl.querySelector('.modal-content');
        if (content) content.scrollTop = 0;
        const btn = modalEl.querySelector('.modal-close');
        if (btn) btn.focus();
    }

    function closeDrawer(modalEl, keepFocus) {
        if (!modalEl) return;
        modalEl.classList.remove('active');
        modalEl.setAttribute('aria-hidden', 'true');
        if (!$$('.modal.active').length) document.body.classList.remove('modal-open');
        if (!keepFocus) {
            if (drawerReturnFocus && typeof drawerReturnFocus.focus === 'function') {
                drawerReturnFocus.focus();
            }
            drawerReturnFocus = null;
        }
    }

    $$('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => closeDrawer(btn.closest('.modal')));
    });
    $$('.modal-overlay').forEach(ov => {
        ov.addEventListener('click', () => closeDrawer(ov.closest('.modal')));
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') $$('.modal.active').forEach(closeDrawer);
    });

    // ---- 配件图鉴 ----
    // 结构：槽位大类（按游戏内军械库分类）→ 瞄具再按倍率分组 → 每款配件/每个瞄具型号一张卡片
    const ATTACHMENT_INDEX = {};   // key -> { ...att, kind, slot, variants? }  供详情弹窗查询

    function buildAttachmentIndex() {
        const S = ATTACHMENT_DATA.sights || {};
        // 瞄具：每个型号单独一条（倍率分组在渲染时处理）
        for (const fk in S) {
            const fam = S[fk];
            if (!fam.variants || !fam.variants.length) {
                ATTACHMENT_INDEX[fk] = { ...fam, _key: fk, _kind: 'sight', _famKey: fk, _famName: fam.name };
                continue;
            }
            fam.variants.forEach(v => {
                ATTACHMENT_INDEX[v.key] = {
                    ...fam, _key: v.key, _kind: 'sight', _famKey: fk, _famName: fam.name,
                    _variant: v, name: v.name, nameEn: v.nameEn, icon: v.icon, image: v.icon
                };
            });
        }
        for (const k in ATTACHMENT_DATA.barrels)
            ATTACHMENT_INDEX[k] = { ...ATTACHMENT_DATA.barrels[k], _key: k, _kind: 'barrel' };
        for (const k in ATTACHMENT_DATA.grips)
            ATTACHMENT_INDEX[k] = { ...ATTACHMENT_DATA.grips[k], _key: k, _kind: 'grip' };
        for (const k in ATTACHMENT_DATA.underbarrel)
            ATTACHMENT_INDEX[k] = { ...ATTACHMENT_DATA.underbarrel[k], _key: k, _kind: 'underbarrel' };
    }

    // ---- 统一配件视觉组件 ----
    // 站内所有出现配件名的地方（武器卡 / 武器详情 / 配件图鉴）都走这里，保证「图标 + 名称」一致
    function attRecord(key, kind) {
        if (kind === 'sight') return ATTACHMENT_INDEX[key] || null;
        if (kind === 'barrel') return ATTACHMENT_DATA.barrels[key] || null;
        if (kind === 'grip') return ATTACHMENT_DATA.grips[key] || null;
        if (kind === 'underbarrel') return ATTACHMENT_DATA.underbarrel[key] || null;
        return null;
    }

    function attIconURL(key, kind) {
        const a = attRecord(key, kind);
        if (!a) return null;
        const img = a.image || (a._variant && a._variant.icon);
        return (typeof img === 'string' && img.startsWith('images/')) ? img : null;
    }

    // 无官方 ICON 时的统一占位：用配件自己的 emoji，样式与有图时对齐，不再出现裸文字
    function attGlyph(key, kind) {
        const a = attRecord(key, kind);
        if (a && a.icon && !String(a.icon).startsWith('images/')) return a.icon;
        return { sight: '🔭', barrel: '🔧', grip: '✊', underbarrel: '🔴' }[kind] || '▪';
    }

    function attChipHTML(key, kind, opts) {
        const o = opts || {};
        const a = attRecord(key, kind);
        const name = o.label || (a ? a.name : key);
        const url = attIconURL(key, kind);
        const cls = ['att-chip'];
        if (o.className) cls.push(o.className);
        if (o.newIn) cls.push('new');
        if (!url) cls.push('no-icon');
        // 图标与占位符始终同时输出：有图时占位符隐藏，图片加载失败则移除 img 让占位符顶上
        const visual = (url
            ? `<img class="att-chip-img" src="${url}" alt="${esc(name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('icon-broken');this.remove()">`
            : '')
            + `<i class="att-chip-glyph">${attGlyph(key, kind)}</i>`;
        const attrs = [
            `class="${cls.join(' ')}"`,
            `data-att-key="${key}"`,
            `data-att-slot="${kind}"`,
            o.title !== false ? `title="${esc(typeof o.title === 'string' ? o.title : name + ' · 点击查看效果')}"` : '',
            o.disabled ? '' : 'role="button" tabindex="0"'
        ].filter(Boolean).join(' ');
        return `<span ${attrs}>${visual}<span class="att-chip-name">${esc(name)}</span></span>`;
    }

    // 统计可用某配件的武器数
    function countWeaponsWith(key, kind) {
        if (!WEAPON_EXTENDED) return 0;
        if (kind === 'sight') {
            const fam = ATTACHMENT_INDEX[key]._famKey;
            if (fam === 'iron') {
                return Object.values(WEAPON_EXTENDED).filter(e => e.sights && e.sights.length).length;
            }
            return Object.values(WEAPON_EXTENDED).filter(e => e.sights && e.sights.includes(fam)).length;
        }
        if (kind === 'barrel') return WEAPONS.filter(w => w.barrels.includes(key)).length;
        if (kind === 'grip') return WEAPONS.filter(w => w.grips.includes(key)).length;
        return Object.values(WEAPON_EXTENDED).filter(e => e.underbarrel).length;
    }

    function attCardHTML(a) {
        const changeBadge = a.newIn ? `<b class="att-flag new">${a.newIn} 新增</b>`
            : a.changedIn ? `<b class="att-flag chg">${a.changedIn} 改</b>` : '';
        const visual = a.image
            ? `<img class="att-card-img" src="${a.image}" alt="${a.name}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'att-card-fallback',textContent:'${a._famName ? a._famName[0] : a.icon}'}))">`
            : `<div class="att-card-fallback" title="暂无官方图标素材">${a.icon}</div>`;
        const sub = a._variant ? `<span class="att-card-mag">${a.magGroup}</span>`
            : `<span class="att-card-count">${countWeaponsWith(a._key, a._kind)} 把武器可用</span>`;
        return `
            <div class="att-card" data-att-key="${a._key}" tabindex="0" role="button">
                <div class="att-card-visual">${visual}</div>
                <div class="att-card-name">${a.name}${changeBadge}</div>
                <div class="att-card-name-en">${a.nameEn}${a._famName ? ' · ' + a._famName : ''}</div>
                <div class="att-card-foot">${sub}</div>
            </div>`;
    }

    // 专属 / 内置瞄具：不走配件系统，原独立页 sights-preview.html 已并入此处
    function specialSightsHTML() {
        if (typeof SPECIAL_SIGHTS === 'undefined' || !SPECIAL_SIGHTS.length) return '';
        const cards = SPECIAL_SIGHTS.map((s, i) => `
            <div class="att-card special" data-special-sight="${i}" tabindex="0" role="button">
                <div class="att-card-visual"><div class="att-card-fallback">🔒</div></div>
                <div class="att-card-name">${esc(s.name)}</div>
                <div class="att-card-name-en">${esc(s.nameEn)}</div>
                <div class="att-card-foot"><span class="att-card-count">${esc(s.weapon)}</span></div>
            </div>`).join('');
        return `
            <div class="att-slot-section">
                <div class="att-slot-head">
                    <span class="att-slot-icon">🔒</span>
                    <span class="att-slot-name">专属 / 内置瞄具</span>
                    <span class="att-slot-en">Exclusive Sights</span>
                </div>
                <div class="att-slot-desc">以下 ${SPECIAL_SIGHTS.length} 款不走军械库配件系统：或为武器内置、或属干员技能，均不可卸换。点击查看说明。</div>
                <div class="att-card-grid">${cards}</div>
            </div>`;
    }

    function openSpecialSight(idx) {
        const s = (typeof SPECIAL_SIGHTS !== 'undefined') ? SPECIAL_SIGHTS[Number(idx)] : null;
        const modal = $('#info-modal');
        if (!s || !modal) return;
        $('#info-modal-body').innerHTML = `
            <div class="att-detail-head">
                <div class="att-detail-visual"><div class="att-detail-fallback">🔒</div></div>
                <div class="att-detail-meta">
                    <div class="att-detail-name">${esc(s.name)}</div>
                    <div class="att-detail-en">${esc(s.nameEn)}</div>
                    <div class="att-detail-tags">
                        <span class="att-detail-slot">🔒 专属 / 内置</span>
                    </div>
                </div>
            </div>
            <div class="att-detail-section-title">绑定武器 / 干员</div>
            <div class="att-detail-weapons">
                <span class="att-weapon-chip" data-weapon="${esc(s.weapon)}">${esc(s.weapon)}</span>
                ${(s.operators || []).map(n => `<span class="att-weapon-chip">${esc(n)}</span>`).join('')}
            </div>
            <div class="att-detail-section-title">说明</div>
            <div class="att-detail-desc op-prose">${esc(s.desc)}</div>
        `;
        openDrawer(modal);
    }

    function renderAttachmentCards() {
        const container = $('#attachment-cards');
        buildAttachmentIndex();
        const S = ATTACHMENT_DATA.sights || {};

        container.innerHTML = ATTACHMENT_SLOTS.map(slot => {
            let inner = '';
            if (slot.key === 'sight') {
                inner = SIGHT_GROUPS.map(g => {
                    const fams = g.families.filter(f => S[f]);
                    if (!fams.length) return '';
                    const cards = fams.map(f => {
                        const fam = S[f];
                        if (!fam.variants || !fam.variants.length) {
                            return attCardHTML({ ...fam, _key: f, _kind: 'sight', _famKey: f });
                        }
                        return fam.variants.map(v => attCardHTML(ATTACHMENT_INDEX[v.key])).join('');
                    }).join('');
                    return `
                        <div class="att-mag-group">
                            <div class="att-mag-group-head">
                                <span class="att-mag-group-title">${g.icon} ${g.label}</span>
                                <span class="att-mag-group-desc">${g.desc}</span>
                            </div>
                            <div class="att-card-grid">${cards}</div>
                        </div>`;
                }).join('');
            } else {
                const src = slot.key === 'barrel' ? ATTACHMENT_DATA.barrels
                    : slot.key === 'grip' ? ATTACHMENT_DATA.grips
                        : ATTACHMENT_DATA.underbarrel;
                inner = `<div class="att-card-grid">${
                    Object.keys(src).map(k => attCardHTML(ATTACHMENT_INDEX[k])).join('')
                }</div>`;
            }
            return `
                <div class="att-slot-section">
                    <div class="att-slot-head">
                        <span class="att-slot-icon">${slot.icon}</span>
                        <span class="att-slot-name">${slot.name}</span>
                        <span class="att-slot-en">${slot.nameEn}</span>
                    </div>
                    <div class="att-slot-desc">${slot.desc}</div>
                    ${inner}
                </div>`;
        }).join('') + specialSightsHTML();

        container.querySelectorAll('.att-card').forEach(card => {
            const open = () => {
                if (card.dataset.specialSight !== undefined) openSpecialSight(card.dataset.specialSight);
                else if (card.dataset.attKey) openAttachmentModal(card.dataset.attKey);
            };
            card.addEventListener('click', open);
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
            });
        });
    }

    // ---- 配件详情弹窗 ----
    function openAttachmentModal(key) {
        const a = ATTACHMENT_INDEX[key];
        const modal = $('#attachment-modal');
        if (!a || !modal) return;

        const slot = ATTACHMENT_SLOTS.find(s => s.key === a._kind) || {};
        const weapons = (() => {
            if (a._kind === 'sight') {
                if (a._famKey === 'iron') {
                    return Object.keys(WEAPON_EXTENDED).filter(n => WEAPON_EXTENDED[n].sights?.length);
                }
                return Object.keys(WEAPON_EXTENDED).filter(n => WEAPON_EXTENDED[n].sights?.includes(a._famKey));
            }
            if (a._kind === 'barrel') return WEAPONS.filter(w => w.barrels.includes(key)).map(w => w.name);
            if (a._kind === 'grip') return WEAPONS.filter(w => w.grips.includes(key)).map(w => w.name);
            return Object.keys(WEAPON_EXTENDED).filter(n => WEAPON_EXTENDED[n].underbarrel);
        })();

        const visual = a.image
            ? `<img class="att-detail-img" src="${a.image}" alt="${a.name}">`
            : `<div class="att-detail-fallback">${a.icon}</div>`;

        $('#attachment-modal-body').innerHTML = `
            <div class="att-detail-head">
                <div class="att-detail-visual">${visual}</div>
                <div class="att-detail-meta">
                    <div class="att-detail-name">${a.name}</div>
                    <div class="att-detail-en">${a.nameEn}</div>
                    <div class="att-detail-tags">
                        <span class="att-detail-slot">${slot.icon} ${slot.name}</span>
                        ${a.magGroup ? `<span class="att-detail-mag">${a.magGroup}</span>` : ''}
                        ${a._famName ? `<span class="att-detail-fam">${a._famName}</span>` : ''}
                        ${a.newIn ? `<span class="att-flag new">${a.newIn} 新增</span>` : ''}
                        ${a.changedIn ? `<span class="att-flag chg">${a.changedIn} 改动</span>` : ''}
                    </div>
                </div>
            </div>
            ${a._variant ? `<div class="att-detail-desc"><strong>外观：</strong>${a._variant.desc}</div>` : ''}
            <div class="att-detail-section-title">属性效果</div>
            <div class="att-effects">
                ${a.effects.map(e => `
                    <div class="att-effect ${e.type}">
                        <span class="att-effect-value">${e.value}</span>
                        <span>${e.label}</span>
                    </div>`).join('')}
            </div>
            ${a.description ? `<div class="att-detail-desc">${a.description}</div>` : ''}
            ${a.bestFor ? `<div class="att-detail-best">适用：${a.bestFor}</div>` : ''}
            ${a.noSlot ? `<div class="att-detail-note">▫️ 不占用配件槽，为武器默认状态</div>` : ''}
            ${a._famKey === 'magnified' ? `<div class="att-detail-note">📋 防守方可用的武器与干员：${Object.entries(DEF_MAGNIFIED_WHITELIST).map(([w, ops]) => `${w}(${ops.join('/')})`).join('、')}</div>` : ''}
            ${a._famKey === 'telescopic' ? `<div class="att-detail-note">📋 仅进攻方射手步枪（DMR）可装备</div>` : ''}
            <div class="att-detail-section-title">适用武器 · ${weapons.length} 把</div>
            <div class="att-detail-weapons">${weapons.map(w => `<span class="att-weapon-chip">${w}</span>`).join('')}</div>
            ${!a.image ? `<div class="att-detail-note muted">⚠️ 该配件暂无官方图标素材，当前以文字符号占位（瞄具的 15 款 ICON 已取自游戏内军械库原生截图）</div>` : ''}
        `;
        openDrawer(modal);
    }

    // 配件兼容性查询
    function initCompatQuery() {
        const slotSelect = $('#compat-slot');
        const attSelect = $('#compat-attachment');
        const results = $('#compat-results');

        function updateAttOptions() {
            const slot = slotSelect.value;
            let source;
            if (slot === 'barrel') source = BARREL_NAMES;
            else if (slot === 'grip') source = GRIP_NAMES;
            else if (slot === 'sight') source = SIGHT_NAMES;
            else source = { laser_sight: '激光瞄准器' };

            attSelect.innerHTML = Object.entries(source).map(([k, v]) =>
                `<option value="${k}">${v}</option>`
            ).join('');
            updateResults();
        }

        function updateResults() {
            const slot = slotSelect.value;
            const att = attSelect.value;
            let matched;

            if (slot === 'barrel') {
                matched = WEAPONS.filter(w => w.barrels.includes(att));
            } else if (slot === 'grip') {
                matched = WEAPONS.filter(w => w.grips.includes(att));
            } else if (slot === 'sight') {
                matched = WEAPONS.filter(w => {
                    const ext = (typeof WEAPON_EXTENDED !== 'undefined') ? WEAPON_EXTENDED[w.name] : null;
                    if (!ext || !ext.sights || !ext.sights.length) return false;
                    // 机瞄是默认状态，不存于 sights 数组：凡能装瞄具的武器都可用机瞄
                    if (att === 'iron') return true;
                    return ext.sights.includes(att);
                });
            } else {
                // underbarrel
                matched = WEAPONS.filter(w => {
                    const ext = (typeof WEAPON_EXTENDED !== 'undefined') ? WEAPON_EXTENDED[w.name] : null;
                    return ext && ext.underbarrel;
                });
            }

            if (matched.length === 0) {
                results.innerHTML = '<div style="padding:24px;color:var(--text-muted)">没有武器可以装备此配件</div>';
                return;
            }

            // 按主副武器分组显示
            const primary = matched.filter(w => isPrimary(w.type));
            const secondary = matched.filter(w => isSecondary(w.type));

            let html = '';
            if (primary.length > 0) {
                html += '<div class="compat-group-label">主武器</div>';
                html += primary.map(w => renderCompatItem(w, slot, att)).join('');
            }
            if (secondary.length > 0) {
                html += '<div class="compat-group-label">副武器</div>';
                html += secondary.map(w => renderCompatItem(w, slot, att)).join('');
            }

            results.innerHTML = html;
        }

        function renderCompatItem(w, slot, att) {
            const isNew = slot === 'barrel'
                ? w.y7s3_new?.barrels?.includes(att)
                : w.y7s3_new?.grips?.includes(att);
            const dotColor = `var(--${w.type})`;
            return `
                <div class="compat-item" style="cursor:pointer" onclick="showWeaponDetail('${w.name.replace(/'/g, "\\'")}')">
                    <span class="weapon-type-dot" style="background:${dotColor}"></span>
                    <span style="font-weight:500">${w.name}</span>
                    <span style="font-size:11px;color:var(--text-muted);margin-left:auto">${TYPE_NAMES[w.type]}</span>
                    ${isNew ? '<span style="font-size:10px;color:var(--accent)">★Y7S3</span>' : ''}
                </div>
            `;
        }

        slotSelect.addEventListener('change', updateAttOptions);
        attSelect.addEventListener('change', updateResults);
        updateAttOptions();
    }

    // ---- 对比工具 ----
    function initCompare() {
        const selects = $$('.compare-select');
        // 分组显示：主武器在前，副武器在后
        const primaryWeapons = WEAPONS.filter(w => isPrimary(w.type)).sort((a, b) => a.name.localeCompare(b.name));
        const secondaryWeapons = WEAPONS.filter(w => isSecondary(w.type)).sort((a, b) => a.name.localeCompare(b.name));

        selects.forEach(sel => {
            sel.innerHTML = '<option value="">选择武器...</option>' +
                '<optgroup label="━━ 主武器 ━━">' +
                primaryWeapons.map(w => `<option value="${w.name}">${w.name} (${TYPE_NAMES[w.type]})</option>`).join('') +
                '</optgroup>' +
                '<optgroup label="━━ 副武器 ━━">' +
                secondaryWeapons.map(w => `<option value="${w.name}">${w.name} (${TYPE_NAMES[w.type]})</option>`).join('') +
                '</optgroup>';
            sel.addEventListener('change', renderCompareTable);
        });
    }

    function renderCompareTable() {
        const selects = $$('.compare-select');
        const selected = [...selects].map(s => WEAPONS.find(w => w.name === s.value)).filter(Boolean);
        const container = $('#compare-table');

        if (selected.length < 2) {
            container.innerHTML = '<div style="padding:48px;text-align:center;color:var(--text-muted)">请至少选择2把武器进行对比</div>';
            return;
        }

        const rows = [
            { label: '分类', key: 'category', format: w => (isPrimary(w.type) ? '主武器' : '副武器') },
            { label: '类型', key: 'type', format: w => TYPE_NAMES[w.type] },
            { label: '伤害', key: 'damage', higher: true },
            { label: '射速 (RPM)', key: 'rpm', higher: true },
            { label: '弹匣', key: 'mag', higher: true },
            { label: 'DPS', key: 'dps', compute: calcDPS, higher: true },
            { label: 'TTK (ms)', key: 'ttk', compute: calcTTK, higher: false },
            { label: '击杀子弹数 (1甲)', key: 'stk1', compute: w => Math.ceil(100/w.damage), higher: false },
            { label: '击杀子弹数 (2甲)', key: 'stk2', compute: w => Math.ceil(100/(w.damage*0.9)), higher: false },
            { label: '击杀子弹数 (3甲)', key: 'stk3', compute: w => Math.ceil(100/(w.damage*0.8)), higher: false },
            { label: '干员', key: 'operators', format: w => w.operators.map(op => {
                const iconUrl = getOperatorIconURL(op);
                return iconUrl
                    ? `<span class="op-chip"><img class="op-icon" src="${iconUrl}" alt="${op}" loading="lazy">${op}</span>`
                    : `<span class="op-chip">${op}</span>`;
            }).join(' ') },
            { label: '枪管配件', key: 'barrels', format: w => w.barrels.length > 0 ? w.barrels.map(b => BARREL_NAMES[b]).join(', ') : '无' },
            { label: '握把配件', key: 'grips', format: w => w.grips.length > 0 ? w.grips.map(g => GRIP_NAMES[g]).join(', ') : '无' }
        ];

        let html = '<table><thead><tr><th>属性</th>';
        selected.forEach(w => {
            html += `<th style="color:var(--${w.type})">${w.name}</th>`;
        });
        html += '</tr></thead><tbody>';

        rows.forEach(row => {
            html += `<tr><td class="row-label">${row.label}</td>`;
            const values = selected.map(w => {
                if (row.format) return { raw: row.format(w), display: row.format(w) };
                if (row.compute) {
                    const v = row.compute(w);
                    return { raw: typeof v === 'number' ? v : 0, display: v };
                }
                return { raw: w[row.key], display: w[row.key] };
            });

            // 找最优值
            if (row.higher !== undefined && values.every(v => typeof v.raw === 'number')) {
                const nums = values.map(v => v.raw);
                const best = row.higher ? Math.max(...nums) : Math.min(...nums);
                values.forEach(v => {
                    const cls = v.raw === best ? 'best-value' : '';
                    html += `<td class="${cls}" style="font-family:var(--font-mono)">${v.display}</td>`;
                });
            } else {
                values.forEach(v => {
                    html += `<td>${v.display}</td>`;
                });
            }
            html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    // ---- 官方更新 ----
    function renderUpdates() {
        const feed = $('#updates-feed');
        feed.innerHTML = UPDATES.map(u => `
            <div class="update-card">
                <div class="update-header">
                    <span class="update-badge ${u.type}">${
                        u.type === 'patch' ? '版本更新' :
                        u.type === 'designer' ? '设计师笔记' :
                        u.type === 'balance' ? '平衡调整' : '活动'
                    }</span>
                    <span class="update-date">${u.date}</span>
                </div>
                <div class="update-title">${u.title}</div>
                <div class="update-content">${u.content}</div>
                <a href="${u.link}" target="_blank" class="update-link">查看官方原文 →</a>
            </div>
        `).join('');
    }

    // ============================================================
    //                        干 员 页 签
    // ============================================================
    const SPEED_LABEL = { fast: '3 速', medium: '2 速', slow: '1 速' };
    const DIFF_LABEL = { easy: '简单', normal: '普通', hard: '困难' };
    const COUNTRY_FLAG = {
        us: '🇺🇸', gb: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', ru: '🇷🇺', ca: '🇨🇦', br: '🇧🇷',
        jp: '🇯🇵', kr: '🇰🇷', cn: '🇨🇳', au: '🇦🇺', nl: '🇳🇱', pl: '🇵🇱', se: '🇸🇪',
        no: '🇳🇴', dk: '🇩🇰', fi: '🇫🇮', in: '🇮🇳', il: '🇮🇱', es: '🇪🇸', it: '🇮🇹',
        mx: '🇲🇽', za: '🇿🇦', eg: '🇪🇬', ie: '🇮🇪', ch: '🇨🇭', at: '🇦🇹', be: '🇧🇪',
        pt: '🇵🇹', tr: '🇹🇷', ua: '🇺🇦', sg: '🇸🇬', my: '🇲🇾', th: '🇹🇭', id: '🇮🇩',
        ph: '🇵🇭', nz: '🇳🇿', ar: '🇦🇷', cl: '🇨🇱', co: '🇨🇴', pe: '🇵🇪'
    };

    const opState = { side: 'all', q: '' };

    // ---- 组织徽章（自制 SVG：缩写 + 所属国主色，无外部依赖）----
    const ORG_COLOR_BY_CODE = {
        us: '#4A7FE0', gb: '#3D6FD1', fr: '#4E86DB', de: '#E2483D', ru: '#E2544A',
        ca: '#E0453F', br: '#21A85C', jp: '#D9534F', kr: '#D9534F', cn: '#D9534F',
        au: '#3F6FCB', nl: '#D8544F', pl: '#E2483D', se: '#4A86D8', no: '#D9534F',
        dk: '#E2483D', fi: '#4A86D8', in: '#F0A03C', il: '#4A86D8', es: '#D9534F',
        it: '#3FA35C', mx: '#2E9E63', za: '#2E9E63', eg: '#D9534F', ie: '#3FA35C',
        ch: '#E2483D', at: '#E2483D', be: '#E8C33A', pt: '#3FA35C', tr: '#E2483D',
        ua: '#4A86D8', sg: '#E2483D', my: '#4A86D8', th: '#4A86D8', id: '#E2483D',
        ph: '#4A86D8', nz: '#4A86D8', ar: '#6FA8E0', cl: '#E2483D', co: '#E8C33A',
        pe: '#E2483D', hk: '#D9534F', ma: '#D9534F', gr: '#4A86D8'
    };
    const ORG_COLOR_DEFAULT = '#8B93A7';
    const ORG_BADGE = {
        '707th SMB': { abbr: '707' },
        'AFEAU': { abbr: 'AFU' },
        'APCA': { abbr: 'APCA' },
        'BOPE': { abbr: 'BOPE' },
        'Belgian Special Forces Group (B-SFG)': { abbr: 'SFG' },
        'COT': { abbr: 'COT' },
        'FES': { abbr: 'FES' },
        'G.E.O.': { abbr: 'GEO' },
        'G.I.S': { abbr: 'GIS' },
        'GIGN': { abbr: 'GIGN' },
        'GIGN CBRN': { abbr: 'CBRN', color: '#7FD1A8' },
        'GIGR': { abbr: 'GIGR' },
        'GROM': { abbr: 'GROM' },
        'GSG 9': { abbr: 'GSG9' },
        'Garda Emergency Response Unit': { abbr: 'ERU' },
        'Hellenic Armed Forces': { abbr: 'HAF' },
        'ITF': { abbr: 'ITF' },
        'JTF2': { abbr: 'JTF2' },
        'Jægerkorpset': { abbr: 'JGK' },
        'MPS GSUTR': { abbr: 'MPS' },
        'NAVY SEAL': { abbr: 'SEAL' },
        'NDU': { abbr: 'NDU' },
        'NIGHTHAVEN': { abbr: 'NH', color: '#F0A03C' },
        'REU': { abbr: 'REU' },
        'ROS': { abbr: 'ROS', color: '#7D8AA5' },
        'S.A.S.': { abbr: 'SAS' },
        'S.A.T.': { abbr: 'SAT' },
        'S.D.U.': { abbr: 'SDU' },
        'SASR': { abbr: 'SASR' },
        'STAR-NET Aviation': { abbr: 'SNA' },
        'SWAT': { abbr: 'SWAT' },
        'Secret Service': { abbr: 'USSS' },
        'Spetsnaz': { abbr: 'SPNZ' },
        'Spetsnaz CBRN': { abbr: 'SPC', color: '#7FD1A8' },
        'The Unit GSUTR': { abbr: 'UNIT' },
        'Unit 777': { abbr: '777' },
        'Team Rainbow': { abbr: 'RBW', color: '#6FD0E8' },
        'Six': { abbr: 'VI', color: '#B58BE8' }
    };

    function orgBadgeMeta(key) {
        const b = ORG_BADGE[key] || {};
        const g = (typeof ORGANIZATIONS !== 'undefined')
            ? ORGANIZATIONS.find(x => x.key === key) : null;
        const color = b.color
            || (g && g.country_code ? ORG_COLOR_BY_CODE[g.country_code] : null)
            || ORG_COLOR_DEFAULT;
        return { abbr: b.abbr || String(key || '?').slice(0, 3).toUpperCase(), color, org: g };
    }

    // 盾形徽章：填充 22% 底色 + 同色描边 + 缩写
    function orgBadgeSVG(key, h) {
        h = h || 20;
        const meta = orgBadgeMeta(key);
        const abbr = meta.abbr;
        const c = meta.color;
        const w = Math.max(h * 0.95, 8 + abbr.length * h * 0.36);
        const r = 1.2;
        const d = `M${r} ${r} H${(w - r).toFixed(1)} V${(h * 0.52).toFixed(1)}`
            + ` C${(w - r).toFixed(1)} ${(h * 0.8).toFixed(1)} ${(w * 0.63).toFixed(1)} ${(h - r).toFixed(1)} ${(w / 2).toFixed(1)} ${(h - r).toFixed(1)}`
            + ` C${(w * 0.37).toFixed(1)} ${(h - r).toFixed(1)} ${r} ${(h * 0.8).toFixed(1)} ${r} ${(h * 0.52).toFixed(1)} Z`;
        const fs = abbr.length <= 2 ? h * 0.46 : abbr.length === 3 ? h * 0.41
            : abbr.length === 4 ? h * 0.34 : h * 0.27;
        return `<svg class="org-badge-svg" width="${w.toFixed(1)}" height="${h}" viewBox="0 0 ${w.toFixed(1)} ${h}" aria-hidden="true">`
            + `<path d="${d}" fill="${c}" fill-opacity=".22" stroke="${c}" stroke-width="1.1" stroke-linejoin="round"/>`
            + `<text class="org-badge-text" x="${(w / 2).toFixed(1)}" y="${(h * 0.52 + fs * 0.35).toFixed(1)}" text-anchor="middle" fill="${c}" font-size="${fs.toFixed(1)}" font-weight="800">${esc(abbr)}</text>`
            + `</svg>`;
    }

    // 组织 chip：徽章 + 名称
    function orgChipHTML(key, opts) {
        if (!key) return '';
        const meta = orgBadgeMeta(key);
        const label = (typeof ORG_LABEL !== 'undefined' && ORG_LABEL[key] && ORG_LABEL[key].zh) || key;
        const size = (opts && opts.size) || 20;
        const withName = !opts || opts.name !== false;
        return `<span class="org-chip" data-org="${esc(key)}" title="${esc(key)} · ${esc(label)}（点击查看组织）">`
            + orgBadgeSVG(key, size)
            + (withName ? `<span class="org-chip-name">${esc(label)}</span>` : '')
            + `</span>`;
    }

    function operatorIconURL(op) {
        if (!op.icon) return null;
        // 本地图标（站内 images/ 目录）或绝对地址直接用，其余走 r6operators CDN
        if (/^(https?:)?\/\//.test(op.icon) || op.icon.indexOf('images/') === 0 || op.icon[0] === '.') {
            return op.icon;
        }
        return OPERATOR_ICON_CDN + op.icon;
    }

    // 干员立绘加载失败的降级链：立绘 → 军械库圆形头像 → 首字母占位
    window.__opImgFallback = function (img, iconUrl, initial) {
        if (!img) return;
        if (iconUrl && !img.dataset.fellBack) {
            img.dataset.fellBack = '1';
            img.className = 'op-icon-fallback';
            img.src = iconUrl;
            return;
        }
        const d = document.createElement('div');
        d.className = 'op-card-fallback';
        d.textContent = initial || '?';
        img.replaceWith(d);
    };

    // 生成干员视觉区 HTML（立绘优先，回退头像，再回退首字母）
    function opVisualHTML(o, portraitClass, initial) {
        const icon = operatorIconURL(o) || '';
        if (o.portrait) {
            return `<img class="${portraitClass}" src="${o.portrait}" alt="${esc(o.name)}" loading="lazy" onerror="__opImgFallback(this,'${icon}','${initial}')">`;
        }
        if (icon) {
            return `<img class="op-icon-fallback" src="${icon}" alt="${esc(o.name)}" loading="lazy" onerror="__opImgFallback(this,'','${initial}')">`;
        }
        return `<div class="op-card-fallback">${initial}</div>`;
    }

    function filteredOperators() {
        const q = opState.q.trim().toLowerCase();
        return OPERATORS.filter(o => {
            if (opState.side !== 'all' && o.side !== opState.side) return false;
            if (!q) return true;
            const hay = [o.name, o.realname, o.gadget, o.affiliation, o.birthplace,
                         ...(o.function || []), ...(o.weapons || [])]
                .filter(Boolean).join(' ').toLowerCase();
            return hay.includes(q);
        });
    }

    // 干员页签：卡片网格，点击弹出完整档案弹窗
    function renderOperators() {
        const box = $('#operator-cards');
        if (!box) return;
        const list = filteredOperators();
        const cnt = $('#op-count');
        if (cnt) cnt.textContent = `${list.length} / ${OPERATORS.length} 位`;

        box.innerHTML = list.map(o => {
            const badge = o.side === 'atk'
                ? '<b class="op-side atk">⚔️ 进攻</b>'
                : o.side === 'def' ? '<b class="op-side def">🛡️ 防守</b>' : '';
            const flag = (o.country || []).map(c => COUNTRY_FLAG[c] || '').join('');
            return `
                <div class="op-card" data-op="${o.name.replace(/'/g, "\\'")}" tabindex="0" role="button"
                     aria-label="查看 ${esc(o.name)} 的完整档案" title="点击查看 ${esc(o.name)} 档案">
                    <div class="op-card-visual">${opVisualHTML(o, 'op-card-portrait', o.name[0])}</div>
                    <div class="op-card-name">${esc(o.name)}${flag ? ' ' + flag : ''}</div>
                    <div class="op-card-meta">
                        ${badge}
                        ${o.armor ? `<span class="op-stat">🛡 ${o.armor}</span>` : ''}
                        ${o.speed ? `<span class="op-stat">🏃 ${SPEED_LABEL[o.speed] || o.speed}</span>` : ''}
                    </div>
                    <div class="op-card-org">${o.affiliation ? orgChipHTML(o.affiliation, { size: 18 }) : '<span class="muted">暂无组织</span>'}</div>
                    <div class="op-card-gadget">${(o.gadget_zh || o.gadget) ? esc(o.gadget_zh || o.gadget) : '<span class="muted">无固定独特技能</span>'}</div>
                </div>`;
        }).join('');

        box.querySelectorAll('.op-card').forEach(card => {
            const open = () => openOperatorModal(card.dataset.op);
            card.addEventListener('click', e => {
                if (e.target.closest('.org-chip')) return;
                open();
            });
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
            });
            const chip = card.querySelector('.org-chip[data-org]');
            if (chip) {
                chip.style.cursor = 'pointer';
                chip.addEventListener('click', e => { e.stopPropagation(); focusOrg(chip.dataset.org); });
            }
        });
    }

    // 弹窗/页签内的交互：分区快跳按钮 / 武器 chip / 组织 chip
    function bindOperatorBody(scope) {
        scope.querySelectorAll('.op-jump-btn').forEach(b => {
            b.addEventListener('click', e => {
                e.stopPropagation();
                const sec = document.getElementById(b.dataset.jump);
                if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
        scope.querySelectorAll('.op-weapon-chip').forEach(chip => {
            chip.style.cursor = 'pointer';
            chip.addEventListener('click', e => {
                e.stopPropagation();
                const w = WEAPONS.find(x => x.name === chip.dataset.weapon);
                if (!w || typeof showWeaponDetail !== 'function') return;
                // 两个弹窗 z-index 相同，先关干员弹窗再开武器弹窗，避免被盖住
                const opModal = $('#operator-modal');
                if (opModal) opModal.classList.remove('active');
                showWeaponDetail(w.name);
            });
        });
        scope.querySelectorAll('.org-chip[data-org]').forEach(c => {
            c.style.cursor = 'pointer';
            c.addEventListener('click', e => {
                e.stopPropagation();
                closeDrawer(c.closest('.modal'), true);
                focusOrg(c.dataset.org);
            });
        });
    }

    // 点组织徽章 → 跳到组织图鉴并高亮该组织
    function focusOrg(key) {
        switchTab('orgs');
        const card = [...document.querySelectorAll('.org-card')].find(c => c.dataset.org === key);
        if (!card) return;
        card.classList.remove('flash');
        void card.offsetWidth;
        card.classList.add('flash');
        requestAnimationFrame(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    }

    // 从其他页面跳转过来：切到干员页签 → 复位筛选 → 直接弹出该干员档案
    function focusOperator(name) {
        switchTab('operators');

        const o = OPERATORS.find(x => x.name === name);
        if (o) {
            let dirty = false;
            if (opState.side !== 'all' && o.side !== opState.side) { opState.side = 'all'; dirty = true; }
            const q = opState.q.trim().toLowerCase();
            if (q && !filteredOperators().some(x => x.name === name)) {
                opState.q = '';
                const inp = $('#op-search-input');
                if (inp) inp.value = '';
                dirty = true;
            }
            if (dirty) {
                $$('.op-filter').forEach(b => b.classList.toggle('active', b.dataset.side === 'all'));
                renderOperators();
            }
            const card = [...document.querySelectorAll('.op-card')].find(c => c.dataset.op === name);
            if (card) {
                card.classList.remove('flash');
                void card.offsetWidth;
                card.classList.add('flash');
            }
        }
        openOperatorModal(name);
    }

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // 长文本按段落渲染
    function para(text, cls) {
        return String(text).split(/\n+/).map(s => s.trim()).filter(Boolean)
            .map(s => `<p${cls ? ' class="' + cls + '"' : ''}>${esc(s)}</p>`).join('');
    }

    // 列表渲染（培训 / 经验 / 关系 / 提示 / 琐事 / 台词）
    function bullets(arr, cls) {
        if (!Array.isArray(arr) || !arr.length) return '';
        return `<ul class="${cls || 'op-lore-list'}">${arr.map(s => `<li>${esc(s)}</li>`).join('')}</ul>`;
    }

    function sectionTitle(text) {
        return `<div class="op-detail-section-title">${esc(text)}</div>`;
    }

    function operatorSections(o) {
        if (!o) return { head: '', panes: [] };
        const flag = (o.country || []).map(c => COUNTRY_FLAG[c] || '').join('');

        // 武器按「主武器 / 副武器」分组展示
        const weaponChip = w => {
            const wd = WEAPONS.find(x => x.name === w);
            const cat = wd ? (TYPE_NAMES[wd.type] || wd.type) : '';
            return `<span class="op-weapon-chip" data-weapon="${w.replace(/'/g, "\\'")}" title="查看 ${esc(w)} 详情">
                        ${thumbImgHTML(w, 'op-weapon-thumb')}
                        <span class="op-weapon-name">${esc(w)}</span>
                        ${cat ? `<em>${esc(cat)}</em>` : ''}
                    </span>`;
        };
        const opWeaponNames = o.weapons || [];
        const primNames = [], secNames = [], otherNames = [];
        opWeaponNames.forEach(w => {
            const wd = WEAPONS.find(x => x.name === w);
            if (!wd) otherNames.push(w);
            else if (isPrimary(wd.type)) primNames.push(w);
            else if (isSecondary(wd.type)) secNames.push(w);
            else otherNames.push(w);
        });
        const wGroup = (title, names, icon) => names.length
            ? `<div class="op-wgroup">
                   <div class="op-wgroup-title">${icon} ${title} · ${names.length}</div>
                   <div class="op-detail-weapons">${names.map(weaponChip).join('')}</div>
               </div>`
            : '';
        const weapons = wGroup('主武器', primNames, '🔫')
            + wGroup('副武器', secNames, '🔫')
            + wGroup('其他', otherNames, '🧰');

        // ---- 独立技能面板 ----
        const gTitleRaw = o.gadget_zh || o.gadget;
        const gIcon = o.gadgetIcon
            ? `<img class="op-gadget-icon" src="${o.gadgetIcon}" alt="${esc(o.gadgetIconName || o.gadget || '技能图标')}" loading="lazy" onerror="this.style.display='none'">`
            : '';
        const gadgetPane = gTitleRaw ? (() => {
            const zh = o.gadget_zh, en = o.gadget;
            const title = zh && en && zh !== en
                ? `${esc(zh)} <span class="op-gadget-en">${esc(en)}</span>`
                : esc(zh || en);
            const desc = o.gadget_zh_desc || o.gadget_desc;
            const stats = (o.gadget_stats || []);
            return `${gIcon}
                <div class="op-detail-gadget">${title}</div>
                ${desc ? `<div class="op-detail-desc">${esc(desc)}</div>` : ''}
                ${stats.length ? `<ul class="op-gadget-stats">${stats.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
                ${(o.gadget_zh_desc && /^(俗称|别名|又名)/.test(o.gadget_zh_desc)) ? `
                    <div class="op-detail-desc">🏷️ ${esc(o.gadget_zh_desc)}<span style="color:var(--text-muted)">（玩家俗称）</span></div>` : ''}`;
        })()
            : `<div class="op-detail-note muted">⚠️ 该干员<strong>没有固定独特技能</strong>（Liquipedia 干员页无 GadgetCard 条目）。
                Recruit 类干员（如 Striker / Sentry）不设专属装备，可在装备池中自由搭配。</div>`;

        // ---- 背景故事面板 ----
        const lorePane = (o.bio || o.psych || o.note) ? `
            ${o.bio ? sectionTitle('背景') + `<div class="op-prose">${para(o.bio)}</div>` : ''}
            ${o.psych ? sectionTitle('心理状态报告') + `<div class="op-prose op-psych">${para(o.psych)}</div>` : ''}
            ${o.note ? sectionTitle('附注 · 装备评估') + `<div class="op-prose op-note">${para(o.note)}</div>` : ''}`
            : '<div class="op-detail-note muted">暂无该干员的背景故事资料。</div>';

        // ---- 培训与经验面板 ----
        const recordPane = ((o.training || []).length || (o.experience || []).length) ? `
            ${(o.training || []).length ? sectionTitle('培训经历') + bullets(o.training, 'op-chip-list') : ''}
            ${(o.experience || []).length ? sectionTitle('相关经验') + bullets(o.experience, 'op-chip-list') : ''}`
            : '<div class="op-detail-note muted">暂无培训 / 经验记录。</div>';

        // ---- 人际关系与轶事面板 ----
        const socialPane = (o.anecdote || (o.relations || []).length) ? `
            ${o.anecdote ? sectionTitle('干员轶事') + `<div class="op-prose">${para(o.anecdote)}</div>` : ''}
            ${(o.relations || []).length ? sectionTitle('人际关系') + bullets(o.relations) : ''}`
            : '<div class="op-detail-note muted">暂无人际关系与轶事记录。</div>';

        // ---- 战术要点面板 ----
        const tipsPane = (o.tips || []).length
            ? sectionTitle('游戏策略') + bullets(o.tips, 'op-tip-list')
            : '<div class="op-detail-note muted">暂无战术要点记录。</div>';

        // ---- 琐事与台词面板 ----
        const triviaPane = ((o.trivia || []).length || (o.quotes || []).length) ? `
            ${(o.trivia || []).length ? sectionTitle('琐事') + bullets(o.trivia) : ''}
            ${(o.quotes || []).length ? sectionTitle('台词') + bullets(o.quotes, 'op-quote-list') : ''}`
            : '<div class="op-detail-note muted">暂无琐事 / 台词记录。</div>';

        // ---- 装备与档案面板 ----
        // lore.js 中 org_label 是 {zh,en,country,code,type} 对象
        const orgZh = o.org_label ? (typeof o.org_label === 'string' ? o.org_label : (o.org_label.zh || null)) : null;
        const orgText = o.affiliation
            ? esc(o.affiliation) + (orgZh && orgZh !== o.affiliation ? ` <span class="op-org-label">${esc(orgZh)}</span>` : '')
            : '';
        const kitPane = `
            ${sectionTitle('武器装备 · 共 ' + (o.weapons || []).length + ' 把（主 ' + primNames.length + ' / 副 ' + secNames.length + '）')}
            ${weapons || '<div class="op-detail-note muted">暂无武器数据</div>'}
            ${sectionTitle('档案')}
            <div class="op-detail-profile">
                ${orgText ? `<div><span>所属</span>${orgText}</div>` : ''}
                ${o.birthplace ? `<div><span>出生地</span>${esc(o.birthplace)}</div>` : ''}
                ${o.birthdate ? `<div><span>生日</span>${esc(o.birthdate)}</div>` : ''}
                ${o.releasedate ? `<div><span>上线</span>${esc(o.releasedate)}</div>` : ''}
            </div>
            ${(o.function || []).length ? sectionTitle('职能定位') + `<div class="op-func-tags">${o.function.map(f => `<span class="op-func-tag">${esc(f)}</span>`).join('')}</div>` : ''}`;

        // 展示顺序：装备 → 独特技能 → 其他（背景 / 培训 / 人际 / 战术 / 琐事）
        const panes = [
            { id: 'kit', label: '🔫 装备 · 档案', html: kitPane, on: true },
            { id: 'gadget', label: '🛠 独特技能', html: gadgetPane, on: true },
            { id: 'lore', label: '📖 背景故事', html: lorePane, on: !!(o.bio || o.psych || o.note) },
            { id: 'record', label: '🎓 培训 · 经验', html: recordPane, on: ((o.training || []).length + (o.experience || []).length) > 0 },
            { id: 'social', label: '🤝 人际关系', html: socialPane, on: !!(o.anecdote || (o.relations || []).length) },
            { id: 'tips', label: '🧭 战术要点', html: tipsPane, on: (o.tips || []).length > 0 },
            { id: 'trivia', label: '💡 琐事 · 台词', html: triviaPane, on: ((o.trivia || []).length + (o.quotes || []).length) > 0 }
        ].filter(p => p.on);

        // 详情头：大立绘 + 完整标签（组织用徽章）
        const orgTag = o.affiliation
            ? `<span class="op-tag org">${orgChipHTML(o.affiliation, { size: 18 })}</span>`
            : '';
        const head = `
            <div class="op-detail-head">
                <div class="op-detail-visual">
                    ${opVisualHTML(o, 'op-detail-portrait', o.name[0])}
                </div>
                <div class="op-detail-meta">
                    <div class="op-detail-name">${o.name} ${flag}</div>
                    ${o.realname ? `<div class="op-detail-en">${esc(o.realname)}</div>` : ''}
                    <div class="op-detail-tags">
                        <span class="op-tag ${o.side}">${o.side === 'atk' ? '⚔️ 进攻方' : o.side === 'def' ? '🛡️ 防守方' : '双阵营'}</span>
                        ${o.armor ? `<span class="op-tag">🛡 护甲 ${o.armor}</span>` : ''}
                        ${o.speed ? `<span class="op-tag">🏃 ${SPEED_LABEL[o.speed] || o.speed}</span>` : ''}
                        ${o.difficulty ? `<span class="op-tag">难度 ${DIFF_LABEL[o.difficulty] || o.difficulty}</span>` : ''}
                        ${orgTag}
                    </div>
                    ${(o.function || []).length ? `<div class="op-detail-func">职能：${o.function.map(esc).join(' / ')}</div>` : ''}
                </div>
            </div>`;

        return { head, panes };
    }

    // 干员唯一 id：用于分区锚点，避免多干员同时展开时 id 冲突
    function opUid(o) {
        return String(o.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    // 展开态完整档案：所有内容上下平铺，顶部附分区快跳按钮
    function operatorBodyHTML(o) {
        const { head, panes } = operatorSections(o);
        const uid = opUid(o);
        const jump = panes.length > 2
            ? `<div class="op-jump">${panes.map(p =>
                `<button class="op-jump-btn" data-jump="op-sec-${p.id}-${uid}">${esc(p.label)}</button>`).join('')}</div>`
            : '';
        return head + jump + panes.map(p => `
            <section class="op-sec" id="op-sec-${p.id}-${uid}">
                <h4 class="op-sec-title">${esc(p.label)}</h4>
                ${p.html}
            </section>`).join('');
    }

    // 干员详情弹窗：内容全部垂直平铺，可直接滚动看完整份档案
    function openOperatorModal(name) {
        const o = OPERATORS.find(x => x.name === name);
        const modal = $('#operator-modal');
        if (!o || !modal) return;
        const body = $('#operator-modal-body');
        body.innerHTML = operatorBodyHTML(o);
        bindOperatorBody(body);
        modal.classList.add('active');
        const content = modal.querySelector('.modal-content');
        if (content) content.scrollTop = 0;
    }

    // ============================================================
    //                        组 织 图 鉴
    // ============================================================
    const orgState = { type: 'all', q: '' };
    const ORG_TYPE_LABEL = { real: '现实部队', fictional: '游戏原创', faction: '阵营 / 编制' };
    const ORG_TYPE_ICON = { real: '🌐', fictional: '🎮', faction: '🏳️' };

    function orgMemberChips(g) {
        return (g.members || []).map(n => {
            const op = OPERATORS.find(x => x.name === n);
            const icon = op ? operatorIconURL(op) : null;
            return `<span class="org-member" data-op="${n.replace(/'/g, "\\'")}" title="${esc(n)}">
                        ${icon ? `<img src="${icon}" alt="${esc(n)}" loading="lazy" onerror="this.style.display='none'">` : ''}
                        <b>${esc(n)}</b>
                        ${op ? `<i class="${op.side === 'atk' ? 'atk' : 'def'}">${op.side === 'atk' ? '攻' : '防'}</i>` : ''}
                    </span>`;
        }).join('');
    }

    function renderOrgs() {
        const box = $('#org-cards');
        if (!box || typeof ORGANIZATIONS === 'undefined') return;
        const q = orgState.q.trim().toLowerCase();
        const list = ORGANIZATIONS.filter(g => {
            if (orgState.type !== 'all' && g.type !== orgState.type) return false;
            if (!q) return true;
            const hay = [g.name_zh, g.name_en, g.key, g.country, ...(g.tags || []), ...(g.members || [])]
                .filter(Boolean).join(' ').toLowerCase();
            return hay.includes(q);
        }).sort((a, b) => (b.members.length - a.members.length)
            || String(a.name_zh).localeCompare(String(b.name_zh), 'zh'));

        const cnt = $('#org-count');
        if (cnt) cnt.textContent = `${list.length} / ${ORGANIZATIONS.length} 个组织`;
        const total = $('#org-total');
        if (total) total.textContent = ORGANIZATIONS.length;

        box.innerHTML = list.map(g => {
            const flag = g.country_code ? (COUNTRY_FLAG[g.country_code] || '') : '🏳️';
            return `
            <div class="org-card type-${g.type || 'real'}" data-org="${esc(g.key)}">
                <div class="org-card-head">
                    ${orgChipHTML(g.key, { size: 28, name: false })}
                    <span class="org-card-flag">${flag}</span>
                    <span class="org-card-name">${esc(g.name_zh || g.key)}</span>
                    <span class="org-type ${g.type || 'real'}">${ORG_TYPE_ICON[g.type] || '🌐'} ${ORG_TYPE_LABEL[g.type] || g.type || '—'}</span>
                </div>
                <div class="org-card-en">${esc(g.name_en || '')}</div>
                <div class="org-card-meta">
                    ${g.country ? `<span>📍 ${esc(g.country)}</span>` : ''}
                    ${g.founded ? `<span>🗓 ${esc(g.founded)}</span>` : ''}
                    <span class="org-count-badge">👥 ${(g.members || []).length}</span>
                </div>
                <div class="org-card-desc">${esc(g.desc || '暂无简介')}</div>
                ${(g.tags || []).length ? `<div class="org-tags">${g.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
                ${(g.members || []).length ? `<div class="org-members">${orgMemberChips(g)}</div>` : '<div class="org-members empty">暂无在编干员</div>'}
                ${g.source ? `<div class="org-source">来源：${esc(g.source)}</div>` : ''}
            </div>`;
        }).join('');

        box.querySelectorAll('.org-member').forEach(m => {
            m.style.cursor = 'pointer';
            m.addEventListener('click', () => focusOperator(m.dataset.op));
        });
    }

    function initOrgs() {
        renderOrgs();
        $$('.org-filter').forEach(b => {
            b.addEventListener('click', () => {
                $$('.org-filter').forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                orgState.type = b.dataset.orgType;
                renderOrgs();
            });
        });
        const inp = $('#org-search-input');
        if (inp) inp.addEventListener('input', () => { orgState.q = inp.value; renderOrgs(); });
    }

    // ============================================================
    //                        世 界 观
    // ============================================================
    function renderWorld() {
        const box = $('#world-body');
        if (!box || typeof WORLD_LORE === 'undefined') return;
        const w = WORLD_LORE;
        box.innerHTML = `
            <div class="world-intro op-prose">${para(w.intro || '')}</div>
            <h3 class="world-h3">📜 剧情时间线 · ${(w.timeline || []).length} 个节点</h3>
            <div class="world-timeline">
                ${(w.timeline || []).map(t => `
                    <div class="tl-item">
                        <div class="tl-year">${esc(t.year)}${t.season ? `<em>${esc(t.season)}</em>` : ''}</div>
                        <div class="tl-body">
                            <div class="tl-title">${esc(t.title)}</div>
                            <div class="tl-desc">${esc(t.desc)}</div>
                            ${t.source ? `<div class="tl-src">来源：${esc(t.source)}</div>` : ''}
                        </div>
                    </div>`).join('')}
            </div>
            <h3 class="world-h3">👤 关键人物 · ${(w.figures || []).length}</h3>
            <div class="world-figures">
                ${(w.figures || []).map(f => `
                    <div class="wf-card">
                        <div class="wf-name">${esc(f.name_zh || f.name)}<em>${esc(f.name || '')}</em></div>
                        <div class="wf-role">${esc(f.role || '')}</div>
                        <div class="wf-desc">${esc(f.desc || '')}</div>
                        ${(f.related || []).length ? `<div class="wf-rel">${f.related.map(r => `<span>${esc(r)}</span>`).join('')}</div>` : ''}
                        ${f.source ? `<div class="wf-src">来源：${esc(f.source)}</div>` : ''}
                    </div>`).join('')}
            </div>
            <h3 class="world-h3">🏳️ 阵营与势力 · ${(w.factions || []).length}</h3>
            <div class="world-factions">
                ${(w.factions || []).map(f => `
                    <div class="wfa-card">
                        <div class="wfa-head"><span class="wfa-name">${esc(f.name)}</span><span class="wfa-rel">${esc(f.relation || '')}</span></div>
                        <div class="wfa-desc">${esc(f.desc || '')}</div>
                        ${f.source ? `<div class="wfa-src">来源：${esc(f.source)}</div>` : ''}
                    </div>`).join('')}
            </div>
            <h3 class="world-h3">📚 资料来源 · ${(w.sources || []).length}</h3>
            <ul class="world-sources">${(w.sources || []).map(s => `<li>${esc(s)}</li>`).join('')}</ul>
        `;
    }

    function initOperators() {
        renderOperators();
        $$('.op-filter').forEach(b => {
            b.addEventListener('click', () => {
                $$('.op-filter').forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                opState.side = b.dataset.side;
                renderOperators();
            });
        });
        const inp = $('#op-search-input');
        if (inp) inp.addEventListener('input', () => {
            opState.q = inp.value;
            renderOperators();
        });
    }

    // 武器卡内的配件 chip：点它开配件详情，不触发外层卡片的武器详情
    const wGrid = $('#weapon-grid');
    if (wGrid) wGrid.addEventListener('click', e => {
        const chip = e.target.closest('.att-chip[data-att-key]');
        if (!chip) return;
        e.stopPropagation();
        openAttachmentModal(chip.dataset.attKey);
    });

    // ---- 回到顶部 ----
    const backTop = $('#back-to-top');
    if (backTop) {
        backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', () => {
            backTop.classList.toggle('show', window.scrollY > 600);
        }, { passive: true });
    }

    // ---- 初始化 ----
    renderWeaponGrid();
    renderAttachmentCards();
    if (typeof OPERATORS !== 'undefined') initOperators();
    if (typeof ORGANIZATIONS !== 'undefined') initOrgs();
    if (typeof WORLD_LORE !== 'undefined') renderWorld();
    initCompatQuery();
    initCompare();
    renderUpdates();

})();
