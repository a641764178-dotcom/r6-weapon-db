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

    const BARREL_NAMES = {
        muzzle_brake: '制退器', compensator: '补偿器', flash_hider: '消焰器',
        suppressor: '消音器', extended_barrel: '加长枪管'
    };
    const GRIP_NAMES = {
        vertical_grip: '垂直握把', angled_grip: '转角握把'
    };
    const SIGHT_NAMES = {
        red_dot: '红点', holographic: '全息', reflex: '反射',
        scope_1_5x: '1.5x', scope_2_0x: '2.0x', scope_2_5x: '2.5x', scope_3_0x: '3.0x'
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
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const tab = link.dataset.tab;
            $$('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            $$('.tab-content').forEach(t => t.classList.remove('active'));
            $(`#tab-${tab}`).classList.add('active');
        });
    });

    // ---- 武器库 ----
    let currentFilter = 'all';
    let currentSearch = '';
    let currentSort = 'name';

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

    function renderWeaponGrid() {
        const weapons = getFilteredWeapons();
        const grid = $('#weapon-grid');
        const count = $('#weapon-count');

        // 统计主副武器数量
        const primaryCount = weapons.filter(w => isPrimary(w.type)).length;
        const secondaryCount = weapons.filter(w => isSecondary(w.type)).length;
        count.textContent = `共 ${weapons.length} 把武器（主武器 ${primaryCount} / 副武器 ${secondaryCount}）`;

        if (weapons.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted);">没有匹配的武器</div>';
            return;
        }

        grid.innerHTML = weapons.map(w => {
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
                attTags.push(`<span class="att-tag${isNew ? ' new' : ''}">${BARREL_NAMES[b]}</span>`);
            });
            w.grips.forEach(g => {
                const isNew = w.y7s3_new?.grips?.includes(g);
                attTags.push(`<span class="att-tag${isNew ? ' new' : ''}">${GRIP_NAMES[g]}</span>`);
            });
            if (w.barrels.length === 0 && w.grips.length === 0) {
                attTags.push('<span class="att-tag" style="color:var(--danger)">无配件</span>');
            }

            const thumbURL = (typeof getWeaponThumbURL === 'function') ? getWeaponThumbURL(w.name) : null;

            return `
                <div class="weapon-card" data-type="${w.type}" data-category="${category}" data-name="${w.name}" onclick="showWeaponDetail('${w.name.replace(/'/g, "\\'")}')">
                    <div class="weapon-card-header">
                        <span class="weapon-name">${w.name}</span>
                        <span class="weapon-type-badge ${w.type}">${TYPE_NAMES[w.type]}</span>
                    </div>
                    ${thumbURL ? `<div class="weapon-thumb-row"><img class="weapon-thumb" src="${thumbURL}" alt="${w.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.style.display='none'"></div>` : ''}
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
        }).join('');
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

    // 搜索框
    $('#weapon-search').addEventListener('input', e => {
        currentSearch = e.target.value;
        renderWeaponGrid();
    });

    // 排序
    $('#weapon-sort').addEventListener('change', e => {
        currentSort = e.target.value;
        renderWeaponGrid();
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
        const thumbURL = (typeof getWeaponThumbURL === 'function') ? getWeaponThumbURL(w.name) : null;
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
        // 1. 瞄准镜
        let sightsHTML = '';
        if (ext && ext.sights && ext.sights.length > 0) {
            sightsHTML = `
                <div class="modal-att-group">
                    <div class="modal-att-group-title">🔭 瞄准镜</div>
                    <div class="modal-att-list">
                        ${ext.sights.map(s => `<span class="modal-att-item sight-item" data-att-key="${s}" data-att-slot="sight">${SIGHT_NAMES[s] || s}</span>`).join('')}
                    </div>
                </div>
            `;
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
                            return `<span class="modal-att-item${isNew ? ' y7s3-new' : ''}" data-att-key="${b}" data-att-slot="barrel">${BARREL_NAMES[b]}</span>`;
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
                            return `<span class="modal-att-item${isNew ? ' y7s3-new' : ''}" data-att-key="${g}" data-att-slot="grip">${GRIP_NAMES[g]}</span>`;
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
                        <span class="modal-att-item" data-att-key="laser_sight" data-att-slot="underbarrel">激光瞄准器</span>
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
            ${thumbURL ? `<div class="modal-weapon-image"><img src="${thumbURL}" alt="${w.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.style.display='none'"></div>` : ''}
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
                <div class="modal-section-title">使用干员</div>
                <div class="modal-operators">
                    ${w.operators.map(op => {
                        const side = w.side === 'atk' ? 'atk' : w.side === 'def' ? 'def' : 'atk';
                        const iconUrl = getOperatorIconURL(op);
                        const iconHTML = iconUrl ? `<img class="modal-op-icon" src="${iconUrl}" alt="${op}" loading="lazy">` : '';
                        return `<span class="modal-op-tag ${side}">${iconHTML}${op}</span>`;
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

        modal.classList.add('active');
    };

    // 后坐力百分比工具函数
    function recoilPercent(level) {
        const map = { 'very_low': '15%', 'low': '30%', 'medium': '55%', 'high': '75%', 'very_high': '95%', 'n/a': '0%' };
        return map[level] || '50%';
    }

    // 关闭弹窗
    $('.modal-close').addEventListener('click', () => $('#weapon-modal').classList.remove('active'));
    $('.modal-overlay').addEventListener('click', () => $('#weapon-modal').classList.remove('active'));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') $('#weapon-modal').classList.remove('active');
    });

    // ---- 配件图鉴 ----
    function renderAttachmentCards() {
        const container = $('#attachment-cards');
        const allAttachments = [
            ...Object.values(ATTACHMENT_DATA.barrels),
            ...Object.values(ATTACHMENT_DATA.grips),
            ...Object.values(ATTACHMENT_DATA.underbarrel),
            ...(ATTACHMENT_DATA.sights ? Object.values(ATTACHMENT_DATA.sights) : [])
        ];

        container.innerHTML = allAttachments.map(att => {
            const slotLabel = att.slot === 'barrel' ? '枪管' : att.slot === 'grip' ? '握把' : att.slot === 'sight' ? '瞄具' : '下挂';
            return `
                <div class="att-card">
                    <div class="att-card-header">
                        <div class="att-icon" style="background:rgba(255,255,255,0.05)">${att.icon}</div>
                        <div>
                            <div class="att-card-name">${att.name}</div>
                            <div class="att-card-name-en">${att.nameEn}</div>
                        </div>
                        <div class="att-card-slot">${slotLabel}配件</div>
                    </div>
                    <div class="att-effects">
                        ${att.effects.map(e => `
                            <div class="att-effect ${e.type}">
                                <span class="att-effect-value">${e.value}</span>
                                <span>${e.label}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top:12px;font-size:12px;color:var(--text-muted);line-height:1.6">${att.description}</div>
                    <div style="margin-top:8px;font-size:11px;color:var(--accent)">适用：${att.bestFor}</div>
                </div>
            `;
        }).join('');
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
                    return ext && ext.sights && ext.sights.includes(att);
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

    // ---- 初始化 ----
    renderWeaponGrid();
    renderAttachmentCards();
    initCompatQuery();
    initCompare();
    renderUpdates();

})();
