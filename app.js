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

            return `
                <div class="weapon-card" data-type="${w.type}" data-category="${category}" data-name="${w.name}" onclick="showWeaponDetail('${w.name.replace(/'/g, "\\'")}')">
                    <div class="weapon-card-header">
                        <span class="weapon-name">${w.name}</span>
                        <span class="weapon-type-badge ${w.type}">${TYPE_NAMES[w.type]}</span>
                    </div>
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
                        <span>干员：</span>${w.operators.join(', ')}
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

        // 武器档案（现实原型信息）
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
        }

        // 琐事/冷知识
        let triviaHTML = '';
        if (detail && detail.trivia && detail.trivia.length > 0) {
            triviaHTML = `
            <div class="modal-section">
                <div class="modal-section-title">冷知识 & 琐事</div>
                <div class="trivia-list">
                    ${detail.trivia.map(t => `<div class="trivia-item"><span class="trivia-bullet">▸</span>${t}</div>`).join('')}
                </div>
            </div>`;
        }

        // 枪管配件
        let barrelHTML = '';
        if (w.barrels.length > 0) {
            barrelHTML = `
                <div class="modal-att-group">
                    <div class="modal-att-group-title">枪管配件</div>
                    <div class="modal-att-list">
                        ${w.barrels.map(b => {
                            const isNew = w.y7s3_new?.barrels?.includes(b);
                            return `<span class="modal-att-item${isNew ? ' y7s3-new' : ''}">${BARREL_NAMES[b]}</span>`;
                        }).join('')}
                    </div>
                </div>
            `;
        } else {
            barrelHTML = '<div class="modal-att-group"><div class="modal-att-group-title">枪管配件</div><span class="modal-att-item unavailable">无可用枪管配件</span></div>';
        }

        // 握把配件
        let gripHTML = '';
        if (w.grips.length > 0) {
            gripHTML = `
                <div class="modal-att-group">
                    <div class="modal-att-group-title">握把配件</div>
                    <div class="modal-att-list">
                        ${w.grips.map(g => {
                            const isNew = w.y7s3_new?.grips?.includes(g);
                            return `<span class="modal-att-item${isNew ? ' y7s3-new' : ''}">${GRIP_NAMES[g]}</span>`;
                        }).join('')}
                    </div>
                </div>
            `;
        } else {
            gripHTML = '<div class="modal-att-group"><div class="modal-att-group-title">握把配件</div><span class="modal-att-item unavailable">无可用握把配件</span></div>';
        }

        // 配件效果详情
        let effectsHTML = '';
        w.barrels.forEach(bKey => {
            const att = ATTACHMENT_DATA.barrels[bKey];
            if (!att) return;
            effectsHTML += `
                <div style="margin-bottom:12px;padding:10px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid var(--border)">
                    <div style="font-size:13px;font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:6px">
                        <span>${att.icon}</span> ${att.name}
                        <span style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono)">${att.nameEn}</span>
                    </div>
                    ${att.effects.map(e => `
                        <div style="font-size:12px;display:flex;gap:8px;padding:2px 0;color:var(--${e.type === 'positive' ? 'success' : e.type === 'negative' ? 'danger' : e.type === 'info' ? 'accent' : 'text-secondary'})">
                            <span style="font-family:var(--font-mono);font-weight:600;min-width:80px">${e.value}</span>
                            <span>${e.label}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        });
        w.grips.forEach(gKey => {
            const att = ATTACHMENT_DATA.grips[gKey];
            if (!att) return;
            effectsHTML += `
                <div style="margin-bottom:12px;padding:10px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid var(--border)">
                    <div style="font-size:13px;font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:6px">
                        <span>${att.icon}</span> ${att.name}
                        <span style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono)">${att.nameEn}</span>
                    </div>
                    ${att.effects.map(e => `
                        <div style="font-size:12px;display:flex;gap:8px;padding:2px 0;color:var(--${e.type === 'positive' ? 'success' : e.type === 'negative' ? 'danger' : e.type === 'info' ? 'accent' : 'text-secondary'})">
                            <span style="font-family:var(--font-mono);font-weight:600;min-width:80px">${e.value}</span>
                            <span>${e.label}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        });

        body.innerHTML = `
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
                ${detail ? `<div class="modal-stat">
                    <div class="modal-stat-value" style="font-size:13px">${detail.caliber}</div>
                    <div class="modal-stat-label">口径</div>
                </div>` : ''}
                <div class="modal-stat">
                    <div class="modal-stat-value">${w.mag}</div>
                    <div class="modal-stat-label">弹匣容量</div>
                </div>
            </div>

            ${profileHTML}

            <div class="modal-section">
                <div class="modal-section-title">使用干员</div>
                <div class="modal-operators">
                    ${w.operators.map(op => {
                        const side = w.side === 'atk' ? 'atk' : w.side === 'def' ? 'def' : 'atk';
                        return `<span class="modal-op-tag ${side}">${op}</span>`;
                    }).join('')}
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-title">可用配件 <span style="font-size:11px;color:var(--accent);font-weight:400">★ = Y7S3新增</span></div>
                ${barrelHTML}
                ${gripHTML}
            </div>

            ${effectsHTML ? `
            <div class="modal-section">
                <div class="modal-section-title">配件效果详情</div>
                ${effectsHTML}
            </div>` : ''}

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
            </div>` : ''}

            ${triviaHTML}
        `;

        modal.classList.add('active');
    };

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
            ...Object.values(ATTACHMENT_DATA.underbarrel)
        ];

        container.innerHTML = allAttachments.map(att => {
            const slotLabel = att.slot === 'barrel' ? '枪管' : att.slot === 'grip' ? '握把' : '下挂';
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
            const source = slot === 'barrel' ? BARREL_NAMES : GRIP_NAMES;
            attSelect.innerHTML = Object.entries(source).map(([k, v]) =>
                `<option value="${k}">${v}</option>`
            ).join('');
            updateResults();
        }

        function updateResults() {
            const slot = slotSelect.value;
            const att = attSelect.value;
            const field = slot === 'barrel' ? 'barrels' : 'grips';
            const matched = WEAPONS.filter(w => w[field].includes(att));

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
            { label: '干员', key: 'operators', format: w => w.operators.join(', ') },
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
